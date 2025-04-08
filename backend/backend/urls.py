from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, health_check
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    
    # Health check endpoints (both with and without trailing slash)
    path("health", csrf_exempt(health_check), name="health_check"),
    path("health/", csrf_exempt(health_check), name="health_check_with_slash"),
]