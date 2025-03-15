from PIL import Image


def simulate_flashback_generation(selfie_path: str, iconic_path: str, result_path: str):
    selfie = Image.open(selfie_path).resize((300, 300))
    iconic = Image.open(iconic_path).resize((600, 600))
    iconic.paste(selfie, (150, 150))  # Collage simple pour simuler
    iconic.save(result_path)
