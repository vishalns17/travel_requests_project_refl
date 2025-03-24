from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND , HTTP_201_CREATED ,HTTP_403_FORBIDDEN, HTTP_401_UNAUTHORIZED
from requests import models
from datetime import date
from requests import serializer
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from rest_framework.authtoken.models import Token
from requests.permissions import  IsAdmin
from django.core.mail import send_mail
from django.db import DatabaseError, IntegrityError
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR

import logging
logger = logging.getLogger(__name__)


@api_view(["GET"])
@permission_classes((IsAdmin,))
def list_requests_admin(request):
    '''
    Function to display all the travel requests of all the employees in the company.
    '''
    try:
        status_filter = request.query_params.get("status")
        date_sort = request.query_params.get("date_sort")
        search_employee = request.query_params.get("search")
        from_date = request.query_params.get("from")
        to_date = request.query_params.get("to")

        try:
            start_date = date(2024, 1, 1)
            end_date = date(2024, 1, 31)
        except ValueError:
            return Response({"error": "Invalid date format"}, status=HTTP_400_BAD_REQUEST)

        query = models.TravelRequest.objects.filter()

        if status_filter:
            query = query.filter(status=status_filter)
        if from_date:
            query = query.filter(date_submitted__date__range=(start_date, end_date))
        if date_sort == "asc":
            query = query.order_by("date_submitted")
        elif date_sort == "desc":
            query = query.order_by("-date_submitted")
        if search_employee:
            query = query.filter(employee__name__icontains=search_employee)

        serialized_query = serializer.TravelSerializer(query, many=True)
        return Response(serialized_query.data, HTTP_200_OK)
        logger.info("User accessed list")

    except DatabaseError:
        return Response({"error": "Database error occurred"}, status=HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PATCH"])
@permission_classes((IsAdmin,))
def add_note_admin(request, request_id):
    '''
    Function for the admin to add a note to the travel request.
    '''
    try:
        admin_note = request.data.get("admin_note")
        status = request.data.get("status")
        if not admin_note:
            # return Response({"error": "Admin note is required"}, status=HTTP_400_BAD_REQUEST)
            admin_note = 'Nil   '

        query = models.TravelRequest.objects.get(pk=request_id)
        query.admin_note = admin_note

        serialized_query = serializer.TravelSerializer(query, data={"admin_note": admin_note,"status": status}, partial=True)

        if serialized_query.is_valid():
            serialized_query.save()

            
            subject = "Admin Note Added"
            message = f"A new admin note has been added: {admin_note}"
            recipient_list = [query.employee.email] if query.employee and query.employee.email else []

            if recipient_list:
                try:
                    send_email(subject, message, recipient_list)
                except Exception as email_error:
                    return Response({"warning": "Note updated, but email could not be sent.", "error": str(email_error)}, status=HTTP_200_OK)

            return Response({"message": "Admin note has been updated"}, status=HTTP_200_OK)
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

@api_view(["GET","POST"])
@permission_classes((IsAdmin,))
def view_request_admin(request, request_id):
    '''
    Function to view the request in detail for the admin.
    '''
    try:
        query = models.TravelRequest.objects.get(pk=request_id)

        if request.method == "GET":
            serialized_query = serializer.TravelSerializer(query)
            return Response(serialized_query.data, status=HTTP_200_OK)

        elif request.method == "POST":
            status = request.data.get("status")
            if not status:
                return Response({"error": "Status is required"}, status=HTTP_400_BAD_REQUEST)

            serialized_query = serializer.TravelSerializer(query, data={"status": status}, partial=True)

            if serialized_query.is_valid():
                serialized_query.save()

                
                subject = f"Request Status Updated to {status}"
                message = f"The status of your travel request has been updated to: {status}"
                recipient_list = [query.employee.email] if query.employee and query.employee.email else []

                if recipient_list:
                    try:
                        send_email(subject, message, recipient_list)
                    except Exception as email_error:
                        return Response({"warning": "Status updated, but email could not be sent.", "error": str(email_error)}, status=HTTP_200_OK)

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

@api_view(["GET","POST"])
@permission_classes((IsAdmin,))
def manage_employees(request):
    '''
    Function for the admin to add or list the employees.
    '''
    try:
        if request.method == "GET":
            query = models.Employee.objects.all()
            serialized_query = serializer.EmployeeSerializer(query, many=True)
            return Response(serialized_query.data, status=HTTP_200_OK)

        if request.method == "POST":
            required_fields = ["username", "password", "name", "email", "manager_id"]
            missing_fields = [field for field in required_fields if field not in request.data]

            if missing_fields:  
                return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=HTTP_400_BAD_REQUEST)

            username = request.data["username"]
            password = request.data["password"]
            name = request.data["name"]
            email = request.data["email"]
            manager_id = request.data["manager_id"]
            # user_id = request.data["user"]

            form = UserCreationForm(data={"username": username, "password1": password, "password2": password})
            if form.is_valid():
                user = form.save()
                user.email = email
                user.save()
            else:
                return Response(form.errors, status=HTTP_400_BAD_REQUEST)

            employee_data = {
                "name": name,
                "username": username,
                "email": email,
                "status": "active",
                "user": user.id,  # Ensure we use the created user's ID
                "manager": manager_id
            }

            employee_serialized = serializer.AddEmployeeSerializer(data=employee_data)
            if employee_serialized.is_valid():
                employee_serialized.save()
                return Response({"message": "Successfully added the employee"}, status=HTTP_201_CREATED)
            else:
                return Response(employee_serialized.errors, status=HTTP_400_BAD_REQUEST)

    except IntegrityError:
        return Response({"error": "Integrity error, possible duplicate username or email"}, status=HTTP_400_BAD_REQUEST)

    except ValueError:
        return Response({"error": "Invalid data format"}, status=HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET","POST"])
@permission_classes((IsAdmin,))
def manage_managers(request):
    '''
    Function for the admin to add or list the managers.
    '''
    try:
        if request.method == "GET":
            query = models.Manager.objects.all().values()
            return Response(list(query), status=HTTP_200_OK)

        if request.method == "POST":
            required_fields = ["username", "password", "name", "email"]
            missing_fields = [field for field in required_fields if field not in request.data]

            if missing_fields:
                return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=HTTP_400_BAD_REQUEST)

            username = request.data["username"]
            password = request.data["password"]
            name = request.data["name"]
            email = request.data["email"]

            form = UserCreationForm(data={"username": username, "password1": password, "password2": password})
            if form.is_valid():
                user = form.save()
                user.email = email
                user.is_staff = True 
                user.save()
            else:
                return Response(form.errors, status=HTTP_400_BAD_REQUEST)

            manager_data = {
                "name": name,
                "username": username,
                "email": email,
                "user": user.id,  # Ensure we use the created user's ID,
                "status" :"active"

            }

            manager_serialized = serializer.ManagerSerializer(data=manager_data)
            if manager_serialized.is_valid():
                manager_serialized.save()
                return Response({"message": "Successfully added the manager"}, status=HTTP_201_CREATED)
            else:
                return Response(manager_serialized.errors, status=HTTP_400_BAD_REQUEST)

    except IntegrityError:
        return Response({"error": "Integrity error, possible duplicate username or email"}, status=HTTP_400_BAD_REQUEST)

    except ValueError:
        return Response({"error": "Invalid data format"}, status=HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET","POST"])
@csrf_exempt
def create_admin(request):
    '''
    Function to create an admin.
    '''
    try:
        if request.method == 'POST':
            required_fields = ["email", "password", "name", "status"]
            missing_fields = [field for field in required_fields if field not in request.data]

            if missing_fields:
                return Response({"error": f"Missing required fields: {', '.join(missing_fields)}"}, status=HTTP_400_BAD_REQUEST)

            data = request.data

            # Ensure email and password are valid
            if not data.get("email") or not data.get("password"):
                return Response({"error": "Email and password are required"}, status=HTTP_400_BAD_REQUEST)

            # Check if the email is already in use
            if User.objects.filter(email=data['email']).exists():
                return Response({"error": "User with this email already exists"}, status=HTTP_400_BAD_REQUEST)

            # Create user
            user = User.objects.create_user(
                username=data['email'], 
                email=data['email'],
                password=data['password']
            )
            user.is_staff = True
            user.is_superuser = True  
            user.save()

            # Create admin profile
            admin_data = {
                "user": user.id,
                "name": data['name'],
                "email": data['email'],
                "status": data['status']
            }
            admin_serializer = serializer.AdminSerializer(data=admin_data)

            if admin_serializer.is_valid():
                admin_serializer.save()
                return Response(admin_serializer.data, status=HTTP_201_CREATED)
            else:
                user.delete()  # Rollback user creation if admin creation fails
                return Response(admin_serializer.errors, status=HTTP_400_BAD_REQUEST)

    except IntegrityError:
        return Response({"error": "Integrity error, possible duplicate username or email"}, status=HTTP_400_BAD_REQUEST)

    except ValueError as ve:
        return Response({"error": f"Invalid data format: {str(ve)}"}, status=HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.error("An error occurred: %s", str(e))
        return Response({"error": f"Unexpected error: {str(e)}"}, status=HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET","POST"])
@permission_classes((IsAdmin,))
def manage_accommodation(request):
    '''
    Function for the admin to add or list pre-approved accommodations available to employees.
    '''
    try:
        if request.method == "GET":
            accommodations = models.Accommodation.objects.all()
            serialized_accommodations = serializer.AccommodationSerializer(accommodations, many=True)
            return Response(serialized_accommodations.data, status=HTTP_200_OK)

        if request.method == "POST":
            try:
                accommodation_serialized = serializer.AccommodationSerializer(data=request.data)

                if accommodation_serialized.is_valid():
                    accommodation_serialized.save()
                    return Response(
                        {"message": "Successfully added the accommodation"},
                        status=HTTP_201_CREATED
                    )
                else:
                    return Response(
                        accommodation_serialized.errors,
                        status=HTTP_400_BAD_REQUEST
                    )
            except Exception as e:
                logger.error("An error occurred: %s", str(e))
                return Response(
                    {"error": "An error occurred while processing the accommodation request", "details": str(e)},
                    status=HTTP_500_INTERNAL_SERVER_ERROR
                )

    except models.Accommodation.DoesNotExist:
        return Response(
            {"error": "Accommodation not found"},
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