from fastapi import FastAPI
from routes import messages
from bot import client

app = FastAPI()

#app routes
app.include_router(messages.router)

@app.get("/")
def root():
    return {"Hello": "World"}

@app.get('/start_bot')
async def start_bot():
    await client.start_bot()