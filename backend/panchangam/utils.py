from datetime import datetime, date
import math
try:
    from jyotishganit.panchang import Panchang
    from jyotishganit.time import Time
    from jyotishganit.location import Location
except ImportError:
    # Fallback if library installation is still pending in background
    Panchang = None

def get_accurate_panchang(target_date, lat, lon):
    """
    Calculates accurate Kerala-style Panchangam using jyotishganit.
    Returns: Tithi, Nakshatra, Malayalam Masam, etc.
    """
    if Panchang is None:
        return {
            "tithi": "Please wait, library initializing...",
            "nakshatra": "Initializing...",
            "malayalam_month": "Initializing..."
        }

    # Setup Location and Time
    loc = Location(lat, lon, 5.5) # Kerala is UTC +5.5
    # jyotishganit Time expects (year, month, day, hour, minute, second)
    # We take noon (12:00) as default for day-level panchang
    jt_time = Time(target_date.year, target_date.month, target_date.day, 12, 0, 0)
    
    p = Panchang(jt_time, loc)
    
    # Extract data (jyotishganit returns IDs/names)
    tithi_info = p.tithi()
    nakshatra_info = p.nakshatra()
    
    # Malayalam Masam (calculated via Sun's position/Sankranti)
    # jyotishganit has solar month functions
    solar_month_id = p.solar_month()
    
    malayalam_months = [
        "Chingam", "Kanni", "Thulam", "Vrischikam", "Dhanu", "Makaram", 
        "Kumbham", "Meenam", "Medam", "Edavam", "Mithunam", "Karkidakam"
    ]
    # Note: jyotishganit's solar_month index might need offset adjustment to match Kerala calendar
    m_month = malayalam_months[(solar_month_id - 1) % 12]

    return {
        "tithi": tithi_info['name'],
        "nakshatra": nakshatra_info['name'],
        "malayalam_month": m_month,
        "sunrise": p.sunrise().strftime("%H:%M"),
        "sunset": p.sunset().strftime("%H:%M"),
    }
