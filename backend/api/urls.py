from django.urls import path
from .views import (
    enroll_face,
    verify_face,
    delete_face_data,
    generate_emergency_pin,
    verify_emergency_pin,
    get_emergency_pin_status,
    revoke_emergency_access,
    update_emergency_contacts,
    update_critical_health_info
)

urlpatterns = [
    path('enroll_face/', enroll_face, name='enroll_face'),
    path('verify_face/', verify_face, name='verify_face'),
    path('delete_face_data/', delete_face_data, name='delete_face_data'),
    path('emergency-pin/generate/', generate_emergency_pin, name='generate_emergency_pin'),
    path('emergency-pin/verify/', verify_emergency_pin, name='verify_emergency_pin'),
    path('emergency-pin/status/<str:user_id>/', get_emergency_pin_status, name='get_emergency_pin_status'),
    path('emergency-pin/revoke/', revoke_emergency_access, name='revoke_emergency_access'),
    path('emergency-contacts/update/', update_emergency_contacts, name='update_emergency_contacts'),
    path('critical-health-info/update/', update_critical_health_info, name='update_critical_health_info'),
] 