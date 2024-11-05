# schemas.py
from pydantic import BaseModel
from datetime import date

class FunctionalMaintenanceSchema(BaseModel):
    fmid: int
    date: date   # This must match the field in your database model
    description: str
    technician: str
    repairs_made: str

    class Config:
        orm_mode = True

class TurnaroundMaintenanceSchema(BaseModel):
    tmid: int
    date: date
    technician: str
    name: str
    repairs_made: str

    class Config:
        orm_mode = True