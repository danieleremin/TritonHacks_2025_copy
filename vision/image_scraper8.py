import os
from duckduckgo_search import DDGS
import requests
from PIL import Image
from io import BytesIO
import time

# === CONFIGURATION ===
CATEGORY = "tent"
QUERY = "camping tent structure OR camping tent OR outdoor tent"
FOLDER = f"C:/Users/shoun/Documents/GitHub/B - Projects/5 - Miscellaneous Projects/TritonHacks 2025/TritonHacks_2025/structure_dataset/{CATEGORY}"

# === SETUP ===
os.makedirs(FOLDER, exist_ok=True)

# Find highest numbered image file in the folder

existing_numbers = []
for filename in os.listdir(FOLDER):
    if filename.endswith(".jpg"):
        try:
            num = int(filename.split(".")[0])
            existing_numbers.append(num)
        except ValueError:
            continue  # Skip files that aren't numbers

next_index = max(existing_numbers) + 1 if existing_numbers else 0

# === DOWNLOAD FUNCTION ===
def download_images(query, folder, start_index, max_images):
    count = start_index
    with DDGS() as ddgs:
        results = ddgs.images(query, max_results=max_images)
        for result in results:
            try:
                url = result["image"]
                response = requests.get(url, timeout=0.5)
                img = Image.open(BytesIO(response.content)).convert("RGB")
                img = img.resize((224, 224))  # Resize for ResNet
                img.save(os.path.join(folder, f"{count}.jpg"))
                print(f"Saved image {count}.jpg")
                count += 1
                time.sleep(0.2)  # Be respectful
            except Exception as e:
                print(f"Failed to save image {count}: {e}")
                continue

# === EXECUTE ===
print(f"Downloading to {FOLDER} starting from {next_index}")
download_images(QUERY, FOLDER, start_index=next_index, max_images=2500)