from django.urls import path

from . import views

urlpatterns = [
    path('login',views.login),
    path('list',views.list_requests_manager),
    path('request/<int:request_id>',views.view_request_manager),
    path('request/<int:request_id>/addnote',views.add_note_manager),


]