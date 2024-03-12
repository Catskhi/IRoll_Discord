import os
from sqlmodel import SQLModel, create_engine
from database import models

class IrollDatabase():
    def __init__(self):
        self.database_dir_path = '../Data'
        self.start_database_dir()
        self.sqlite_file_name = 'database.db'
        self.sqlite_url = f'sqlite:///../Data/{self.sqlite_file_name}'
        self.engine = create_engine(self.sqlite_url)
        self.create_models()

    def start_database_dir(self):
        if not os.path.exists(self.database_dir_path):
            try:
                os.mkdir(self.database_dir_path)
            except:
                raise Exception("Can't create the data directory.")

    def create_models(self):
        SQLModel.metadata.create_all(self.engine)

irollDatabase = IrollDatabase()