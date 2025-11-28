from django.urls import path
from . import views

urlpatterns = [
    # Route for the Dashboard (home.html)
    path('', views.dashboard_view, name='home'),
    
    # Route for Student Management (studentmanagement.html)
    path('student_management/', views.student_management_view, name='student_management'),
]