from fastapi import HTTPException
from connection import DB, client
from models.user import *
import bcrypt
from auth.auth import createToken
from bson import ObjectId

import pymongo.errors

user_collection = DB["Users"]

def RegisterUser(user):
    
    exist = user_collection.find_one({"email": user.email})
    
    if exist:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    
    hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    
    u = {
        "rol":"user",
        "name":user.name,
        "email":user.email,
        "password": hashed_password
    }
        
    try:
        result = user_collection.insert_one(u)
        
        access_token = createToken(
                data={
                    "sub": str(result.inserted_id),
                    "rol" : u["rol"],
                })
        
        return UserOut(
            name=user.name,
            email=user.email,
            token = access_token
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al registrar el usuario: {str(e)}"
        )
        
def LoginUser(user):
    try:
        user_found = user_collection.find_one({"email": user.email})
        
        
        if user_found and bcrypt.checkpw(user.password.encode("utf-8"), user_found["password"]):
            access_token = createToken(
                data={
                    "sub": str(user_found["_id"]),
                    "rol" : str(user_found["rol"])
                })
            
            return UserOut(
                name=user_found["name"],
                email=user_found["email"],
                token=access_token,
            )
        else:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al iniciar sesión")


def UpdateUser(data: dict, user: UserAuth):
    query = {"_id": ObjectId(user.id)}
    
    if "name" not in data:
        return {"error": "No name provided to update"}
    
    result = user_collection.update_one(query, {"$set": data})

    if result.matched_count == 0:
        return {"error": "User not found or not authorized"}

    return {"updated": True}



def GetUserById(id: str) -> UserInfo: 
    try:
        user_found = user_collection.find_one({"_id": ObjectId(id)})
        
        if user_found:
            print(user_found)
            return UserInfo(
                id=str(user_found["_id"]),
                name=user_found["name"],
                email=user_found["email"]
            )
            
        else:
            raise HTTPException(status_code=401, detail="No existe un usuario con esa id")
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error al buscar usuario")