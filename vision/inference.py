from PIL import Image
import torch
from torchvision import models, transforms
import torch.nn as nn

# Load class names
class_names = ['air_supported_structure', 'connective_structure', 'enclosed_building',
               'open_platform', 'open_structure', 'other', 'portable_structure',
               'tent', 'underground_structure']

# Load model
model = models.resnet50(pretrained=False)
model.fc = nn.Linear(model.fc.in_features, len(class_names))
model.load_state_dict(torch.load("C:/Users/shoun/Documents/GitHub/B - Projects/5 - Miscellaneous Projects/TritonHacks 2025/resnet50_structure_classifier_v4.pth", map_location=torch.device('cpu')))
model.eval()

# Preprocess new image
def predict(image_path):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])
    
    img = Image.open(image_path).convert("RGB")
    img_tensor = transform(img).unsqueeze(0)  # Add batch dimension
    
    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.nn.functional.softmax(outputs[0], dim=0)
    
    # Print top classes with probabilities
    for i, prob in enumerate(probs):
        print(f"{class_names[i]}: {prob.item():.4f}")


predict("C:/Users/shoun/Documents/GitHub/B - Projects/5 - Miscellaneous Projects/TritonHacks 2025/TritonHacks_2025/structure_dataset/open_structure/805.jpg")