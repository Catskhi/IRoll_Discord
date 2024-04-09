import os
from pydantic import BaseModel

class Bot_Audio():
    def __init__(self):
        self.audio_path = '../Audio'
        self.start_audio_dir()
        self.read_audio_library()

    def start_audio_dir(self):
        if not os.path.exists(self.audio_path):
            try:
                os.mkdir(self.audio_path)
            except:
                raise Exception("An error occurred while trying to make the audio folder.")

    def read_audio_library(self):
        audios = {}
        for root, directories, files in os.walk('../Audio/'):
            for filename in files:
                if os.path.splitext(filename)[1] == '.mp3':
                    file_title = os.path.splitext(filename)[0]
                    file_path = os.path.join(root, filename)
                    audios[file_title] = file_path
        if len(audios) > 0:
            return audios
        else:
            print("There are no audio files.")

            
bot_audio = Bot_Audio()