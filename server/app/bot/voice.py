import discord
from discord.ext.commands import Bot
from discord.ext import commands
import youtube_dl
import asyncio
from app.settings import settings

ytdl_format_options = {
    'format': 'bestaudio/best',
    'outtmpl': '%(extractor)s-%(id)s-%(title)s.%(ext)s',
    'restrictfilenames': True,
    'noplaylist': True,
    'nocheckcertificate': True,
    'ignoreerrors': True,
    'logtostderr': False,
    'quiet': True,
    'no_warnings': True,
    'default_search': 'auto',
    'source_address': '0.0.0.0',  # bind to ipv4 since ipv6 addresses cause issues sometimes
}

ffmpeg_options = {'options': '-vn'}

ytdl = youtube_dl.YoutubeDL(ytdl_format_options)


class YTDLSource(discord.PCMVolumeTransformer):
    def __init__(self, source, *, data, volume=0.5):
        super().__init__(source, volume)

        self.data = data

        self.title = data.get('title')
        self.url = data.get('url')

    @classmethod
    async def from_url(cls, url, *, loop=None, stream=False):
        loop = loop or asyncio.get_event_loop()
        data = await loop.run_in_executor(None, lambda: ytdl.extract_info(url, download=not stream))

        if 'entries' in data:
            data = data['entries'][0]

        filename = data['url'] if stream else ytdl.prepare_filename(data)
        return cls(discord.FFmpegPCMAudio(filename, **ffmpeg_options), data=data)


class Bot_Voice(commands.Cog):
    def __init__(self, bot: Bot):
        self.bot = bot

    @commands.command()
    async def join(self, ctx):
        if ctx.author.voice:
            channel = ctx.author.voice.channel
            if ctx.voice_client:
                await ctx.voice_client.move_to(channel)
            else:
                await channel.connect()
        else:
            ctx.send("Not connected to a voice channel.")

    async def join_voice_channel(self, channel_id: int):
        voice_channel = self.bot.get_channel(channel_id)
        voice_client = await voice_channel.connect()
        return voice_client

    async def stream(self, *, url):
        command_channel = self.bot.get_channel(int(settings.get_settings_data()['music_commands_channel']))
        voice_channel = self.bot.get_channel(int(settings.get_settings_data()['voice_channel']))

        if voice_channel and command_channel:
            voice_client = None
            if self.bot.voice_clients:
                voice_client = self.bot.voice_clients[0]
                print("The bot is already connected to a voice channel.")
            else:
                voice_client = await voice_channel.connect()
                
            if voice_client:
                async with command_channel.typing():
                    if voice_client.is_playing():
                        voice_client.stop()
                    player = await YTDLSource.from_url(url, loop=self.bot.loop, stream=True)
                    voice_client.play(player, after=lambda e: print(f'Player error: {e}') if e else None)
            else:
                raise Exception("There is no voice client.")
        
            await command_channel.send(f'Now playing: {player.title}')
        else:
            raise Exception("The voice channel or the command channel are missing on configuration file.")