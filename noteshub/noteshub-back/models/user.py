from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    id: str
    rol: str
    name: str
    email: EmailStr
    password: str
    
class UserIn(BaseModel):
    email: EmailStr
    password: str

class UserReg(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserInfo(BaseModel):
    id: str
    name: str
    email: str
    
class Token(BaseModel):
    access_token: str
    
class UserAuth(BaseModel):
    id: str
    rol: str
    
class UserOut(BaseModel):
    name: str
    email: str
    token: str
