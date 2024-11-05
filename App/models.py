from sqlalchemy import UniqueConstraint,PrimaryKeyConstraint,Column, Integer, String, Date, Text, ForeignKey, DateTime, DECIMAL, ForeignKeyConstraint
from sqlalchemy.orm import relationship
from .database import Base
from pydantic import BaseModel

# 1
class Aircraft(Base):
    __tablename__ = 'Aircraft'
    
    airid = Column(Integer, primary_key=True, autoincrement=True)
    model = Column(String(255), nullable=False)
    manufacturer = Column(String(255), nullable=False)
    manu_date = Column(Date, nullable=False)
    capacity = Column(Integer, nullable=False)
    air_range = Column(Integer, nullable=False)
    reg_no = Column(String(50), nullable=False)
    CID= Column(Integer, ForeignKey('Airline_company.cid'), nullable=True)  # Foreign key to Airline_company


    # Define relationships
    crew_members = relationship("Crew", back_populates="aircraft")
    turnaround_maintenances = relationship("Turnaround_maintenance", secondary="Turnaround_maintenance_R_Aircraft", back_populates="aircrafts")
    functional_maintenances = relationship("Functional_maintenance", secondary="Functional_maintenance_R_Aircraft", back_populates="aircrafts")
    airline_company = relationship("Airline_company", back_populates="aircraft")
    schedules = relationship("Schedule", back_populates="aircraft")
    inflight_facilities = relationship("Inflight_facility", back_populates="aircraft")


# 2
class Turnaround_maintenance(Base):
    __tablename__ = 'Turnaround_maintenance'
    
    tmid = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, nullable=True)
    technician = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)
    repairs_made = Column(Text, nullable=True)

    aircrafts = relationship("Aircraft", secondary="Turnaround_maintenance_R_Aircraft", back_populates="turnaround_maintenances")

# 3  
class Airline_company(Base):
    __tablename__ = 'Airline_company'

    cid = Column(Integer, primary_key=True, autoincrement=True)  # Cid as primary key
    name = Column(String(255), nullable=False)
    founded_year = Column(Integer, nullable=True)
    ceo = Column(String(255), nullable=True)
    fleet_size = Column(Integer, nullable=True)
    hq = Column(String(255), nullable=True)  # HQ renamed to hq to follow lowercase convention
    bid = Column(String(50), primary_key=True, nullable=False)  # bid as composite primary key
    date = Column(Date, nullable=True)
    revenue = Column(DECIMAL(15, 2), nullable=True)
    profit_loss = Column(DECIMAL(15, 2), nullable=True)

    # Composite primary key on cid and bid
    __table_args__ = (
        PrimaryKeyConstraint('cid', 'bid'),
    )

    # Define relationships
    aircraft = relationship("Aircraft", back_populates="airline_company")
    catering_services = relationship("Catering_service", back_populates="airline_company")
    training_programs = relationship("Training_program", back_populates="airline_company")

# 4
class Crew(Base):
    __tablename__ = 'Crew'

    eid = Column(Integer, primary_key=True, autoincrement=True)  # Eid as primary key
    name = Column(String(255), nullable=True)
    role = Column(String(50), nullable=True)
    experience = Column(Integer, nullable=True)
    certification = Column(String(255), nullable=True)
    airid = Column(Integer, ForeignKey('Aircraft.airid'), nullable=True)  # Foreign key to Aircraft

    # Relationship to the Aircraft model
    aircraft = relationship("Aircraft", back_populates="crew_members")

# 5
class Functional_maintenance(Base):
    __tablename__ = 'Functional_maintenance'
    
    fmid = Column(Integer, primary_key=True, autoincrement=True)  # Primary key
    date = Column(Date, nullable=True)
    type = Column(String(255), nullable=True)
    technician = Column(String(255), nullable=True)
    repairs_made = Column(Text, nullable=True)

    # Establish relationship to the Aircraft model
    aircrafts = relationship("Aircraft", secondary="Functional_maintenance_R_Aircraft", back_populates="functional_maintenances")

# 6
class Schedule(Base):
    __tablename__ = 'Schedule'
    
    sid = Column(Integer, primary_key=True, autoincrement=True)  # Primary key
    flight_no = Column(String(50), nullable=True)
    dept_time = Column(DateTime, nullable=True)
    arr_time = Column(DateTime, nullable=True)
    dept_airport = Column(String(50), nullable=True)
    arr_airport = Column(String(50), nullable=True)
    airid = Column(Integer, ForeignKey('Aircraft.airid'), nullable=True)  # Foreign key to Aircraft

    # Establish relationship to the Aircraft model
    aircraft = relationship("Aircraft", back_populates="schedules")

# 7    
class Inflight_facility(Base):
    __tablename__ = 'Inflight_facility'
    
    type = Column(String(255), primary_key=True)  # Primary key
    description = Column(Text, nullable=True)
    cost = Column(DECIMAL(10, 2), nullable=True)
    airid = Column(Integer, ForeignKey('Aircraft.airid'), nullable=True)  # Foreign key to Aircraft

    # Establish relationship to the Aircraft model
    aircraft = relationship("Aircraft", back_populates="inflight_facilities")

# 8
class Catering_service(Base):
    __tablename__ = 'Catering_service'
    
    csid = Column(Integer, primary_key=True, autoincrement=True)  # Primary key
    provider_name = Column(String(255), nullable=True)
    contact = Column(String(255), nullable=True)
    cid_fk = Column(Integer, ForeignKey('Airline_company.cid'), nullable=True)  # Foreign key to Airline_company

    # Establish relationship to the Airline_company model
    airline_company = relationship("Airline_company", back_populates="catering_services")

# 9
class Training_program(Base):
    __tablename__ = 'Training_program'
    
    tpid = Column(Integer, primary_key=True, autoincrement=True)  # Primary key
    name = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    duration = Column(String(255), nullable=True)
    certification_granted = Column(String(255), nullable=True)
    cid_fk = Column(Integer, ForeignKey('Airline_company.cid'), nullable=True)  # Foreign key to Airline_company

    # Establish relationship to the Airline_company model
    airline_company = relationship("Airline_company", back_populates="training_programs")

# 10
class Functional_maintenance_R_Aircraft(Base):
    __tablename__ = 'Functional_maintenance_R_Aircraft'
    
    airid = Column(Integer, ForeignKey('Aircraft.airid', ondelete='CASCADE'),primary_key=True)
    fmid = Column(Integer, ForeignKey('Functional_maintenance.fmid', ondelete='CASCADE'),primary_key=True)
    # Define composite primary key on airid and fmid
    __table_args__ = (
        UniqueConstraint('airid', 'fmid', name='uq_fm_airid_fmid'),
    )
    
# 11
class Turnaround_maintenance_R_Aircraft(Base):
    __tablename__ = 'Turnaround_maintenance_R_Aircraft'
    
    airid = Column(Integer, ForeignKey('Aircraft.airid', ondelete='CASCADE'),primary_key=True)
    tmid = Column(Integer, ForeignKey('Turnaround_maintenance.tmid', ondelete='CASCADE'),primary_key=True)
    # Define composite primary key on airid and tmid
    __table_args__ = (
        UniqueConstraint('airid', 'tmid', name='uq_tm_airid_tmid'),
    )

#12
class Balance_sheet(Base):
    __tablename__ = 'balance_sheet'

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)  # Use Date type for date
    revenue = Column(DECIMAL(15, 2), nullable=False)  # Use decimal for revenue
    profit_loss = Column(DECIMAL(15, 2), nullable=False)  # Use decimal for profit_loss
    bid = Column(Integer, nullable=False, autoincrement=True)  # Assuming bid is an integer

# Pydantic model for Login
class LoginRequest(BaseModel):
    username: str
    password: str

# Pydantic model for Login response
class LoginResponse(BaseModel):
    message: str