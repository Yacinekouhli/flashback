# services.py
import os
import replicate
import requests
import uuid
from PIL import Image

def simulate_flashback_generation(selfie_path: str, iconic_path: str, result_path: str):
    """
    Ancienne fonction de simulation (collage brut). On la garde en backup.
    """
    selfie = Image.open(selfie_path).resize((300, 300))
    iconic = Image.open(iconic_path).resize((600, 600))
    iconic.paste(selfie, (150, 150))
    iconic.save(result_path)


def collage_selfie_and_iconic(selfie_path, iconic_path, collage_path):
    """
    Fait un collage rudimentaire : place le selfie au milieu de l'image iconique
    et enregistre l'image résultante dans collage_path.
    """
    iconic = Image.open(iconic_path)
    selfie = Image.open(selfie_path)

    # Option : redimensionner le selfie plus petit pour l'insérer
    max_width = iconic.width // 2   # On le met à la moitié de la largeur de l'iconic
    selfie.thumbnail((max_width, max_width))

    # Position centrée
    center_x = (iconic.width - selfie.width) // 2
    center_y = (iconic.height - selfie.height) // 2

    # Collage : si le selfie n'a pas de transparence, c'est un collage "carré"
    # Si tu as détouré le visage, alors le collage sera plus propre.
    iconic.paste(selfie, (center_x, center_y), mask=selfie if selfie.mode == 'RGBA' else None)

    iconic.save(collage_path)


def flashback_generation_image2image(selfie_path, iconic_path, result_path):
    replicate_token = os.getenv("REPLICATE_API_TOKEN")
    if not replicate_token:
        raise ValueError("Missing REPLICATE_API_TOKEN environment variable.")

    # Création d'un collage local comme init_image
    collage_filename = f"init_{uuid.uuid4()}.jpg"
    collage_path = f"app/static/tmp/{collage_filename}"
    os.makedirs("app/static/tmp", exist_ok=True)

    collage_selfie_and_iconic(selfie_path, iconic_path, collage_path)

    # Version ID de stable diffusion sur replicate.com
    # ex: "a9758cb2ca063f1acbff2cdf349cc545c46e6f7c27f3ab5a5c60c0e54c63c57a"
    # On assemble "stability-ai/stable-diffusion:<version_id>"
    version_id = "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4"
    model_ref = f"stability-ai/stable-diffusion:{version_id}"

    prompt_text = (
        "A realistic fusion of the user's face with a famous background, "
        "highly detailed, photorealistic"
    )

    # Appel via replicate.run(...)
    try:
        output_urls = replicate.run(
            model_ref,  # "stability-ai/stable-diffusion:<version_id>"
            input={
                "prompt": prompt_text,
                "init_image": open(collage_path, "rb"),
                "strength": 0.3,
                "num_inference_steps": 50,
                "guidance_scale": 7,
            },
        )
    except Exception as e:
        raise RuntimeError(f"Erreur lors de l'appel Replicate: {e}")

    if not output_urls:
        raise RuntimeError("No output returned by replicate stable-diffusion model.")

    # Normalement, output_urls est une liste d'URL
    generated_url = output_urls[0]

    # Télécharger l'image générée
    resp = requests.get(generated_url)
    resp.raise_for_status()

    with open(result_path, "wb") as f:
        f.write(resp.content)
