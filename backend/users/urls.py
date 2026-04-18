from django.urls import path
from .views import (
    MeView, LoginView, LogoutView, UserProfileListView,
    AttendanceListCreateView, UserManagementListCreateView, UserManagementDetailView,
    DutyRosterListCreateView, ClockInView, SalaryProcessView
)
from .signup_views import TenantSignupView
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path("me/", MeView.as_view(), name="me"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("signup/", TenantSignupView.as_view(), name="tenant-signup"),
    path("profiles/", UserProfileListView.as_view(), name="user-profile-list"),
    path("management/", UserManagementListCreateView.as_view(), name="user-management-list-create"),
    path("management/<int:pk>/", UserManagementDetailView.as_view(), name="user-management-detail"),
    path("attendance/", AttendanceListCreateView.as_view(), name="attendance-list-create"),
    path("roster/", DutyRosterListCreateView.as_view(), name="roster-list-create"),
    path("attendance/clock-in/", ClockInView.as_view(), name="clock-in"),
    path("salary/process/", SalaryProcessView.as_view(), name="salary-process"),
]
