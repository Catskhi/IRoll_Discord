from fastapi import FastAPI
from routes import messages, voice_routes
from bot import client

app = FastAPI()

#app routes
app.include_router(messages.router)
app.include_router(voice_routes.router)

@app.get("/")
def root():
    return {"Hello": "World"}

@app.get('/start_bot')
async def start_bot():
    await client.start_bot()