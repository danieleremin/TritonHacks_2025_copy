import os
from duckduckgo_search import DDGS
import requests
from PIL import Image
from io import BytesIO
import time

# Define your structure categories
CATEGORIES = {
    "enclosed_building": "typical american house OR enclosed building OR apartment building",
    "portable_structure":"portable building mobile container structure OR portable building",
    "open_structure": "open air pavilion structure",
    "air_supported_structure": "air supported inflatable structure OR inflatable structure",
    "tent": "camping tent structure OR camping tent OR outdoor tent",
    "open_platform": "open platform pier structure",
    "underground_structure": "underground work area tunnel",
    "connective_structure": "fence barrier gate structure",
    "other": "abstract architectural structure",
}

# Folder to store images
DATASET_DIR = "structure_dataset"
os.makedirs(DATASET_DIR, exist_ok=True)

# Scraper function
def download_images(query, folder, max_images=500):
    os.makedirs(folder, exist_ok=True)
    count = 0
    with DDGS() as ddgs:
        results = ddgs.images(query, max_results=max_images)
        for result in results:
            try:
                url = result["image"]
                response = requests.get(url, timeout=10)
                img = Image.open(BytesIO(response.content)).convert("RGB")
                img = img.resize((224, 224))  # Resize for ResNet
                img.save(os.path.join(folder, f"{count}.jpg"))
                count += 1
                if count >= max_images:
                    break
                time.sleep(0.2)  # Respectful scraping
            except Exception as e:
                print(f"Failed to save image {count}: {e}")
                continue

# Loop over all categories
for class_name, query in CATEGORIES.items():
    print(f"Downloading images for class: {class_name}, {query}")
    download_images(query, os.path.join(DATASET_DIR, class_name), max_images=1000)
