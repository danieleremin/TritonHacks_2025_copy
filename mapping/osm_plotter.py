import pandas as pd
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import folium
from tqdm import tqdm

print("=== Step 1: Loading CSV ===")
csv_path = "C:/Users/shoun/Documents/GitHub/B - Projects/5 - Miscellaneous Projects/TritonHacks 2025/TritonHacks_2025/mapping/testData_1.csv"
df = pd.read_csv(csv_path)
print("CSV loaded.")
print(df.head())
print(f"Total rows in CSV: {len(df)}")

print("\n=== Step 2: Setting up geocoder ===")
geolocator = Nominatim(user_agent="myGeocoder")
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)
print("Geocoder ready.")

# Setup tqdm
tqdm.pandas()

print("\nStarting geocoding...")
df['location'] = df['address'].progress_apply(lambda x: geocode(x))
print("Finished geocoding.")

print("Extracting latitudes and longitudes...")
df['latitude'] = df['location'].apply(lambda loc: loc.latitude if loc else None)
df['longitude'] = df['location'].apply(lambda loc: loc.longitude if loc else None)

print("Dropping rows with missing coordinates...")
before_drop = len(df)
df = df.dropna(subset=['latitude', 'longitude'])
after_drop = len(df)
print(f"Dropped {before_drop - after_drop} rows. Remaining: {after_drop}")

print("\n=== Step 3: Creating the map ===")
map_center = [df['latitude'].mean(), df['longitude'].mean()]
print(f"Map center: {map_center}")
m = folium.Map(location=map_center, zoom_start=12)
print("Map created.")

print("\n=== Step 4: Adding markers ===")
for i, row in df.iterrows():
    lat = row['latitude']
    lon = row['longitude']
    address = row['address']
    print(f"Adding marker {i}: ({lat}, {lon}) - {address}")
    folium.Marker(
        location=[lat, lon],
        popup=address,
        icon=folium.Icon(color='blue', icon='info-sign')
    ).add_to(m)

print("\n=== Step 5: Saving map ===")
map_save_path = "C:/Users/shoun/Documents/GitHub/B - Projects/5 - Miscellaneous Projects/TritonHacks 2025/TritonHacks_2025/mapping/map_test_1.html"
m.save(map_save_path)
print(f"Map saved to {map_save_path}")
