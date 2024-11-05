from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel  # Import BaseModel from Pydantic
from App.database import get_db
from App.models import Balance_sheet

router = APIRouter()

# Define the response model as a Pydantic model
class BalanceSheetResponse(BaseModel):
    id: int
    date: str  # Use str for ISO format if needed
    revenue: float
    profit_loss: float
    bid: int

    class Config:
        orm_mode = True  # Enable ORM mode to allow SQLAlchemy models to be used

@router.get("/", response_model=List[BalanceSheetResponse])
def get_balance_sheet(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all rows from the Balance_sheet table.
    """
    balance_sheets = db.query(Balance_sheet).offset(skip).limit(limit).all()
    
    # Convert the result to a list of dictionaries
    return [
        {
            "id": bs.id,
            "date": bs.date.isoformat(),  # Format date if necessary
            "revenue": float(bs.revenue),
            "profit_loss": float(bs.profit_loss),
            "bid": bs.bid
        }
        for bs in balance_sheets
    ]
