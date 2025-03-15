from pydantic import BaseModel


class GenerateRequest(BaseModel):
    selfie_filename: str
    iconic_filename: str
