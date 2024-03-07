from typing import Optional

from sqlmodel import SQLModel, Field


class Npc(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    profile_picture_url: str
    description: Optional[str] = None