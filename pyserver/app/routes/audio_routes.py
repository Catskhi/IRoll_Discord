from fastapi import APIRouter
from app.bot.audio import bot_audio

router = APIRouter()

@router.get('/audios/')
async def get_audios():
    audios = bot_audio.read_audio_library()
    if audios == None:
        return {
            'message': "There are no audios files in the audio folder."
        }
    return {
        'audios': audios
    }