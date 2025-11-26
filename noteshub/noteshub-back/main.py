from fastapi import FastAPI
from notes.notes_controller import notes_router
from user.user_controller import user_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes_router, prefix="/notes",tags=["Notes"])
app.include_router(user_router, prefix="/user", tags=["User"])

