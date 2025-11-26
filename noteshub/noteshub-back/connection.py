from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

usuario = os.getenv("DATABASE_USER")
contraseña = os.getenv("DATABASE_PASSWORD")
host = os.getenv("DATABASE_HOST")
puerto = os.getenv("DB_PORT")
dbname = os.getenv("DATABASE_NAME")

uri = f"mongodb://{usuario}:{contraseña}@{host}:{puerto}/"
client = MongoClient(uri)

DB = client[dbname]
