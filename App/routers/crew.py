from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from App.database import get_db
from App.models import Crew

router = APIRouter()

@router.get("/")
def get_all_crew(db: Session = Depends(get_db)):
    crew_members = db.query(Crew).all()
    if not crew_members:
        raise HTTPException(status_code=404, detail="No crew members found")
    return crew_members

@router.get("/{aircraft_id}")
def get_crew_by_aircraft(aircraft_id: int, db: Session = Depends(get_db)):
    crew_members = db.query(Crew).filter(Crew.airid == aircraft_id).all()
    if not crew_members:
        raise HTTPException(status_code=404, detail="No crew found for this aircraft")
    return crew_members

@router.post("/")
async def create_crew_member(request: Request, db: Session = Depends(get_db)):
    data = await request.json()

    # Manual validation for required fields
    required_fields = ["name", "role", "experience", "certification", "airid"]
    for field in required_fields:
        if field not in data:
            raise HTTPException(status_code=400, detail=f"Missing field: {field}")

    # Check if a crew member with the same name already exists
    existing_crew_member = db.query(Crew).filter(Crew.name == data["name"]).first()
    if existing_crew_member:
        raise HTTPException(status_code=400, detail="A crew member with this name already exists.")

    # Check if the role is valid
    allowed_roles = {"Pilot", "Co-Pilot", "Engineer", "Cabin Crew", "Flight Attendant"}
    if data["role"] not in allowed_roles:
        raise HTTPException(status_code=400, detail="Invalid role. Allowed roles are: Pilot, Co-Pilot, Engineer, Cabin Crew, Flight Attendant.")

    # Create a new Crew instance
    new_crew_member = Crew(
        name=data["name"],
        role=data["role"],
        experience=data["experience"],
        certification=data["certification"],
        airid=data["airid"]
    )
    db.add(new_crew_member)
    db.commit()
    db.refresh(new_crew_member)
    return new_crew_member

@router.put("/{eid}")
async def update_crew_member(eid: int, request: Request, db: Session = Depends(get_db)):
    data = await request.json()

    # Fetch the existing crew member by Eid
    crew_member = db.query(Crew).filter(Crew.eid == eid).first()
    if not crew_member:
        raise HTTPException(status_code=404, detail="Crew member not found")

    # Allowed roles for validation
    allowed_roles = {"Pilot", "Co-Pilot", "Engineer", "Cabin Crew", "Flight Attendant"}

    # Update only specified fields with validation
    if "role" in data:
        if data["role"] not in allowed_roles:
            raise HTTPException(status_code=400, detail="Invalid role. Allowed roles are: Pilot, Co-Pilot, Engineer, Cabin Crew, Flight Attendant.")
        crew_member.role = data["role"]

    if "experience" in data:
        crew_member.experience = data["experience"]

    if "certification" in data:
        crew_member.certification = data["certification"]

    if "airid" in data:
        crew_member.airid = data["airid"]

    # Commit changes to the database
    db.commit()
    db.refresh(crew_member)

    return crew_member


@router.delete("/{eid}")
def delete_crew_member(eid: int, db: Session = Depends(get_db)):
    crew_member = db.query(Crew).filter(Crew.eid == eid).first()
    if not crew_member:
        raise HTTPException(status_code=404, detail="Crew member not found")
    
    db.delete(crew_member)
    db.commit()
    return {"detail": "Crew member deleted successfully"}
