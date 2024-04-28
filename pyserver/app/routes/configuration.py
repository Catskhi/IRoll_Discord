import os
import json
from fastapi import APIRouter, Path
from pydantic import BaseModel
from app.settings import settings

class Set_Bot_Configs(BaseModel):
    bot_token: str | None = None
    npc_channel: str | None = None
    voice_channel: str | None = None
    music_commands_channel: str | None = None

router = APIRouter()

@router.post('/set_bot_configs/')
async def set_bot_token(data: Set_Bot_Configs):
    for config in data.dict():
        settings.add_new_value(config, data.dict()[config])
        
    return {'success': 'successfully saved token'}

@router.get('/get_bot_configs/')
async def get_bot_configs():
    data = settings.get_settings_data()
    return data