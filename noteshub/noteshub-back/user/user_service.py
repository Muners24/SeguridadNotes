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
