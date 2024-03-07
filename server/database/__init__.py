import os
from sqlmodel import SQLModel, create_engine
import models

class IrollDatabase():
    def __init__(self):
        self.database_dir_path = '../Data'
        self.start_database_dir()
        self.connect()

    def start_database_dir(self):
        if not os.path.exists(self.database_dir_path):
            try:
                os.mkdir(self.database_dir_path)
            except:
                raise Exception("Can't create the data directory.")

    def connect(self):
        sqlite_file_name = 'database.db'
        sqlite_url = f'sqlite:///../Data/{sqlite_file_name}'
        engine = create_engine(sqlite_url)
        SQLModel.metadata.create_all(engine)

irollDatabase = IrollDatabase()