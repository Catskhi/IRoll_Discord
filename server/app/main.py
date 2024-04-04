from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .routes import messages, voice_routes, image_routes, configuration, npc_routes
from .bot import client
from .static import verify_static_folders

app = FastAPI()

origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#static files
verify_static_folders()
app.mount('/app/images', StaticFiles(directory='app/images'), name='images')

#app routes
app.include_router(messages.router)
app.include_router(voice_routes.router)
app.include_router(image_routes.router)
app.include_router(configuration.router)
app.include_router(npc_routes.router)

@app.get("/")
def root():
    return {
        "message": "Server started successfully."
    }

@app.get('/start_bot')
async def start_bot():
    try:
        if await client.get_bot_status() == False:
            await client.start_bot()
    except Exception as erro:
        raise HTTPException(status_code=400, detail="The bot token is invalid or is not configured.")

@app.get('/get_bot_status/')
async def get_bot_status():
    try:
        status = await client.get_bot_status()
        return {
            'status': status
        }
    except Exception as error:
        print(error)