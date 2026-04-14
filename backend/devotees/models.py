from django.db import models
from django.contrib.auth.models import User
from core.models import Tenant

class Gothra(models.Model):
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="gothras", null=True, blank=True)
    name = models.CharField(max_length=100)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["organization", "name"], name="unique_gothra")
        ]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["name"]),
        ]

    def __str__(self):
        return self.name


class Nakshatra(models.Model):
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="nakshatras", null=True, blank=True)
    name = models.CharField(max_length=100)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["organization", "name"], name="unique_nakshatra")
        ]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["name"]),
        ]

    def __str__(self):
        return self.name


class Devotee(models.Model):
    # Optional: link if devotee will login later
    organization = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="devotees", null=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)

    full_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True)

    gothra = models.ForeignKey(Gothra, on_delete=models.SET_NULL, null=True, blank=True)
    nakshatra = models.ForeignKey(Nakshatra, on_delete=models.SET_NULL, null=True, blank=True)

    address = models.TextField(blank=True)

    ID_AADHAR = "aadhar"
    ID_PAN = "pan"
    ID_VOTER = "voter"
    ID_DL = "driving_license"
    ID_PASSPORT = "passport"
    ID_OTHER = "other"

    ID_PROOF_CHOICES = [
        (ID_AADHAR, "Aadhar"),
        (ID_PAN, "PAN"),
        (ID_VOTER, "Voter ID"),
        (ID_DL, "Driving License"),
        (ID_PASSPORT, "Passport"),
        (ID_OTHER, "Other"),
    ]

    id_proof_type = models.CharField(max_length=30, choices=ID_PROOF_CHOICES, blank=True)
    id_proof_number = models.CharField(max_length=50, blank=True)
    id_proof_file = models.FileField(upload_to="id_proofs/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "phone"],
                name="unique_devotee_phone_per_tenant"
            )
        ]
        indexes = [
            models.Index(fields=["organization", "phone"]),
            models.Index(fields=["full_name"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.full_name} - {self.phone}"
