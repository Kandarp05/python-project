from sqlalchemy.orm import Session

# Common CRUD operation to fetch all rows from a table
def get_all(db: Session, model):
    return db.query(model).all()

# Additional CRUD functions like get_by_id, create, update, delete can also be added here.
