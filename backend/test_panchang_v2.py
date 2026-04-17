import datetime
from jyotishganit import calculate_birth_chart

try:
    target_date = datetime.date.today()
    # Create a datetime at noon
    target_dt = datetime.datetime.combine(target_date, datetime.time(12, 0))
    
    chart = calculate_birth_chart(
        birth_date=target_dt,
        latitude=10.5276,
        longitude=76.2144,
        timezone_offset=5.5,
        name="Today"
    )
    
    print("Panchanga Tithi:", chart.panchanga.tithi)
    print("Panchanga Nakshatra:", chart.panchanga.nakshatra)
    
    # Check if there is anything about month/raasi
    print("Solar Month/Rasi info available in chart?")
    # Try common fields
    print("Sun Lon:", chart.core.astronomical.body_positions['Sun'].longitude)

except Exception as e:
    import traceback
    print("Error:", e)
    traceback.print_exc()
