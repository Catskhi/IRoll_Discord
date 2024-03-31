import os
from dotenv import load_dotenv
import discord
from discord.ext import commands
import asyncio
from settings import settings

class Bot_Client:
    def __init__(self):
        self.intents = discord.Intents.default()
        self.intents.message_content = True
        self.client = commands.Bot(command_prefix=".", intents=self.intents)

    def get_bot_client(self):
        return self.client

    async def start_bot(self):
        bot_token = ''
        settings_bot_token = settings.get_settings_data()['bot_token']
        if settings_bot_token:
            bot_token = settings_bot_token
        else:
            load_dotenv()
            bot_token = os.environ.get('BOT_TOKEN')
        if bot_token == '':
            raise Exception("The bot token is empty.")
        try:
            asyncio.create_task(self.client.start(bot_token))
        except Exception as error:
            print('An error occurred while trying to start the bot.')

    async def get_bot_status(self) -> bool:
        return self.client.is_ready()
        

client = Bot_Client()