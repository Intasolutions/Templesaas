from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.cache import cache
from django.conf import settings
import datetime
from .utils import get_accurate_panchang

class DailyPanchangView(APIView):
    """
    GET /api/panchangam/?date=YYYY-MM-DD
    Returns high-accuracy Malayalam Panchangam using jyotishganit.
    Results are cached per location for 24 hours.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        date_str = request.query_params.get('date', None)
        if date_str:
            try:
                target_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)
        else:
            target_date = datetime.date.today()

        # Resolve tenant location — fall back to Thrissur, Kerala
        tenant = getattr(request, 'tenant', None)
        lat = float(tenant.latitude)  if (tenant and tenant.latitude)  else 10.5276
        lng = float(tenant.longitude) if (tenant and tenant.longitude) else 76.2144

        cache_key = f"panchang_v2:{target_date.isoformat()}:{lat:.3f}:{lng:.3f}"
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        # Compute accurate astronomical data
        try:
            pd = get_accurate_panchang(target_date, lat, lng)
            
            result = {
                "date": target_date.isoformat(),
                "malayalam_month": pd["malayalam_month"],
                "tithi": pd["tithi"],
                "nakshatra": pd["nakshatra"],
                "sunrise": pd["sunrise"],
                "sunset": pd["sunset"],
                "location": {"lat": lat, "lng": lng},
                "status": "ASTRONOMICALLY_ACCURATE"
            }
            
            cache.set(cache_key, result, timeout=60*60*24)
            return Response(result)
        except Exception as e:
            # Fallback if library fails
            return Response({
                "date": target_date.isoformat(),
                "error": str(e),
                "status": "SIMULATED_FALLBACK",
                "malayalam_month": "Karkidakam",
                "tithi": "Unknown",
                "nakshatra": "Unknown"
            })
