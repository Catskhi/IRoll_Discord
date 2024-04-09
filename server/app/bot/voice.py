import discord
from discord.ext.commands import Bot
import youtube_dl
import asyncio

yt_dl_opts = {'format': 'bestadio/best'}
ytdl = youtube_dl.YoutubeDL(yt_dl_opts)

ffmpeg_options = {'options': '-vn'}


class Bot_Voice():
    def __init__(self, bot: Bot):
        self.bot = bot

    async def join_voice_channel(self, channel_id: int):
        voice_channel = self.bot.get_channel(channel_id)
        voice_client = await voice_channel.connect()