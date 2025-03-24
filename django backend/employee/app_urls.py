from django.urls import path

from . import views

urlpatterns = [
    path('login',views.login),
    path('list',views.requests_employee),
    path('request/<int:request_id>', views.view_request_employee),
    path('request/<int:request_id>/updatenote',views.add_note_employee),
    path('request/<int:request_id>/edit',views.edit_request_employee),
    path('new_request',views.new_request),
    

]