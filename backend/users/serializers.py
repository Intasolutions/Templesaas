from rest_framework import serializers
from .models import UserProfile, Attendance


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    allowed_apps = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ["id", "username", "email", "role", "phone", "allowed_apps", "module_permissions"]

    def get_allowed_apps(self, obj):
        if obj.organization and obj.organization.plan:
            return obj.organization.plan.allowed_apps
        return []


from django.contrib.auth.models import User

class UserManagementSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    new_username = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(source="user.first_name", required=False, allow_blank=True)
    last_name = serializers.CharField(source="user.last_name", required=False, allow_blank=True)
    email = serializers.EmailField(source="user.email", required=False, allow_blank=True)
    
    class Meta:
        model = UserProfile
        fields = ["id", "username", "new_username", "password", "first_name", "last_name", "email", "role", "phone", "module_permissions"]

    def create(self, validated_data):
        user_data = validated_data.pop("user", {})
        password = validated_data.pop("password", None)
        new_username = validated_data.pop("new_username", "")
        
        # User needs a username
        username = new_username or user_data.get("username", f"user_{User.objects.count()}")
        user = User.objects.create(
            username=username,
            email=user_data.get("email", ""),
            first_name=user_data.get("first_name", ""),
            last_name=user_data.get("last_name", ""),
        )
        if password:
            user.set_password(password)
            user.save()
            
        profile = UserProfile.objects.get(user=user)
        for attr, value in validated_data.items():
            setattr(profile, attr, value)
        profile.save()
        return profile

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        password = validated_data.pop("password", None)
        new_username = validated_data.pop("new_username", None)
        
        user = instance.user
        if new_username:
            user.username = new_username
        if "email" in user_data:
            user.email = user_data["email"]
        if "first_name" in user_data:
            user.first_name = user_data["first_name"]
        if "last_name" in user_data:
            user.last_name = user_data["last_name"]
            
        if password:
            user.set_password(password)
        user.save()

        # Update profile
        instance.role = validated_data.get("role", instance.role)
        instance.phone = validated_data.get("phone", instance.phone)
        instance.module_permissions = validated_data.get("module_permissions", instance.module_permissions)
        instance.save()
        return instance

from .models import UserProfile, Attendance, DutyRoster

class DutyRosterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    role = serializers.CharField(source="user.profile.role", read_only=True)
    
    class Meta:
        model = DutyRoster
        fields = ["id", "user", "username", "role", "date", "shift", "area", "notes"]

class AttendanceSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    
    class Meta:
        model = Attendance
        fields = ["id", "user", "username", "date", "in_time", "out_time", "status", "remarks", "latitude", "longitude", "is_verified", "verification_method"]
