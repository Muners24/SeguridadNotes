from datetime import datetime, timezone, timedelta
from jose import jwt, JWTError
from config import *
from fastapi import HTTPException, Depends
from fastapi import Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from models.user import UserAuth

security = HTTPBearer()

# -------------------------------
# Crear token incluyendo el rol
# -------------------------------
def createToken(data: dict, expires_delta: timedelta = None):
    """
    data debe incluir:
        - sub: id del usuario
        - rol: rol del usuario ('user' o 'admin')
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# -------------------------------
# Extraer información del token
# -------------------------------
def authToken(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        role = payload.get("rol", "user")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido: no contiene usuario")
        return {"id": user_id, "rol": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

# -------------------------------
# Dependencia para validar usuario
# -------------------------------
def validateUser(user: dict = Depends(authToken)):
    if not user or "id" not in user:
        raise HTTPException(status_code=401, detail="No autorizado. Token inválido o expirado.")
    return UserAuth(id=user["id"],rol=user["rol"])

