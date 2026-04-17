import datetime
try:
    from jyotishganit.panchang import Panchang
    from jyotishganit.time import Time
    from jyotishganit.location import Location
    
    target_date = datetime.date.today()
    lat, lon = 10.5276, 76.2144
    loc = Location(lat, lon, 5.5)
    jt_time = Time(target_date.year, target_date.month, target_date.day, 12, 0, 0)
    
    p = Panchang(jt_time, loc)
    print("Panchang initialized")
    
    ti = p.tithi()
    print("Tithi info:", ti)
    
    ni = p.nakshatra()
    print("Nakshatra info:", ni)
    
    sm = p.solar_month()
    print("Solar Month ID:", sm)
    
except Exception as e:
    import traceback
    print("Error:", e)
    traceback.print_exc()
