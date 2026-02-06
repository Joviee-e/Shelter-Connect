from pydantic import BaseModel, Field
from typing import Optional


class EmergencyQuerySchema(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)

    pets: Optional[bool] = False
    family: Optional[bool] = False
    food: Optional[bool] = False

    max_price: Optional[int] = None


class EmergencyShelterSchema(BaseModel):
    id: str
    name: str
    address: str

    distance_km: float

    pets_allowed: bool
    family_friendly: bool
    food_available: bool
    price: int
