from fastapi import FastAPI
from routes import messages, voice_routes, image_routes, configuration, npc_routes
from bot import client
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#app routes
app.include_router(messages.router)
app.include_router(voice_routes.router)
app.include_router(image_routes.router)
app.include_router(configuration.router)
app.include_router(npc_routes.router)

@app.get("/")
def root():
    return {
        "message": "Hello World"
    }

@app.get('/start_bot')
async def start_bot():
    await client.start_bot()