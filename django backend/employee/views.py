from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND , HTTP_201_CREATED ,HTTP_403_FORBIDDEN, HTTP_401_UNAUTHORIZED
from requests import models
from datetime import date
from requests import serializer
from rest_framework.authtoken.models import Token
from requests.permissions import IsEmployee
from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
import logging
logger = logging.getLogger(__name__)

@api_view(["GET"])
@csrf_exempt
@permission_classes((IsEmployee,))
def requests_employee(request):
    '''
    Function to display the travel requests of the logged-in employee.
    '''
    try:
        if request.method == "GET":
            if request.user.id:
                user_id = request.user.id
                try:
                    employee = models.Employee.objects.get(user__id=user_id)
                    employee_id = employee.id
                    query = models.TravelRequest.objects.prefetch_related('employee', 'manager').filter(employee_id=employee_id)
                except ObjectDoesNotExist:
                    return Response({"error": "Employee not found for this user"}, status=HTTP_400_BAD_REQUEST)
            else:
                query = models.TravelRequest.objects.prefetch_related('employee', 'manager').all()

            status_filter = request.query_params.get("status")
            date_sort = request.query_params.get("date_sort")
            from_date = request.query_params.get("from")
            to_date = request.query_params.get("to")

            try:
                start_date = date(2024, 1, 1)
                end_date = date(2024, 1, 31)
            except ValueError:
                return Response({"error": "Invalid date format"}, status=HTTP_400_BAD_REQUEST)

            if status_filter:
                query = query.filter(status=status_filter)
            if from_date:
                query = query.filter(date_submitted__date__range=(from_date, to_date))
            if date_sort == "asc":
                query = query.order_by("date_submitted")
            elif date_sort == "desc":
                query = query.order_by("-date_submitted")

            serialized_query = serializer.RequestSerializerEmployee(query, many=True)
            logger.info("User accessed list")
            return Response(serialized_query.data, HTTP_200_OK)

    except DatabaseError:
        return Response({"error": "Database error occurred"}, status=HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@permission_classes((IsEmployee,))
def view_request_employee(request, request_id):
    '''
    Function to display all the details of a particular travel request to an employee pertaining to the id given in the URL.
    '''
    try:
        query = models.TravelRequest.objects.get(pk=request_id)
        serialized_query = serializer.TravelSerializer(query)
        return Response(serialized_query.data, HTTP_200_OK)

    except models.TravelRequest.DoesNotExist:
        return Response({"error": "Travel request not found"}, status=HTTP_404_NOT_FOUND)

    except ValueError:
        return Response({"error": "Invalid request ID"}, status=HTTP_400_BAD_REQUEST)

    except DatabaseError:
        return Response({"error": "Database error occurred"}, status=HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PATCH"])
# @permission_classes((IsEmployee,))    
def add_note_employee(request, request_id):
    '''
    Function for an employee to add a note if requested by the manager or the admin.
    '''
    try:
        employee_note = request.data.get("employee_note")
        if not employee_note:
            return Response({"error": "Employee note is required"}, status=HTTP_400_BAD_REQUEST)

        query = models.TravelRequest.objects.get(pk=request_id)

        serialized_query = serializer.TravelSerializer(query, data={"emp_update_note": employee_note}, partial=True)

        if serialized_query.is_valid():
            serialized_query.save()

            
            subject = "Employee Update Note Added"
            message = f"A new update note has been added by the employee: {employee_note}"
            recipient_list = [query.manager.user.email] if query.manager and query.manager.user and query.manager.user.email else []
            if recipient_list:
                try:
                    print(recipient_list)
                    sendemail(subject, message, recipient_list)
                except Exception as email_error:
                    return Response({"warning": "Note updated, but email could not be sent.", "error": str(email_error)}, status=HTTP_200_OK)

            return Response({"message": "Employee update note has been updated","data":recipient_list}, status=HTTP_200_OK)
        else:
            return Response(serialized_query.errors, status=HTTP_400_BAD_REQUEST)

    except models.TravelRequest.DoesNotExist:
        return Response({"error": "Travel request not found"}, status=HTTP_404_NOT_FOUND)

    except ValueError:
        return Response({"error": "Invalid request ID"}, status=HTTP_400_BAD_REQUEST)

    except DatabaseError:
        return Response({"error": "Database error occurred"}, status=HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes((IsEmployee,))
def new_request(request):

    '''
    Function for the employee to create a new travel request.
    '''
    try:
        if request.user.id:
            user_id = request.user.id
            employee = models.Employee.objects.get(user__id=user_id)
            manager_id = employee.manager_id
            manager = models.Manager.objects.get(user__id = manager_id)
            print(manager,employee)
            request_serialized = serializer.NewTravelSerializer(
                data=request.data, 
                context={'employee': employee, 'manager': manager}
            )
        

        if request_serialized.is_valid():
            request_serialized.save()

            # Sending notification email
            try:
                subject = "New Travel Request Submitted"
                message = f"A new travel request has been submitted by {request.user.username}."
                recipient_list = [request.user.email]
                sendemail(subject, message, recipient_list)
            except Exception as email_error:
                return Response(
                    {"message": "Request submitted, but email notification failed", "error": str(email_error)},
                    status=HTTP_500_INTERNAL_SERVER_ERROR
                )

            return Response({"message": "Request successfully submitted"}, status=HTTP_201_CREATED)

        return Response(request_serialized.errors, status=HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response(
            {"error": "An unexpected error occurred", "details": str(e)},
            status=HTTP_500_INTERNAL_SERVER_ERROR
        ) 

@api_view(['PATCH','DELETE'])
@permission_classes((IsEmployee,))
def edit_request_employee(request, request_id):
    try:
        query = models.TravelRequest.objects.get(pk=request_id)

        if request.method == "PATCH":
            try:
                for field, value in request.data.items():
                    if value:
                        setattr(query, field, value)
                query.save()
                return Response({"message": "Request updated successfully"}, status=HTTP_200_OK)
            except Exception as update_error:
                return Response(
                    {"error": "Failed to update the request", "details": str(update_error)},
                    status=HTTP_500_INTERNAL_SERVER_ERROR
                )

        elif request.method == "DELETE":
            if query.status == "pending":
                query.status ="deleted"
                query.save()
                return Response({"message": "The request has been deleted successfully"}, status=HTTP_200_OK)
            else:
                return Response(
                    {"error": "The request cannot be deleted as it is past the pending stage."},
                    status=HTTP_400_BAD_REQUEST
                )

    except models.TravelRequest.DoesNotExist:
        return Response(
            {"error": "Request not found"},
            status=HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response(
            {"error": "An unexpected error occurred", "details": str(e)},
            status=HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@csrf_exempt
def login(request):
    try:
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {'error': 'Account is inactive. Please contact admin.'},
                status=HTTP_403_FORBIDDEN
            )

        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {'message': "Logged in successfully", 'token': token.key},
            status=HTTP_200_OK
        )

    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response(
            {'error': 'An unexpected error occurred', 'details': str(e)},
            status=HTTP_500_INTERNAL_SERVER_ERROR
        )


def sendemail(subject, message, recipient_list):
    
    """
    Function to send an email.
    """
    try:
        from_email = "user123@yourdjango.com"

        if isinstance(recipient_list, str):
            recipient_list = ['vishalns17@gmail.com']  # Convert to list if it's a single email

        print(recipient_list)

        send_mail(subject, message, from_email, recipient_list,fail_silently=False,)

        return Response({"message": "Email sent successfully"}, status=200)

    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response({"error": "Failed to send email", "details": str(e)}, status=500)