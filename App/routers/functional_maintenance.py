from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from App.crud import get_all
from App.database import get_db
from App.models import Functional_maintenance

router = APIRouter()


@router.get("/")
def read_functional_maintenance(db: Session = Depends(get_db)):
    """
    Retrieve all functional maintenance records.

    Args:
        db (Session): The database session dependency.

    Returns:
        List[dict]: A list of functional maintenance records.

    Raises:
        HTTPException: 500 if there is an error fetching the records.
    """
    try:
        maintenances = get_all(db, Functional_maintenance)
        return [{
            "fmid": m.fmid,
            "date": m.date,
            "type": m.type,
            "technician": m.technician,
            "repairs_made": m.repairs_made
        } for m in maintenances]
    except Exception as e:
        print(f"Error fetching functional maintenance records: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/")
def create_functional_maintenance(
    maintenance: dict, db: Session = Depends(get_db)
):
    """
    Create a new functional maintenance record.

    Args:
        maintenance (dict): The maintenance record data.

    Returns:
        dict: A success message and the ID of the new record.

    Raises:
        HTTPException: 500 if there is an error creating the record.
    """
    try:
        new_maintenance = Functional_maintenance(
            date=maintenance["date"],
            type=maintenance["type"],
            technician=maintenance["technician"],
            repairs_made=maintenance["repairs_made"]
        )
        db.add(new_maintenance)
        db.commit()
        db.refresh(new_maintenance)
        return {"message": "Functional maintenance record added successfully", "fmid": new_maintenance.fmid}
    except Exception as e:
        print(f"Error creating functional maintenance record: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/{log_id}")
def delete_functional_maintenance(log_id: int, db: Session = Depends(get_db)):
    """
    Delete a functional maintenance record by ID.

    Args:
        log_id (int): The ID of the maintenance record to delete.

    Returns:
        dict: A success message.

    Raises:
        HTTPException: 404 if the record is not found.
    """
    maintenance = db.query(Functional_maintenance).filter(Functional_maintenance.fmid == log_id).first()
    if not maintenance:
        raise HTTPException(status_code=404, detail="Functional maintenance record not found")

    db.delete(maintenance)
    db.commit()
    return {"detail": "Functional maintenance record deleted successfully"}
