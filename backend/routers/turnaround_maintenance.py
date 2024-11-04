from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from App.crud import get_all
from App.database import get_db
from App.models import Turnaround_maintenance

router = APIRouter()

@router.get("/")
def read_maintenance(db: Session = Depends(get_db)):
    try:
        maintenances = get_all(db, Turnaround_maintenance)
        return [{"tmid": m.tmid, "date": m.date, "technician": m.technician, "name": m.name, "repairs_made": m.repairs_made} for m in maintenances]
    except Exception as e:
        print(f"Error fetching maintenance records: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/")
def create_maintenance(
    maintenance: dict, db: Session = Depends(get_db)
):
    try:
        new_maintenance = Turnaround_maintenance(
            date=maintenance["date"],
            technician=maintenance["technician"],
            name=maintenance["name"],
            repairs_made=maintenance["repairs_made"]
        )
        db.add(new_maintenance)
        db.commit()
        db.refresh(new_maintenance)
        return {"message": "Maintenance record added successfully", "tmid": new_maintenance.tmid}
    except Exception as e:
        print(f"Error creating maintenance record: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/{log_id}")
def delete_maintenance(log_id: int, db: Session = Depends(get_db)):
    maintenance = db.query(Turnaround_maintenance).filter(Turnaround_maintenance.tmid == log_id).first()
    if not maintenance:
        raise HTTPException(status_code=404, detail="Maintenance record not found")

    db.delete(maintenance)
    db.commit()
    return {"detail": "Maintenance record deleted successfully"}
