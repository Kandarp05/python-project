from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db  # Adjust this import based on your database setup
from ..models import Airline_company
from ..crud import get_all # Assuming your CRUD function is in crud.py

router = APIRouter()

@router.get("/")
async def read_all_airline_companies(db: Session = Depends(get_db)):
    return get_all(db, Airline_company)

#curl -X PUT "http://localhost:8000/airline_company/?cid=1&name=Global%20Air&founded_year=1995&ceo=John%20Smith&fleet_size=150&hq=New%20York,%20USA&bid=101&date=2023-01-01&revenue=150000000.00&profit_loss=2000000.00"
@router.put("/")
async def update_airline_company(
    cid: int, 
    name: str, 
    founded_year: int, 
    ceo: str, 
    fleet_size: int, 
    hq: str, 
    bid: str, 
    date: str, 
    revenue: float, 
    profit_loss: float,
    db: Session = Depends(get_db)
):
    airline_company = db.query(Airline_company).filter(Airline_company.cid == cid, Airline_company.bid == bid).first()
    
    if airline_company is None:
        raise HTTPException(status_code=404, detail="Airline company not found")
    
    # Update the airline company attributes
    airline_company.name = name
    airline_company.founded_year = founded_year
    airline_company.ceo = ceo
    airline_company.fleet_size = fleet_size
    airline_company.hq = hq
    airline_company.date = date
    airline_company.revenue = revenue
    airline_company.profit_loss = profit_loss
    
    # Commit the changes
    db.commit()
    
    return {"message": "Airline company updated successfully"}