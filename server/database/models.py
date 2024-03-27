from typing import Optional
from fastapi import UploadFile
from sqlmodel import SQLModel, Field


class Npc(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    profile_picture_url: str
    description: Optional[str] = None

class NpcCreate(SQLModel):
    name: str
    profile_picture_url: str
    description: str | None = None
    
class NpcUpdate(SQLModel):
    name: str | None
    description: str | None