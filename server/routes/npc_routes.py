from fastapi import APIRouter, Form, File, UploadFile
from bot.images import Bot_Images
from bot import client
from typing import Annotated
from database.models import Npc
from database import irollDatabase
from sqlmodel import Session

router = APIRouter()
bot_images = Bot_Images(client.get_bot_client())

def create_npc(name: str, description: str, image_url: str):
    npc = Npc(name=name, profile_picture_url=image_url, description=description)
    session = Session(irollDatabase.engine)
    session.add(npc)
    session.commit()

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

    try:
        create_npc(name, description, f'images/{file.filename}')
    except Exception as error:
        print(error)

    await bot_images.send_image_with_text(message, f'images/{file.filename}', channel_id)

    return {
        "name": name,
        "description": description,
        "channel_id": channel_id,
        "file": file.filename
    }