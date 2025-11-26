from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

host = os.getenv("DATABASE_HOST", "localhost")
puerto = os.getenv("DB_PORT", "27017")
dbname = os.getenv("DATABASE_NAME", "Notes")

# Conectar sin autenticación (desarrollo local)
uri = f"mongodb://{host}:{puerto}/"
client = MongoClient(uri)

DB = client[dbname]
