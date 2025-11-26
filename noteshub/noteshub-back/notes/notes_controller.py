from fastapi import APIRouter, Depends, Request
from models.notes import *
from models.user import UserAuth
from notes.notes_service import *
from auth.auth import validateUser

notes_router = APIRouter()

# LISTAR TODAS LAS NOTAS DEL USUARIO
@notes_router.get("/list/")
async def list_notes(user: UserAuth = Depends(validateUser)):
    return FindNotes(user)

# BUSCAR UNA NOTA POR ID
@notes_router.post("/find/")
async def find_note(findRequest: IdNote, user: UserAuth = Depends(validateUser)):
    return FindNote(findRequest.id,user)

# ELIMINAR UNA NOTA POR ID
@notes_router.post("/delete/")
async def delete_note(deleteRequest: IdNote, user: UserAuth = Depends(validateUser)):
    return DeleteNote(deleteRequest.id,user)

# INSERTAR UNA NOTA
@notes_router.post("/insert/")
async def insert_note(note: NoteIn, user: UserAuth = Depends(validateUser)):
    return InsertNote(note, user)

# ACTUALIZAR UNA NOTA
@notes_router.post("/update/")
async def update_note(note: NoteUpdate, user: UserAuth = Depends(validateUser)):
    return UpdateNote(note,user)
