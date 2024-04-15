from fastapi import APIRouter, Request, Form
from pydantic import BaseModel
from typing import Annotated
from app.bot.voice import Bot_Voice
from app.bot import client
from app.bot.audio import bot_audio
import discord

router = APIRouter()
bot_voice = Bot_Voice(client.get_bot_client())

class Join_Channel(BaseModel):
    channel_id: int

class Play_Audio(BaseModel):
    channel_id: int
    file_path: str

class StreamAudio(BaseModel):
    url: str

@router.post('/join_channel/')
async def join_voice_channel(params: Join_Channel):
    channel_id = params.channel_id
    await bot_voice.join_voice_channel(channel_id)

@router.post('/play_audio')
async def play_audio(play_audio: Play_Audio):
    channel_id = play_audio.channel_id
    await bot_voice.play_local_file(channel_id, play_audio.file_path)

@router.post('/stream_audio')
async def stream_audio(params: StreamAudio):
    await bot_voice.stream(url=params.url)
    
