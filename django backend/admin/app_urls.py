from django.urls import path

from . import views

urlpatterns = [
    path('login',views.login),
    path('list',views.list_requests_admin),
    path('request/<int:request_id>',views.view_request_admin),
    path('request/<int:request_id>/addnote',views.add_note_admin),
    path('manage_employees',views.manage_employees),
    path('manage_managers',views.manage_managers),
    path('manage_accomodation',views.manage_accommodation),
    path('create_admin',views.create_admin),
    

]