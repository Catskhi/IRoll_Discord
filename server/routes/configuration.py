import os
import json
from fastapi import APIRouter, Path
from pydantic import BaseModel
from settings import settings

class Set_Bot_Token(BaseModel):
    token: str

router = APIRouter()

@router.post('/set_bot_token/')
async def set_bot_token(data: Set_Bot_Token):
    settings.add_new_value('token', data.token)
    return {'success': 'successfully saved token'}