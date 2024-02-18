import os
import json
from json.decoder import JSONDecodeError

class Settings():

    def __init__(self):
        self.settings_dir_path = '../Settings'
        self.settings_file_path = '../Settings/settings.json'
        self.start_settings_dir()
        self.start_settings_file()

    def verify_settings_file(self):
        self.start_settings_dir()
        self.start_settings_file()
    
    def start_settings_dir(self):
        if not os.path.exists(self.settings_dir_path):
            try:
                os.mkdir(self.settings_dir_path)
            except:
                raise Exception("Can't create the settings directory.")

    def start_settings_file(self):
        if not os.path.exists(self.settings_file_path):
            try:
                with open(self.settings_file_path, 'w') as json_file:
                    json_file.write('// This is the configuration file of the application.')
            except:
                raise Exception("Can't create the settings file.")

    def add_new_value(self, value_name: str, new_value: any):
        with open(self.settings_file_path, 'r') as json_file:
            try:
                json_data = json.load(json_file)
                json_data[value_name] = new_value
                with open(self.settings_file_path, 'w') as json_file:
                    json.dump(json_data, json_file, indent=4)
            except JSONDecodeError:
                with open(self.settings_file_path, 'w') as json_file:
                    json.dump({value_name: new_value}, json_file, indent=4)


settings = Settings()