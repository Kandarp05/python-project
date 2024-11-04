import re
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
    flight_no: str = Body(...),
    dept_time: str = Body(...),
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

    # Regex pattern to parse "dd/mm/yy , --:--"
    time_pattern = r"^(\d{2})/(\d{2})/(\d{2}) , (\d{2}):(\d{2})$"

    # Convert departure time
    dept_match = re.match(time_pattern, dept_time)
    if not dept_match:
        raise HTTPException(status_code=400, detail="Invalid departure time format")
    dept_day, dept_month, dept_year, dept_hour, dept_minute = dept_match.groups()
    dept_time_parsed = datetime.strptime(f"20{dept_year}-{dept_month}-{dept_day} {dept_hour}:{dept_minute}:00", "%Y-%m-%d %H:%M:%S")

    # Convert arrival time
    arr_match = re.match(time_pattern, arr_time)
    if not arr_match:
        raise HTTPException(status_code=400, detail="Invalid arrival time format")
    arr_day, arr_month, arr_year, arr_hour, arr_minute = arr_match.groups()
    arr_time_parsed = datetime.strptime(f"20{arr_year}-{arr_month}-{arr_day} {arr_hour}:{arr_minute}:00", "%Y-%m-%d %H:%M:%S")

    # Check that arrival time is later than departure time
    if arr_time_parsed <= dept_time_parsed:
        raise HTTPException(status_code=400, detail="Arrival time must be later than departure time")

    # Check for uniqueness of flight_no
    flight_exists = db.query(Schedule).filter(Schedule.flight_no == flight_no).first()
    if flight_exists:
        raise HTTPException(status_code=400, detail="Flight number must be unique")

    # Check that departure and arrival airports are different
    if dept_airport == arr_airport:
        raise HTTPException(status_code=400, detail="Departure and arrival airports must be different")

    # Check for existing schedules with the same departure and arrival airports
    airport_exists = db.query(Schedule).filter(
        Schedule.dept_airport == dept_airport,
        Schedule.arr_airport == arr_airport,
        Schedule.dept_time == dept_time_parsed,
        Schedule.arr_time == arr_time_parsed
    ).first()
    if airport_exists:
        raise HTTPException(status_code=400, detail="A schedule with the same departure and arrival airports already exists")

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
    db.refresh(new_schedule)

    return new_schedule