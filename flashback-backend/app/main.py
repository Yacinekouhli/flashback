# main.py
import os
import uuid
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import GenerateRequest
from app.services import flashback_generation_image2image
from dotenv import load_dotenv

load_dotenv()  # Charge .env (avec REPLICATE_API_TOKEN) si présent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Bienvenue sur Flashback API 🚀"}

@app.post("/upload_selfie")
async def upload_selfie(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}.jpg"
    file_location = f"app/static/selfies/{filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"selfie_filename": filename}

@app.get("/images/iconic")
async def get_iconic_images():
    iconic_dir = "app/static/iconic"
    if not os.path.exists(iconic_dir):
        raise HTTPException(status_code=404, detail="Iconic directory not found")
    return {"iconic_images": os.listdir(iconic_dir)}

@app.post("/generate_flashback")
async def generate_flashback(request: GenerateRequest):
    selfie_path = f"app/static/selfies/{request.selfie_filename}"
    iconic_path = f"app/static/iconic/{request.iconic_filename}"

    if not os.path.exists(selfie_path):
        raise HTTPException(status_code=404, detail=f"Selfie introuvable: {selfie_path}")
    if not os.path.exists(iconic_path):
        raise HTTPException(status_code=404, detail=f"Iconic introuvable: {iconic_path}")

    result_filename = f"{uuid.uuid4()}.jpg"
    result_path = f"app/static/results/{result_filename}"
    os.makedirs("app/static/results", exist_ok=True)

    # Appel IA image-to-image
    flashback_generation_image2image(selfie_path, iconic_path, result_path)

    return {"flashback_image": result_filename}

@app.get("/flashbacks/{image_name}")
async def get_flashback(image_name: str):
    file_path = f"app/static/results/{image_name}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path)


# Route pour servir les images iconiques
@app.get("/iconic/{image_name}")
async def get_iconic_image(image_name: str):
    file_path = f"app/static/iconic/{image_name}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path)
