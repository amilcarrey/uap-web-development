"""Pydantic models for API responses."""
from typing import List, Optional
from pydantic import BaseModel


class EnrollResponse(BaseModel):
    id: str
    name: str
    samples_count: int


class IdentifyTopK(BaseModel):
    userId: str
    name: str
    score: float


class IdentifyResponse(BaseModel):
    match: bool
    userId: Optional[str] = None
    name: Optional[str] = None
    score: Optional[float] = None
    topK: List[IdentifyTopK] = []


class LoginResponse(BaseModel):
    token: str
    userId: str
    name: str
    score: float