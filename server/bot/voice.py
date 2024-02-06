from discord.ext.commands import Bot

class Bot_Voice():
    def __init__(self, bot: Bot):
        self.bot = bot

    async def join_voice_channel(self, channel_id: int):
        voice_channel = self.bot.get_channel(channel_id)
        await voice_channel.connect()