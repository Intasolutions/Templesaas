import requests

endpoints = {
    'Devotees': '/api/devotees/',
    'Gothras': '/api/devotees/gothra/',
    'Nakshatras': '/api/devotees/nakshatra/',
    'Bookings': '/api/bookings/',
    'Pooja List': '/api/pooja/',
    'Donations': '/api/donations/',
    'Donation Categories': '/api/donations/categories/',
}

print('\n' + '='*70)
print('API CONNECTION STATUS CHECK')
print('='*70 + '\n')

all_ok = True
for name, ep in endpoints.items():
    try:
        r = requests.get(f'http://127.0.0.1:8000{ep}', timeout=2)
        if r.status_code == 200:
            print(f'✅ {name:25} {ep:35} OK')
        else:
            print(f'❌ {name:25} {ep:35} Status: {r.status_code}')
            all_ok = False
    except Exception as e:
        print(f'❌ {name:25} {ep:35} ERROR: {str(e)[:30]}')
        all_ok = False

print('\n' + '='*70)
if all_ok:
    print('✅ ALL APIs are working correctly!')
else:
    print('⚠️  Some APIs have issues - check above for details')
print('='*70 + '\n')
