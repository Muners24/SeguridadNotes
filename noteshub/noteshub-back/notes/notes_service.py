from bson import ObjectId
from models.notes import Note
from datetime import datetime
from connection import DB, client

notes_collection = DB["notes"]

# ----------------------------
# Convertir ObjectId → str para FastAPI
# ----------------------------
def serialize_note(note):
    if not note:
        return None
    note["id"] = str(note["_id"])
    del note["_id"]
    return note

# -----------------------------------
# LISTAR NOTAS DE UN USUARIO
# -----------------------------------
def FindNotes(user_id: str, role: str = "user"):
    query = {}
    if role != "admin":
        query = {"$or": [{"owner.id": user_id}, {"editors": user_id}]}
    
    result = list(notes_collection.find(query))
    return [serialize_note(n) for n in result]

# -----------------------------------
# BUSCAR UNA NOTA
# -----------------------------------
def FindNote(note_id: str, user_id: str, role: str = "user"):
    query = {"_id": ObjectId(note_id)}
    if role != "admin":
        query["$or"] = [{"owner.id": user_id}, {"editors": user_id}]
    
    note = notes_collection.find_one(query)
    return serialize_note(note)

# -----------------------------------
# INSERTAR NOTA
# -----------------------------------
def InsertNote(data: dict, user_id: str):
    data["owner"] = {
        "id": user_id,
        "email": data.get("owner_email", "")
    }
    data["editors"] = data.get("editors", [])
    data["createdAt"] = datetime.utcnow()
    data["uploadedAt"] = datetime.utcnow()

    result = notes_collection.insert_one(data)
    return {"inserted_id": str(result.inserted_id)}

# -----------------------------------
# ACTUALIZAR NOTA
# -----------------------------------
def UpdateNote(data: dict, user_id: str, role: str = "user"):
    note_id = data.get("id")
    query = {"_id": ObjectId(note_id)}
    if role != "admin":
        query["$or"] = [{"owner.id": user_id}, {"editors": user_id}]
    
    original = notes_collection.find_one(query)
    if not original:
        return {"error": "Not authorized or not found"}
    
    data["uploadedAt"] = datetime.utcnow()
    notes_collection.update_one({"_id": ObjectId(note_id)}, {"$set": data})
    return {"updated": True}

# -----------------------------------
# ELIMINAR NOTA
# -----------------------------------
def DeleteNote(note_id: str, user_id: str, role: str = "user"):
    query = {"_id": ObjectId(note_id)}
    if role != "admin":
        query["owner.id"] = user_id
    
    result = notes_collection.delete_one(query)
    if result.deleted_count == 0:
        return {"error": "Not authorized or not found"}
    
    return {"deleted": True}
