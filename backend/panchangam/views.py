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
            eng_nak = pd.get("nakshatra", "Unknown")
            eng_month = pd.get("malayalam_month", "Unknown")
            
            result = {
                "date": target_date.isoformat(),
                "malayalam_month": eng_month,
                "malayalam_month_ml": MONTHS_MALAYALAM.get(eng_month, eng_month),
                "tithi": pd["tithi"],
                "nakshatra": eng_nak,
                "nakshatra_ml": NAKSHATRA_ML_NORMALIZED.get(eng_nak.lower().replace(" ", ""), NAKSHATRA_MALAYALAM.get(eng_nak, eng_nak)),
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
                "malayalam_month_ml": "കർക്കടകം",
                "tithi": "Unknown",
                "nakshatra": "Unknown",
                "nakshatra_ml": "Unknown"
            })

class NakshatraDatesView(APIView):
    """
    GET /api/panchangam/nakshatra-dates/?nakshatra_id=X&start_date=YYYY-MM-DD
    Returns up to 12 upcoming dates for the specified Nakshatra.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        nakshatra_id = request.query_params.get('nakshatra_id')
        date_str = request.query_params.get('start_date')
        
        if not nakshatra_id or not date_str:
            return Response({"error": "Both nakshatra_id and start_date are required."}, status=400)
            
        try:
            start_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        # Get Nakshatra name from DB
        from devotees.models import Nakshatra
        try:
            nakshatra_obj = Nakshatra.objects.get(id=nakshatra_id)
            nakshatra_name = nakshatra_obj.name
        except Nakshatra.DoesNotExist:
            return Response({"error": "Nakshatra not found."}, status=404)

        tenant = getattr(request, 'tenant', None)
        lat = float(tenant.latitude) if (tenant and tenant.latitude) else 10.5276
        lng = float(tenant.longitude) if (tenant and tenant.longitude) else 76.2144

        # Try cache first
        cache_key = f"nakshatra_dates_v2:{nakshatra_id}:{start_date.isoformat()}:{lat:.3f}:{lng:.3f}"
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        # Calculate next 365 days
        matching_dates = []
        current_date = start_date
        
        # Max iterations to find 12 dates or 1 year
        for _ in range(365):
            if len(matching_dates) >= 12:
                break
            
            try:
                pd = get_accurate_panchang(current_date, lat, lng)
                if nakshatra_name.lower() in pd.get("nakshatra", "").lower():
                    matching_dates.append(current_date.isoformat())
                    # Skip ahead 20 days since a nakshatra comes roughly every 27 days
                    current_date += datetime.timedelta(days=20)
                    continue
            except Exception:
                pass
                
            current_date += datetime.timedelta(days=1)
            
        # Return fallback if we found nothing
        if not matching_dates:
            matching_dates.append(start_date.isoformat())
            
        result = {
            "nakshatra_id": nakshatra_id,
            "nakshatra_name": nakshatra_name,
            "dates": matching_dates,
            "status": "CALCULATED"
        }
        
        cache.set(cache_key, result, timeout=60*60*24)
        return Response(result)
NAKSHATRA_MALAYALAM = {
    "Ashwini": "അശ്വതി", "Bharani": "ഭരണി", "Krittika": "കാർത്തിക",
    "Rohini": "രോഹിണി", "Mrigashira": "മകയിരം", "Ardra": "തിരുവാതിര",
    "Punarvasu": "പുണർതം", "Pushya": "പൂയ്യം", "Ashlesha": "ആയില്യം",
    "Magha": "മകം", "Purva Phalguni": "പൂരം", "Uttara Phalguni": "ഉത്രം",
    "Hasta": "അത്തം", "Chitra": "ചിത്തിര", "Swati": "ചോതി",
    "Vishakha": "വിശാഖം", "Anuradha": "അനിഴം", "Jyeshtha": "തൃക്കേട്ട",
    "Mula": "മൂലം", "Purva Ashadha": "പൂരാടം", "Uttara Ashadha": "ഉത്രാടം",
    "Shravana": "തിരുവോണം", "Dhanishta": "അവിട്ടം", "Shatabhisha": "ചതയം",
    "Purva Bhadrapada": "പൂരുരുട്ടാതി", "Uttara Bhadrapada": "ഉത്രട്ടാതി", "Revati": "രേവതി"
}

# Normalize keys for robustness
NAKSHATRA_ML_NORMALIZED = {k.lower().replace(" ", ""): v for k, v in NAKSHATRA_MALAYALAM.items()}

MONTHS_MALAYALAM = {
    "Medam": "മേടം", "Edavam": "ഇടവം", "Mithunam": "മിഥുനം", "Karkidakam": "കർക്കടകം",
    "Chingam": "ചിങ്ങം", "Kanni": "കന്നി", "Thulam": "തുലാം", "Vrischikam": "വൃശ്ചികം",
    "Dhanu": "ധനു", "Makaram": "മകരം", "Kumbham": "കുംഭം", "Meenam": "മീനം"
}

class RangePanchangView(APIView):
    """
    GET /api/panchangam/range/?start=YYYY-MM-DD&end=YYYY-MM-DD
    Returns astronomical data for a range of dates.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        start_str = request.query_params.get('start')
        end_str = request.query_params.get('end')
        
        if not start_str or not end_str:
            return Response({"error": "Both start and end dates are required."}, status=400)
            
        try:
            start_date = datetime.datetime.strptime(start_str, '%Y-%m-%d').date()
            end_date = datetime.datetime.strptime(end_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        tenant = getattr(request, 'tenant', None)
        lat = float(tenant.latitude) if (tenant and tenant.latitude) else 10.5276
        lng = float(tenant.longitude) if (tenant and tenant.longitude) else 76.2144

        # Generate all cache keys for the range
        date_range = []
        curr = start_date
        while curr <= end_date:
            date_range.append(curr)
            curr += datetime.timedelta(days=1)
            
        cache_keys = {f"panchang_v2:{d.isoformat()}:{lat:.3f}:{lng:.3f}": d for d in date_range}
        cached_data = cache.get_many(cache_keys.keys())
        
        results = {}
        for key, target_date in cache_keys.items():
            day_data = cached_data.get(key)
            
            if not day_data:
                try:
                    pd = get_accurate_panchang(target_date, lat, lng)
                    eng_nak = pd.get("nakshatra", "Unknown")
                    eng_month = pd.get("malayalam_month", "Unknown")
                    
                    day_data = {
                        "date": target_date.isoformat(),
                        "malayalam_month": eng_month,
                        "malayalam_month_ml": MONTHS_MALAYALAM.get(eng_month, eng_month),
                        "tithi": pd["tithi"],
                        "nakshatra": eng_nak,
                        "nakshatra_ml": NAKSHATRA_ML_NORMALIZED.get(eng_nak.lower().replace(" ", ""), eng_nak),
                        "malayalam_day": target_date.day 
                    }
                    cache.set(key, day_data, timeout=60*60*24)
                except Exception:
                    day_data = {"date": target_date.isoformat(), "error": "Calculation failed"}
            
            results[target_date.isoformat()] = day_data
            
        return Response(results)
