import os
import torch
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader, random_split
from torchvision import models
import torch.nn as nn
import torch.optim as optim
from torchvision.models import resnet50, ResNet50_Weights

print("Starting script...")

# Set up device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Absolute path to your dataset
print("Setting up dataset directory...")
DATASET_DIR = os.path.join(os.path.dirname(__file__), "../structure_dataset")
DATASET_DIR = os.path.abspath(DATASET_DIR)
print(f"Resolved dataset path: {DATASET_DIR}")

# Image transformations
print("Defining image transformations...")
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],  # ImageNet mean
                         [0.229, 0.224, 0.225])  # ImageNet std
])
print("Image transformations defined.")

# Load dataset
print("Loading dataset with ImageFolder...")
dataset = ImageFolder(DATASET_DIR, transform=transform)
print("Dataset loaded.")
class_names = dataset.classes
num_classes = len(class_names)
print("Classes found:", class_names)
print(f"Number of classes: {num_classes}")
print(f"Total dataset size: {len(dataset)}")

# Split into train & val sets
print("Splitting dataset into train and validation sets...")
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
print(f"Train size: {train_size}, Validation size: {val_size}")
train_dataset, val_dataset = random_split(dataset, [train_size, val_size])
print("Splitting complete.")

print("Creating DataLoaders...")
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)
print("DataLoaders created.")

# Load pre-trained ResNet-50
print("Loading pre-trained ResNet-50...")
model = resnet50(weights=ResNet50_Weights.IMAGENET1K_V1)
print("Model loaded. Freezing base layers...")
for param in model.parameters():
    param.requires_grad = False
print("Base layers frozen.")

print("Modifying final fully connected layer...")
model.fc = nn.Linear(model.fc.in_features, num_classes)
model = model.to(device)
print("Model fully prepared.")

# Loss and optimizer
print("Setting up loss function and optimizer...")
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.fc.parameters(), lr=1e-4)
print("Loss function and optimizer set.")

# Training loop
print("Beginning training loop...")
EPOCHS = 10
for epoch in range(EPOCHS):
    print(f"\n--- Epoch {epoch+1}/{EPOCHS} ---")
    model.train()
    running_loss = 0.0

    print("Starting training batches...")
    for i, (images, labels) in enumerate(train_loader):
        print(f"Batch {i+1}/{len(train_loader)}")
        images, labels = images.to(device), labels.to(device)

        print("Performing forward pass...")
        outputs = model(images)

        print("Calculating loss...")
        loss = criterion(outputs, labels)

        print("Zeroing gradients...")
        optimizer.zero_grad()

        print("Performing backward pass...")
        loss.backward()

        print("Stepping optimizer...")
        optimizer.step()

        running_loss += loss.item()
        print(f"Batch {i+1} loss: {loss.item():.4f}")

    epoch_loss = running_loss / len(train_loader)
    print(f"Epoch {epoch+1} complete. Average loss: {epoch_loss:.4f}")

# Save model
print("Saving trained model...")
SAVE_PATH = os.path.abspath("../resnet50_structure_classifier_v4.pth")
torch.save(model.state_dict(), SAVE_PATH)
print(f"Model trained and saved to {SAVE_PATH}.")
