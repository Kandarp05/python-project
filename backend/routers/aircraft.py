from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from App.crud import get_all
from App.database import get_db
from App.models import Aircraft

router = APIRouter()

@router.get("/")
def read_aircraft(db: Session = Depends(get_db)):
    try:
        aircrafts = get_all(db, Aircraft)
        return [{"airid": a.airid, "model": a.model, "manufacturer": a.manufacturer, "manu_date": a.manu_date, "capacity" : a.capacity , "air_range" : a.air_range , "reg_no" : a.reg_no, "CID" : a.CID} for a in aircrafts]
    except Exception as e:
        print(f"Error fetching aircraft: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/")
def create_aircraft(
    aircraft: dict, db: Session = Depends(get_db)  # Accepting aircraft as a dict
):
    # Extracting data from the request body
    model = aircraft.get("model")
    manufacturer = aircraft.get("manufacturer")
    manu_date = aircraft.get("manu_date")
    capacity = aircraft.get("capacity")
    air_range = aircraft.get("air_range")
    reg_no = aircraft.get("reg_no")
    CID = aircraft.get("CID")

    # Perform validation (optional, but recommended)
    if not all([model, manufacturer, manu_date, capacity, air_range, reg_no, CID]):
        raise HTTPException(status_code=400, detail="All fields are required.")

    new_aircraft = Aircraft(
        model=model,
        manufacturer=manufacturer,
        manu_date=manu_date,
        capacity=capacity,
        air_range=air_range,
        reg_no=reg_no,
        CID=CID
    )
    
    try:
        db.add(new_aircraft)
        db.commit()
        db.refresh(new_aircraft)
        return {"message": "Aircraft added successfully", "airid": new_aircraft.airid}
    except Exception as e:
        print(f"Error creating aircraft: {e}")  # Log the error message
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/{aircraft_id}")
def delete_aircraft(aircraft_id: int, db: Session = Depends(get_db)):
    aircraft = db.query(Aircraft).filter(Aircraft.airid == aircraft_id).first()
    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")

    db.delete(aircraft)
    db.commit()
    return {"detail": "Aircraft deleted successfully"}

@router.get("/{aircraft_id}")
def read_aircraft_by_id(aircraft_id: int, db: Session = Depends(get_db)):
    aircraft = db.query(Aircraft).filter(Aircraft.airid == aircraft_id).first()
    if not aircraft:
        raise HTTPException(status_code=404, detail="Aircraft not found")
    
    return {
        "airid": aircraft.airid,
        "model": aircraft.model,
        "manufacturer": aircraft.manufacturer,
        "manu_date": aircraft.manu_date,
        "capacity": aircraft.capacity,
        "air_range": aircraft.air_range,
        "reg_no": aircraft.reg_no,
        "CID": aircraft.CID
    }