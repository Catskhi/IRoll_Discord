import discord
from discord.ext.commands import Bot
from fastapi import UploadFile
from settings import settings

class Bot_Images():
    def __init__(self, bot: Bot) -> None:
        self.bot = bot

    async def send_image(self, image_path: str, channel_id: int) -> None:
        channel = self.bot.get_channel(channel_id)
        await channel.send(file=discord.File(image_path))

    async def send_image_with_text(self, text: str, image_path: str, channel_id: int | None = None) -> None:
        if channel_id == None and settings.get_settings_data()['npc_channel'] != '':
            channel_id = settings.get_settings_data()['npc_channel']
        else:
            raise Exception("The npc channel is not configured in the settings.")
        channel = self.bot.get_channel(int(channel_id))
        await channel.send(text, file=discord.File(image_path))
