import requests
import os

# Trying multiple known sources
urls = [
    "https://github.com/googlefonts/meera-fonts/raw/master/Meera-Regular.ttf",
    "https://github.com/smc/fonts/raw/master/Meera/Meera.ttf",
    "https://github.com/smc/manjari/raw/master/Manjari-Regular.ttf"
]

dest = "fonts/Meera.ttf"

if not os.path.exists("fonts"):
    os.makedirs("fonts")

for url in urls:
    print(f"Trying to download font from {url}...")
    try:
        response = requests.get(url, stream=True, timeout=10)
        if response.status_code == 200:
            with open(dest, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"Success! Font saved from {url}")
            break
        else:
            print(f"Failed with status: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("Could not download any Malayalam font automatically.")
