from fastapi import APIRouter, Request
from pydantic import BaseModel
from bot.voice import Bot_Voice
from bot import client

router = APIRouter()
bot_voice = Bot_Voice(client.get_bot_client())

class Join_Channel(BaseModel):
    channel_id: int

@router.post('/join_channel/')
async def join_voice_channel(params: Join_Channel):
    channel_id = params.channel_id
    await bot_voice.join_voice_channel(channel_id)