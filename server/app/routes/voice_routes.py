from fastapi import APIRouter, Request, Form, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel
from typing import Annotated
from app.bot.voice import Bot_Voice
from app.bot import client
from app.bot.audio import bot_audio
import discord
from app.websockets import manager

router = APIRouter()
bot_voice = Bot_Voice(client.get_bot_client())

class Join_Channel(BaseModel):
    channel_id: int

class Play_Audio(BaseModel):
    channel_id: int | None = None
    file_path: str

class StreamAudio(BaseModel):
    channel_id: int | None = None
    url: str

@router.post('/join_channel/')
async def join_voice_channel(params: Join_Channel):
    channel_id = params.channel_id
    await bot_voice.join_voice_channel(channel_id)

@router.post('/play_audio')
async def play_audio(params: Play_Audio):
    if params.channel_id is not None:
        await bot_voice.play_local_file(params.file_path, params.channel_id)
    else:
        await bot_voice.play_local_file(file_path=params.file_path)

@router.post('/stream_audio')
async def stream_audio(params: StreamAudio):
    await bot_voice.stream(url=params.url, channel_id=params.channel_id)

@router.post('/pause')
async def pause():
    if bot_voice.voice_client:
        await bot_voice.pause()
        return {
            'is_playing': bot_voice.voice_client.is_playing()
        }
    else:
        raise HTTPException(status_code=500, detail="There are no current voice clients.")

@router.post('/resume')
async def resume():
    if bot_voice.voice_client:
        await bot_voice.resume()
        return bot_voice.voice_client.is_playing()
    else:
        raise HTTPException(status_code=500, detail="There are no current voice clients.")

@router.post('/toggle_paused')
async def toggle_paused():
    if bot_voice.voice_client:
        await bot_voice.toggle_paused()
        return {
            "is_playing": bot_voice.voice_client.is_playing()
        }
    else:
        raise HTTPException(status_code=500, detail="There are no current voice clients.")

@router.websocket('/voice_ws/{client_id}')
async def voice_websocket(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # await manager.send_personal_message('Pong', websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f'Client #{client_id} disconnected.')
        await manager.broadcast_text(f'Client #{client_id} disconnected.')
