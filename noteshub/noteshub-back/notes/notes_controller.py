from fastapi import APIRouter, Depends, Request
from models.notes import *
from typing import Union
from notes.notes_service import *
from auth.auth import validateUser

notes_router = APIRouter()

# LISTAR TODAS LAS NOTAS DEL USUARIO
@notes_router.get("/list/")
def list_notes(user_id: str):
    return FindNotes(user_id)

# BUSCAR UNA NOTA POR ID
@notes_router.post("/find/")
def find_note(findRequest: IdNote,user_id: str, rol: str = Depends(validateUser)):
    return FindNote(findRequest.id)

# ELIMINAR UNA NOTA POR ID
@notes_router.post("/delete/")
def delete_note(deleteRequest: IdNote,user_id: str, rol: str = Depends(validateUser)):
    return DeleteNote(deleteRequest.id)

# INSERTAR UNA NOTA
@notes_router.post("/insert/")
async def insert_note(note: Request,user_id: str, rol: str = Depends(validateUser)):
    data = await note.json()
    return InsertNote(data)


# ACTUALIZAR UNA NOTA
@notes_router.post("/update/")
async def update_note(note: Request, user_id: str, rol: str = Depends(validateUser)):
    data = await note.json()
    return UpdateNote(data)
