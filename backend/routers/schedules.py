import traceback
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from App.database import get_db
from App.models import Schedule,Aircraft
from App.crud import get_all
from datetime import datetime

router = APIRouter()

@router.get("/")
def read_schedules(db: Session = Depends(get_db)):
    try:
        schedules = get_all(db, Schedule)
        return [{
            "sid": s.sid,
            "flight_no": s.flight_no,
            "dept_time": s.dept_time.strftime("%Y-%m-%d %H:%M:%S") if s.dept_time else None,
            "arr_time": s.arr_time.strftime("%Y-%m-%d %H:%M:%S") if s.arr_time else None,
            "dept_airport": s.dept_airport,
            "arr_airport": s.arr_airport,
            "airid": s.airid
        } for s in schedules]
    except Exception as e:
        print("Error fetching schedules:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/{sid}")
def delete_schedule(sid: int, db: Session = Depends(get_db)):
    # Query the schedule to see if it exists
    schedule = db.query(Schedule).filter(Schedule.sid == sid).first()
    
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    # Delete the schedule
    db.delete(schedule)
    db.commit()  # Commit the changes to the database

    return {"detail": "Schedule deleted successfully"}

@router.post("/")
def create_schedule(
    flight_no: str = Body(...),  # Accepting parameters directly
    dept_time: str = Body(...),  # Use str for datetime and handle parsing in the function
    arr_time: str = Body(...),
    dept_airport: str = Body(...),
    arr_airport: str = Body(...),
    airid: int = Body(...),
    db: Session = Depends(get_db)
):
    # Check if the aircraft exists
    aircraft_exists = db.query(Aircraft).filter(Aircraft.airid == airid).first()
    if not aircraft_exists:
        raise HTTPException(status_code=404, detail="Aircraft not found")

    # Parse strings into datetime objects
    dept_time_parsed = datetime.fromisoformat(dept_time)
    arr_time_parsed = datetime.fromisoformat(arr_time)

    # Create a new Schedule instance
    new_schedule = Schedule(
        flight_no=flight_no,
        dept_time=dept_time_parsed,
        arr_time=arr_time_parsed,
        dept_airport=dept_airport,
        arr_airport=arr_airport,
        airid=airid
    )

    # Add the new schedule to the session
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)  # Refresh to get the new instance data

    return new_schedule
