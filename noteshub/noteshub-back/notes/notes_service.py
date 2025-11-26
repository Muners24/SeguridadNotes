from bson import ObjectId
from models.notes import Note, NoteIn, NoteUpdate
from models.user import UserAuth
from datetime import datetime
from connection import DB, client
from user.user_service import GetUserById

notes_collection = DB["notes"]

# ----------------------------
# Convertir ObjectId → str para FastAPI
# ----------------------------
def serialize_obj(obj):
    if not obj:
        return None
    obj["id"] = str(obj["_id"])
    del obj["_id"]
    return obj


# -----------------------------------
# LISTAR NOTAS DE UN USUARIO
# -----------------------------------
def FindNotes(user:UserAuth):
    query = {}
    if user.rol != "admin":
        query["$or"] = [
            {"owner.id": user.id},
            {"editors": {"$elemMatch": {"id": user.id}}}
        ]
    
    result = list(notes_collection.find(query))
    return [serialize_obj(n) for n in result]

# -----------------------------------
# BUSCAR UNA NOTA
# -----------------------------------
def FindNote(note_id: str, user:UserAuth):
    query = {"_id": ObjectId(note_id)}
    if user.rol != "admin":
        query["$or"] = [
            {"owner.id": user.id},
            {"editors": {"$elemMatch": {"id": user.id}}}
        ]
        
    note = notes_collection.find_one(query)
    return serialize_obj(note)

# -----------------------------------
# INSERTAR NOTA
# -----------------------------------
def InsertNote(note: NoteIn, user:UserAuth):
    user = GetUserById(user.id)
    
    data = { "title": note.title }
    data["owner"] = user.model_dump()
    data["editors"] = []
    data["texts"] = []
    data["createdAt"] = datetime.utcnow()
    data["uploadedAt"] = datetime.utcnow()
    result = notes_collection.insert_one(data)
    return {"inserted_id": str(result.inserted_id)}

# -----------------------------------
# ACTUALIZAR NOTA
# -----------------------------------
def UpdateNote(data: NoteUpdate, user: UserAuth):
    note_id = data.id
    query = {"_id": ObjectId(note_id)}
    if user.rol != "admin":
        query["$or"] = [
            {"owner.id": user.id},
            {"editors": {"$elemMatch": {"id": user.id}}}
        ]
    
    original = notes_collection.find_one(query)
    
    if not original:
        return {"error": "Not authorized or not found"}
    
    if data.texts is None:
        return {"error": "Nada por actualizar"}
    
    notes_collection.update_one(query, {"$set": {"texts": data.texts, "uploadedAt": datetime.utcnow()}})

    return {"updated": True}

# -----------------------------------
# ELIMINAR NOTA
# -----------------------------------
def DeleteNote(note_id: str, user: UserAuth):
    query = {"_id": ObjectId(note_id)}
    if user.rol != "admin":
        query["owner.id"] = user.id
    
    result = notes_collection.delete_one(query)
    if result.deleted_count == 0:
        return {"error": "Not authorized or not found"}
    
    return {"deleted": True}

