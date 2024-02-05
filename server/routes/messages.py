from fastapi import Request, APIRouter
from pydantic import BaseModel
from bot.bot_messages import Bot_Messages
from bot import client

router = APIRouter()
bot_messages = Bot_Messages(client.get_bot_client())

class Message(BaseModel):
    message_content: str
    channel_id: int

@router.post('/send_message/')
async def send_message(message: Message):
    await bot_messages.send_message(message.message_content, message.channel_id)
    return message