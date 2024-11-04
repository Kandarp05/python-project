from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from App.crud import get_all
from App.database import get_db
from App.models import Aircraft

router = APIRouter()

@router.get("/")
def read_aircraft(db: Session = Depends(get_db)):
    try:
        aircrafts = get_all(db, Aircraft)
        return [{"airid": a.airid, "model": a.model, "manufacturer": a.manufacturer, "capacity" : a.capacity , "air_range" : a.air_range} for a in aircrafts]
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

    # Perform validation (optional, but recommended)
    if not all([model, manufacturer, manu_date, capacity, air_range, reg_no]):
        raise HTTPException(status_code=400, detail="All fields are required.")

    # Check if an aircraft with the same reg_no already exists
    existing_reg_no = db.query(Aircraft).filter(Aircraft.reg_no == reg_no).first()
    if existing_reg_no:
        raise HTTPException(status_code=400, detail="An aircraft with this registration number already exists.")

    # Check if an aircraft with the same combination of unique fields exists
    existing_aircraft_fields = db.query(Aircraft).filter(
        Aircraft.model == model,
        Aircraft.manu_date == manu_date,
        Aircraft.capacity == capacity,
        Aircraft.air_range == air_range
    ).first()

    if existing_aircraft_fields:
        raise HTTPException(status_code=400, detail="Aircraft with these attributes already exists.")

    # Set CID to 1 since it does not come from the frontend
    CID = 1

    # Proceed to create the new aircraft if all checks pass
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