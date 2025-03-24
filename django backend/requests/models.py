from django.db import models
import datetime
from django.contrib.auth.models import User

class Admin(models.Model):
    status = [
        ('active','Active'),
        ('inactive','Inactive')
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150)
    # password = models.CharField(max_length=128)
    status = models.CharField(max_length=15, choices = status)

    

class Manager(models.Model):
    status = [
       ('active','Active'),
        ('inactive','Inactive')
    ] 
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150)
    # password = models.CharField(max_length=128)
    status = models.CharField(max_length=15, choices = status)

    

class Employee(models.Model):
    status = [
        ('active','Active'),
        ('inactive','Inactive')
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150)
    # password = models.CharField(max_length=128)
    status = models.CharField(max_length=15, choices = status)
    manager = models.ForeignKey(Manager,on_delete=models.SET_NULL,null=True)

    

class Accomodation(models.Model):

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=25)

class TravelRequest(models.Model):

    status = [

        ('pending','Pending'),
        ('approved','Approved'),
        ('rejected','Rejected'),
        ('update','Update Requested'),
        ('closed','Closed'),
        ('deleted','Deleted')

    ]

    modes = [
        ('air','Air'),
        ('train','Train'),
        ('car','Car'),
        ('bus','Bus'),

    ]

    employee = models.ForeignKey(Employee,on_delete=models.SET_NULL,null=True)
    manager = models.ForeignKey(Manager,on_delete=models.SET_NULL,null=True)

    from_location = models.CharField(max_length=100)
    to_location = models.CharField(max_length=100)
    date_submitted = models.DateTimeField(auto_now_add=True)
    departure_date = models.DateField()
    return_date = models.DateField()
    accomodation = models.ForeignKey(Accomodation,null=True,on_delete=models.SET_NULL)
    travel_mode = models.CharField(max_length=30,choices=modes)
    
    purpose = models.CharField(max_length=2000)
    additional_note = models.CharField(max_length=2000,null=True)
    manager_note = models.CharField(max_length=2000,null=True)
    admin_note = models.CharField(max_length=2000,null=True)
    emp_update_note = models.CharField(max_length=2000,null=True)
    status = models.CharField(max_length=20,default='pending', choices=status)
    approval_date = models.DateTimeField(null=True)
    reject_date = models.DateTimeField(null=True)
    closure_date = models.DateTimeField(null=True)
    resubmission_bool = models.BooleanField(null=True)  







    



