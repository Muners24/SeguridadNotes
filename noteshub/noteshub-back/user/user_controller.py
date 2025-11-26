from fastapi import APIRouter, Depends, Request
from models.user import UserIn, UserOut, Token
from user.user_service import *
from auth.auth import validateUser

user_router = APIRouter()

@user_router.post("/register/", response_model=UserOut)
async def register_user(user: UserReg):
    return RegisterUser(user)

@user_router.post("/login/", response_model=UserOut)
async def login_user(user: UserIn):
    return LoginUser(user)

@user_router.post("/update/")
async def update_user(userData: Request,user: UserAuth = Depends(validateUser)):
    data = await userData.json()
    UpdateUser(data,user)
    
    