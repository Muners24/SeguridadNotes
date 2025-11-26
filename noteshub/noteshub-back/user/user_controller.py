from fastapi import APIRouter, Depends
from models.user import UserIn, UserOut, Token
from user.user_service import *
from auth.auth import validateUser

user_router = APIRouter()

@user_router.post("/register/", response_model=UserOut)
def register_user(user: UserReg):
    return RegisterUser(user)

@user_router.post("/login/", response_model=UserOut)
def login_user(user: UserIn):
    return LoginUser(user)
    