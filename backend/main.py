from fastapi import FastAPI
from .database import engine
from .models import Base
from .routers import aircraft, turnaround_maintenance, crew, functional_maintenance, schedules, airline_company

# Create the tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI application!"}

# Include routers for different models
app.include_router(aircraft.router, prefix="/aircraft", tags=["Aircraft"])
app.include_router(turnaround_maintenance.router, prefix="/turnaround_maintenance", tags=["Turnaround Maintenance"])
app.include_router(crew.router,prefix="/crew",tags=["Crew"]) 
app.include_router(functional_maintenance.router, prefix="/functional_maintenance", tags=["Functional Maintenance"]) 
app.include_router(schedules.router, prefix="/schedules", tags=["Schedules"])
app.include_router(airline_company.router, prefix="/airline_company", tags=["Airline Company"])