from fastapi import APIRouter, Request
from pydantic import BaseModel
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

@router.post('/join_channel/')
async def join_voice_channel(params: Join_Channel):
    channel_id = params.channel_id
    await bot_voice.join_voice_channel(channel_id)

@router.post('/play_audio')
async def play_audio(play_audio: Play_Audio):
    channel_id = play_audio.channel_id
    voice_client = await bot_voice.join_voice_channel(channel_id)
    audio_source = discord.FFmpegPCMAudio(play_audio.file_path)
    voice_client.play(audio_source)
    
