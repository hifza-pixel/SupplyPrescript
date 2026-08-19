from sqlalchemy import (Column,
                        Integer,
                        Float,
                        Boolean,
                        String,
                        Date,)
from app.database.connection import Base
class Shipment(Base):
    __tablename__= "shipments"
    id=Column(Integer,primary_key=True, index=True)
    shipment_reference= Column(
        String(100),unique=True, nullable=False, index=True)
    supplier_name = Column(
        String(150),nullable=False,)
    product_category = Column(
        String(100),nullable=False,)
    origin = Column(
        String(100), nullable=False,)
    destination = Column(
        String(100),nullable=False,)
    order_date = Column(
        Date,nullable=False,)
    expected_delivery_date = Column(
        Date,nullable=False,)
    actual_delivery_date = Column(
        Date,nullable=True,)
    planned_lead_time = Column(
        Float,nullable=False,)
    actual_lead_time = Column(
        Float,nullable=True,)
    quantity = Column(
        Integer,nullable=False,)
    transportation_cost = Column(
        Float,nullable=False,)
    delay_days = Column(
        Float,nullable=True,)
    delayed = Column(
        Boolean,default=False,)
    status = Column(
        String(50),default="pending",)