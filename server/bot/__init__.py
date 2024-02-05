import os
from dotenv import load_dotenv
import discord
from discord.ext import commands
import asyncio

class Bot_Client:
    def __init__(self):
        self.intents = discord.Intents.default()
        self.intents.message_content = True
        self.client = commands.Bot(command_prefix=".", intents=self.intents)

    def get_bot_client(self):
        return self.client

    async def start_bot(self):
        load_dotenv()
        bot_token = os.environ.get('BOT_TOKEN')
        asyncio.create_task(self.client.start(bot_token))

client = Bot_Client()