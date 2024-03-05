from fastapi import APIRouter, Form, File, UploadFile
from bot.images import Bot_Images
from bot import client
from typing import Annotated

router = APIRouter()
bot_images = Bot_Images(client.get_bot_client())

@router.post('/send_npc/')
async def send_npc(
    name: Annotated[str, Form()],
    description: Annotated[str, Form()],
    channel_id: Annotated[int, Form()],
    file: Annotated[UploadFile, File()]
):
    with open(f'images/{file.filename}', 'wb') as f:
        f.write(await file.read())

    message = f"""
        **{name}**
{description}
    """

    await bot_images.send_image_with_text(message, f'images/{file.filename}', channel_id)

    return {
        "name": name,
        "description": description,
        "channel_id": channel_id,
        "file": file.filename
    }