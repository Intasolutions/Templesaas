from rest_framework import generics, views, response, permissions
from rest_framework.throttling import AnonRateThrottle
from .models import UserProfile, Attendance, DutyRoster
from .serializers import UserProfileSerializer, AttendanceSerializer, UserManagementSerializer
from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.contrib.auth.models import User
from core.models import Tenant
from rest_framework.authtoken.models import Token
from core.serializers import TenantSerializer


class LoginRateThrottle(AnonRateThrottle):
    """5 requests per minute per IP on the login endpoint."""
    scope = 'login'

class SignupView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        temple_name = data.get('temple_name')
        subdomain = data.get('subdomain')
        email = data.get('email')
        password = data.get('password')
        admin_name = data.get('admin_name', 'Admin')

        if not all([temple_name, subdomain, email, password]):
            return response.Response({"errors": {"non_field": "All fields are required"}}, status=400)

        if User.objects.filter(username=email).exists():
            return response.Response({"errors": {"email": "User with this email already exists"}}, status=400)
        
        if Tenant.objects.filter(subdomain=subdomain).exists():
            return response.Response({"errors": {"subdomain": "This subdomain is already taken"}}, status=400)

        try:
            # 1. Create Tenant
            tenant = Tenant.objects.create(
                name=temple_name,
                subdomain=subdomain,
                contact_email=email,
                db_name=subdomain.replace("-", "_")
            )

            # 2. Create User
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=admin_name
            )

            # 3. Create Profile
            UserProfile.objects.create(
                user=user,
                organization=tenant,
                role=UserProfile.ROLE_TEMPLE_ADMIN,
                module_permissions={ "all": True }
            )

            # 4. Automated Provisioning (Starter Pack)
            # Create a default Pooja
            from pooja.models import Pooja
            Pooja.objects.create(
                organization=tenant,
                name_en="Sahasranama Archana",
                name_ml="സഹസ്രനാമ അർച്ചന",
                rate=100.00,
                is_active=True
            )

            token, _ = Token.objects.get_or_create(user=user)
            
            return response.Response({
                "token": token.key,
                "user": UserProfileSerializer(user.profile).data,
                "tenant": TenantSerializer(tenant).data
            }, status=201)

        except Exception as e:
            return response.Response({"errors": {"non_field": str(e)}}, status=500)

class MeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'profile', None)
        tenant = getattr(request, 'tenant', None)
        
        # Fallback for Token Auth where middleware might not have user yet
        if not tenant and profile and profile.organization:
            tenant = profile.organization
            
        return response.Response({
            "user": UserProfileSerializer(profile).data if profile else { "username": request.user.username },
            "tenant": TenantSerializer(tenant).data if tenant else None
        })

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginRateThrottle]   # Phase 4: brute-force protection

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            profile = getattr(user, 'profile', None)
            tenant = getattr(request, 'tenant', None)
            if not tenant and profile and profile.organization:
                tenant = profile.organization
                
            return response.Response({
                "token": token.key,
                "user": UserProfileSerializer(profile).data if profile else { "username": user.username },
                "tenant": TenantSerializer(tenant).data if tenant else None
            })
        return response.Response({"error": "Invalid credentials"}, status=401)

class LogoutView(views.APIView):
    def post(self, request):
        django_logout(request)
        return response.Response({"status": "logged out"})

class UserProfileListView(generics.ListAPIView):
    queryset = UserProfile.objects.select_related("user").all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]

class UserManagementListCreateView(generics.ListCreateAPIView):
    queryset = UserProfile.objects.select_related("user").all()
    serializer_class = UserManagementSerializer
    permission_classes = [permissions.AllowAny]

class UserManagementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.select_related("user").all()
    serializer_class = UserManagementSerializer
    permission_classes = [permissions.AllowAny]

    def perform_destroy(self, instance):
        # Delete the underlying auth.User, which cascades to UserProfile
        instance.user.delete()

from .models import UserProfile, Attendance, DutyRoster
from .serializers import UserProfileSerializer, AttendanceSerializer, UserManagementSerializer, DutyRosterSerializer
...
class AttendanceListCreateView(generics.ListCreateAPIView):
    queryset = Attendance.objects.select_related("user").all().order_by("-date")
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.AllowAny]

class DutyRosterListCreateView(generics.ListCreateAPIView):
    queryset = DutyRoster.objects.select_related("user").all().order_by("date")
    serializer_class = DutyRosterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        if tenant:
             return self.queryset.filter(organization=tenant)
        return self.queryset.none()

class ClockInView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        import datetime
        from django.utils import timezone
        
        user = request.user
        tenant = getattr(request, 'tenant', None)
        lat = request.data.get('latitude')
        lon = request.data.get('longitude')
        method = request.data.get('verification_method', 'manual')

        if not tenant:
             return response.Response({"error": "Tenant context missing."}, status=400)

        # 1. Geofencing check (Allow 500m radius if temple location set)
        is_verified = False
        if lat and lon and tenant.latitude and tenant.longitude:
            # Simple Haversine approx (approx 500m)
            dist = ((float(lat) - float(tenant.latitude))**2 + (float(lon) - float(tenant.longitude))**2)**0.5
            if dist < 0.005:  # Roughly 500m
                 is_verified = True
        
        if method == 'qr': # QR bypass or specific logic can go here
            is_verified = True

        # 2. Daily Attendance Entry
        today = timezone.now().date()
        attendance, created = Attendance.objects.get_or_create(
            user=user,
            date=today,
            defaults={
                'organization': tenant,
                'status': Attendance.STATUS_PRESENT,
                'in_time': timezone.now().time(),
                'latitude': lat,
                'longitude': lon,
                'is_verified': is_verified,
                'verification_method': method
            }
        )
        
        if not created:
            # Update out_time if already clocked in
            attendance.out_time = timezone.now().time()
            attendance.save()
            return response.Response({"status": "Clock-out recorded", "verified": is_verified})

        return response.Response({"status": "Clock-in recorded", "verified": is_verified})
