from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND , HTTP_201_CREATED ,HTTP_403_FORBIDDEN, HTTP_401_UNAUTHORIZED
from requests import models
from datetime import date
from requests import serializer
from rest_framework.authtoken.models import Token
from requests.permissions import IsManager
from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR

import logging
logger = logging.getLogger(__name__)


@api_view(["GET"])
@permission_classes((IsManager,))
def list_requests_manager(request):
    '''
    Function to display all the travel requests of employees coming under the jurisdiction of that particular manager.
    '''
    try:
        if request.user.id:
            user_id = request.user.id
            try:
                manager = models.Manager.objects.get(user__id=user_id)
                manager_id = manager.id
                query = models.TravelRequest.objects.prefetch_related('employee', 'manager').filter(manager_id=manager_id)
            except ObjectDoesNotExist:
                logger.debug('Manager not found for this user')
                return Response({"error": "Manager not found for this user"}, status=HTTP_400_BAD_REQUEST)
        else:
            query = models.TravelRequest.objects.prefetch_related('employee', 'manager').all()

        search_employee = request.query_params.get('search')
        status_filter = request.query_params.get("status")
        date_sort = request.query_params.get("date_sort")

        from_date = request.query_params.get("from")
        to_date = request.query_params.get("to")

        try:
            start_date = date(2024, 1, 1)
            end_date = date(2024, 1, 31)
        except ValueError:
            logger.debug("'error': 'Invalid date format'")
            return Response({"error": "Invalid date format"}, status=HTTP_400_BAD_REQUEST)

        if status_filter:
            query = query.filter(status=status_filter)
        if from_date:
            query = query.filter(date_submitted__date__range=(from_date, to_date))
        if date_sort == "asc":
            query = query.order_by("date_submitted")
        elif date_sort == "desc":
            query = query.order_by("-date_submitted")
        if search_employee:
            query = query.filter(employee__name__icontains=search_employee)

        serialized_query = serializer.TravelSerializer(query, many=True)
        logger.info("User accessed list")
        return Response(serialized_query.data, HTTP_200_OK)

    except DatabaseError:
        return Response({"error": "Database error occurred"}, status=HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(["GET","POST"])
@permission_classes((IsManager,))
def view_request_manager(request, request_id):
    '''
    Function to display all the details of a particular travel request to a manager pertaining to the id given in the URL.
    '''
    try:
        query = models.TravelRequest.objects.get(pk=request_id)

        if request.method == "GET":
            serialized_query = serializer.TravelSerializer(query)
            return Response(serialized_query.data, status=HTTP_200_OK)

        elif request.method == "POST":
            status = request.data.get("status")

            if not status:
                return Response({"error": "Status field is required"}, status=HTTP_400_BAD_REQUEST)

            serialized_query = serializer.TravelSerializer(query, data={"status": status}, partial=True)

            if serialized_query.is_valid():
                serialized_query.save()
                return Response({"message": "Status has been updated"}, status=HTTP_200_OK)
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

@api_view(["PATCH"])
@permission_classes((IsManager,))
def add_note_manager(request, request_id):
    '''
    Function for a manager to add a note to the travel request.
    '''
    try:
        manager_note = request.data.get("manager_note")
        status = request.data.get("status")
        if not manager_note: 
            return Response({"error": "Manager note is required"}, status=HTTP_400_BAD_REQUEST)
        query = models.TravelRequest.objects.get(pk=request_id)
        query.manager_note = manager_note
        if not manager_note:
            manager_note='Nil'
        serialized_query = serializer.TravelSerializer(query, data={"manager_note": manager_note,"status":status}, partial=True)
        if serialized_query.is_valid():
            serialized_query.save()            
            subject = "Manager Note Added"
            message = f"A new manager note has been added: {manager_note}"
            recipient_list = [query.employee.email] if query.employee and query.employee.email else []
            
            if recipient_list:
                try:
                    send_email(subject, message, recipient_list)
                except Exception as email_error:
                    return Response({"warning": "Note updated, but email could not be sent.", "error": str(email_error)}, status=HTTP_200_OK)

            return Response({"message": "Manager note has been updated"}, status=HTTP_200_OK)
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

def send_email(subject, message, recipient_list):
    """
    Function to send an email.
    """
    try:
        from_email = "user123@gmail.com"

        if isinstance(recipient_list, str):
            recipient_list = ['hello@mailtrap.com']  # Convert to list if it's a single email

        send_mail(subject, message, from_email, recipient_list)

        return Response({"message": "Email sent successfully"}, status=200)

    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response({"error": "Failed to send email", "details": str(e)}, status=500)