from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from .models import Student # Import remains relative
from datetime import date
import logging
from django.db.models import Count

logger = logging.getLogger(__name__)

# --- Dashboard View (Renders home.html) ---

def dashboard_view(request):
    """Renders the main dashboard (home.html) with some mock data/real counts."""
    
    # 1. Fetch real student count
    total_students = Student.objects.count()
    
    # 2. Mock or fetch other data (replace with real data retrieval later)
    current_year = date.today().year
    
    # Example: Count students per class
    students_by_class = Student.objects.filter(admission_year=current_year).values('current_class').annotate(count=Count('id')).order_by('current_class')

    context = {
        'total_students': total_students,
        'faculty_members': 85,  # Placeholder
        'transport_vehicles': 12, # Placeholder
        'library_books': 8500,  # Placeholder
        'computers': 200,       # Placeholder
        'sports_teams': 8,      # Placeholder
        'buildings': 5,         # Placeholder
        'charity_people': 220,  # Placeholder
        'students_by_class': students_by_class,
    }
    
    return render(request, 'home.html', context)


# --- Student Management View (Handles GET and POST for Admission Form) ---

@require_http_methods(["GET", "POST"])
def student_management_view(request):
    """
    Handles both GET (rendering the form) and POST (submitting the form)
    for the student admission page (studentmanagement.html).
    """
    student_id = None
    
    if request.method == 'POST':
        # --- Handle Student Admission Form Submission ---
        try:
            # Create a new Student object from form data
            new_student = Student(
                full_name=request.POST.get('name'),
                dob=request.POST.get('dob'),
                gender=request.POST.get('gender'),
                address=request.POST.get('address'),
                
                parent_name=request.POST.get('parent_name'),
                contact_1=request.POST.get('contact_1'),
                contact_2=request.POST.get('contact_2'),
                
                former_school=request.POST.get('former_school'),
                ple_index=request.POST.get('ple_index'),
                ple_agg=request.POST.get('ple_agg') or None, # Store None if empty
                uce_index=request.POST.get('uce_index'),
                uce_result=request.POST.get('uce_result'),
                
                admission_year=request.POST.get('admission_year'),
                registration_year=request.POST.get('registration_year'),
                term=request.POST.get('term'),
                residence=request.POST.get('residence'),
                entry_status=request.POST.get('entry_status'),
                current_class=request.POST.get('class'), # 'class' is reserved, use 'current_class' in model
                stream=request.POST.get('stream'),
                
                more_info=request.POST.get('more_info'),
            )
            
            # Handle file upload for photo
            if 'photo' in request.FILES:
                new_student.photo = request.FILES['photo']
            
            new_student.save()
            student_id = new_student.student_id

            # Add a success message to display on the rendered page
            success_message = f"Student {new_student.full_name} admitted successfully with ID: {student_id}."
            
            # Render the same page, but with the success modal open
            return render(request, 'studentmanagement.html', {
                'success_message': success_message,
                'student_id': student_id
            })

        except Exception as e:
            logger.error(f"Error saving student: {e}")
            error_message = f"An error occurred during submission: {e}. Please check the form data."
            
            # Render the form again with an error message
            return render(request, 'studentmanagement.html', {'error_message': error_message})

    # --- Handle GET Request or initial render ---
    
    # You might want to fetch a list of all students for the "View Students" section later
    all_students = Student.objects.all().order_by('-date_added')
    
    context = {
        'all_students': all_students,
        'current_year': date.today().year,
        'student_id': student_id
    }
    
    return render(request, 'studentmanagement.html', context)