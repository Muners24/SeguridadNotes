from datetime import datetime, timezone, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
import os
from fastapi import Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from config import *

security = HTTPBearer()

def createToken(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authToken(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido: no contiene usuario")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    
def validateUser(user_id: str = Depends(authToken)):
    if not user_id:
        raise HTTPException(status_code=401, detail="No autorizado. Token inválido o expirado.")
    return user_id