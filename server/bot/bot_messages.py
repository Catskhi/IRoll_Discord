from discord.ext import commands

class Bot_Messages():
    def __init__(self, bot):
        self.bot = bot

    async def send_message(self, message_content: str, channel_id: int):
        channel = self.bot.get_channel(channel_id)
        if channel_id != None:
            await channel.send(message_content)
        else:
            raise ValueError("Invalid channel.")