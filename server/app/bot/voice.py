import discord
from discord.ext.commands import Bot
from discord.ext import commands, tasks
import youtube_dl
import asyncio
from app.settings import settings
import os
from app.websockets import manager

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
        self.voice_client = None
        self.command_channel = None

    @commands.command()
    async def join(self, ctx):
        if ctx.author.voice:
            channel = ctx.author.voice.channel
            if ctx.voice_client:
                self.voice_client = ctx.voice_client
                await ctx.voice_client.move_to(channel)
            else:
                self.voice_client = await channel.connect()
            await ctx.send("Connected to voice channel")
        else:
            await ctx.send("Not connected to a voice channel")

    @commands.command(name="play")
    async def stream_command(self, ctx, url):
        try:
            await self.stream(url=url)
        except Exception as error:
            print(f"Error: {error}")
            await ctx.send("Server error or invalid url")

    @commands.command(name="pause")
    async def pause_command(self, ctx):
        await self.pause(ctx=ctx)
        if manager:
            await manager.broadcast_json({'is_playing': self.voice_client.is_playing()})

    @commands.command(name="resume")
    async def resume_command(self, ctx):
        await self.resume(ctx=ctx)
        if manager:
            await manager.broadcast_json({'is_playing': self.voice_client.is_playing()})
        
    @commands.command()
    async def leave(self, ctx):
        if self.voice_client:
            await self.voice_client.disconnect()
        await ctx.send("Disconnected from voice channel")

    @commands.command(name="volume")
    async def change_volume_command(self, ctx, volume: int):
        await self.volume(volume, ctx)

    async def join_voice_channel(self, channel_id: int):
        voice_channel = self.bot.get_channel(channel_id)
        voice_client = await voice_channel.connect()
        return voice_client

    def ensure_voice_client(self):
        self.voice_client = self.bot.voice_clients[0]
        
    async def handle_join_play_channel(self, channel_id: int | None = None):
        if channel_id is not None:
            voice_channel = self.bot.get_channel(channel_id)
        else:
            voice_channel = self.bot.get_channel(int(settings.get_settings_data()['voice_channel']))
        self.command_channel = self.bot.get_channel(int(settings.get_settings_data()['music_commands_channel']))
        if voice_channel and self.command_channel:
            if self.bot.voice_clients:
                self.voice_client = self.bot.voice_clients[0]
                print("The bot is already connected to a voice channel.")
            else:
                self.voice_client = await voice_channel.connect()
        else:
            raise Exception("The voice channel or the command channel are missing on configuration file.")

    async def play_local_file(self, file_path: str, channel_id: int | None = None):
        try:
            await self.handle_join_play_channel(channel_id=channel_id)
            self.ensure_voice_client()
            if self.voice_client:
                async with self.command_channel.typing():
                    if self.voice_client.is_playing():
                        self.voice_client.stop()
                    audio_source = discord.FFmpegPCMAudio(file_path)
                    self.voice_client.play(audio_source)
                    if manager:
                        await manager.broadcast_json({'is_playing': self.voice_client.is_playing(), 'song_title': player.title})
            else:
                raise Exception("There is no voice client.")
            await self.command_channel.send(f"Now playing: {os.path.basename(file_path)}")
        except Exception as error:
            print(f"An error occurred: {error}")

    async def stream(self, *, url: str, channel_id: int | None = None):
        try:
            await self.handle_join_play_channel(channel_id)
            self.ensure_voice_client()
            if self.voice_client:
                async with self.command_channel.typing():
                    if self.voice_client.is_playing():
                        self.voice_client.stop()
                    player = await YTDLSource.from_url(url, loop=self.bot.loop, stream=True)
                    self.voice_client.play(player, after=lambda e: print(f'Player error: {e}') if e else None)
                    if manager:
                        await manager.broadcast_json({'is_playing': self.voice_client.is_playing(), 'song_title': player.title})
                        
            else:
                raise Exception("There is no voice client.")
            await self.command_channel.send(f'Now playing: {player.title}')
        except Exception as error:
            print(f"An error occurred: {error}")

    async def toggle_paused(self, ctx=None):
        try:
            self.ensure_voice_client()
            if self.voice_client:
                if self.voice_client.is_playing():
                    self.voice_client.pause()
                elif self.voice_client.is_paused():
                    self.voice_client.resume()
            else:
                raise Exception("There is no sound playing right now")
        except:
            if ctx:
                await ctx.send(error)

    async def pause(self, ctx=None):
        try:
            self.ensure_voice_client()
            if self.voice_client:
                if self.voice_client.is_playing():
                    self.voice_client.pause()
                else:
                    raise Exception("There is no sound playing right now")
            else:
                raise Exception("Not connected to a voice channel")
        except Exception as error:
            print(error)
            if ctx:
                await ctx.send(error)

    async def resume(self, ctx=None):
        try:
            self.ensure_voice_client()
            if self.voice_client:
                if self.voice_client.is_paused():
                    self.voice_client.resume()
                else:
                    raise Exception("There is no sound currently paused")
            else:
                raise Exception("Not connected to a voice channel")
        except Exception as error:
            print(error)
            if ctx:
                await ctx.send(error)

    async def volume(self, volume: int, ctx = None):
        try:
            self.ensure_voice_client()
            if self.voice_client is None:
                print("Not connected to a voice channel")
                raise Exception("Not connected to a voice channel")
    
            self.voice_client.source.volume = volume / 100
            if ctx:
                await ctx.send(f"Changed volume to {volume}%")
        except Exception as error:
            if ctx:
                await ctx.send(error)

    