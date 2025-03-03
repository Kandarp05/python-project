from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from .database import engine
from .models import Base
from .routers import (
    aircraft, 
    turnaround_maintenance, 
    crew, 
    functional_maintenance, 
    schedules, 
    balance_sheet,
    airline_company,
    login as auth_router
)
# Create the tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin for testing
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI application!"}

# Include routers for different models
app.include_router(aircraft.router, prefix="/aircrafts", tags=["Aircraft"])
app.include_router(turnaround_maintenance.router, prefix="/turnaround_maintenance", tags=["Turnaround Maintenance"])
app.include_router(crew.router,prefix="/crew",tags=["Crew"]) 
app.include_router(functional_maintenance.router, prefix="/functional_maintenance", tags=["Functional Maintenance"]) 
app.include_router(schedules.router, prefix="/schedule", tags=["Schedules"])
app.include_router(airline_company.router, prefix="/balance", tags=["Airline Company"])
app.include_router(auth_router.router, prefix="/login", tags=["Authentication"])
app.include_router(balance_sheet.router, prefix="/balance_sheet",tags=["Balance Sheet"]) 