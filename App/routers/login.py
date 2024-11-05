from fastapi import APIRouter, HTTPException

from App.models import LoginRequest, LoginResponse
HARDCODED_USERNAME = "admin"
HARDCODED_PASSWORD = "password123"

router = APIRouter()

@router.post("/", response_model=LoginResponse)
def login(login_request: LoginRequest):
    if login_request.username == HARDCODED_USERNAME and login_request.password == HARDCODED_PASSWORD:
        return {"message": "Login successful"}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")