from fastapi import APIRouter, Form, File, UploadFile
from pydantic import BaseModel
from app.bot.images import Bot_Images
from app.bot import client
from typing import Annotated

router = APIRouter()
bot_images = Bot_Images(client.get_bot_client())

@router.post('/send_image/')
async def send_image(
    channel_id: Annotated[int, Form()],
    file: Annotated[UploadFile, File()]
):

    with open(f'app/images/{file.filename}', 'wb') as f:
        f.write(await file.read())

    await bot_images.send_image(f'app/images/{file.filename}', channel_id)

    return {
        "channel_id": channel_id,
        "file": file.filename
    }