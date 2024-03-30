from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from bot.images import Bot_Images
from bot import client
from typing import Annotated, Optional
from database.models import Npc, NpcUpdate, NpcCreate
from database import irollDatabase
from sqlmodel import Session, select
from pydantic import BaseModel
import os
import uuid

router = APIRouter()
bot_images = Bot_Images(client.get_bot_client())

class Npc_model(BaseModel):
    id: int

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

@router.post('/save_npc_image/')
async def save_npc_image(new_image: Annotated[UploadFile, File()], old_image_url: Optional[str] = Form(None)):
    image_id = uuid.uuid4()
    file_type = new_image.filename.split('.')[-1]
    if not os.path.exists('images/npcs/'):
        os.mkdir('images/npcs/')
    try:
        if old_image_url:
            os.remove(f'{old_image_url}')
        with open(f'images/npcs/{image_id}.{file_type}', 'wb') as file:
            file.write(await new_image.read())
        return {
            'image_url': f'images/npcs/{image_id}.{file_type}'
        }
    except Exception as error:
        print(error)     
        raise HTTPException(status_code=500, detail="An error occurred while saving the image to the server.")  

@router.patch('/npc/{npc_id}')
async def update_npc(npc_id: int, npc: NpcUpdate):
    with Session(irollDatabase.engine) as session:
        db_npc = session.get(Npc, npc_id)
        if not db_npc:
            raise HTTPException(status_code=400, detail="Invalid npc id.")
        npc_data = npc.model_dump(exclude_unset=True)
        db_npc.sqlmodel_update(npc_data)
        session.add(db_npc)
        session.commit()
        session.refresh(db_npc)
        return db_npc
        return 'Success'

@router.post('/npc/')
async def create_npc(npc: NpcCreate):
    with Session(irollDatabase.engine) as session:
        db_npc = Npc.model_validate(npc)
        session.add(db_npc)
        session.commit()
        session.refresh(db_npc)
        return db_npc

@router.get('/get_npcs/')
async def get_npcs():
    session = Session(irollDatabase.engine)
    statement = select(Npc)
    npcs = session.exec(statement).all()
    return npcs

@router.post('/get_npc/')
async def get_npc(npc: Npc):
    session = Session(irollDatabase.engine)
    try:
        statement = select(Npc).where(Npc.id == npc.id)
        npc = session.exec(statement).one()
        return npc
    except:
        raise HTTPException(status_code=400, detail="Invalid npc id.")
