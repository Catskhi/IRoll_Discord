from fastapi import Request, APIRouter
from pydantic import BaseModel
from app.bot.bot_messages import Bot_Messages
from app.bot import client
import random

router = APIRouter()
bot_messages = Bot_Messages(client.get_bot_client())

class Message(BaseModel):
    message_content: str
    channel_id: int

class Roll_Dice(BaseModel):
    number_of_dices: int
    dice_type: int
    channel_id: int

@router.post('/send_message/')
async def send_message(message: Message):
    await bot_messages.send_message(message.message_content, message.channel_id)
    return message

@router.post('/roll_dice/')
async def roll_dice(roll_dice: Roll_Dice):
    number_of_dices = roll_dice.number_of_dices
    dice_type = roll_dice.dice_type
    if number_of_dices <= 0 or dice_type <= 0:
        raise ValueError("The number of dices and the dice type cannot be equal to 0")

    rolls = [random.randint(1, roll_dice.dice_type) for _ in range(roll_dice.number_of_dices)]

    message = f"` {sum(rolls)} ` ⟵ {sorted(rolls)} {number_of_dices}d{dice_type} :game_die:"

    await bot_messages.send_message(
        message_content=f"{message}",
        channel_id=roll_dice.channel_id
    )