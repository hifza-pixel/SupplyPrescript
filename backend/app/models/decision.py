from sqlalchemy import Column,Integer,Float,String,DateTime
from datetime import datetime
from app.database import Base
class Decision(Base):
    __tablename__="decisions"
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(String, nullable=True, index=True)
    option_id = Column(String, nullable=False)
    option_name = Column(String, nullable=False)
    predicted_delay_days = Column(Float, nullable=False)
    decision_cost = Column(Float, nullable=False)
    resulting_delay_days = Column(Float, nullable=False)
    budget_limit = Column(Float, nullable=False)
    max_delay_limit = Column(Float, nullable=False)
    status = Column(
        String,
        nullable=False,
        default="EXECUTED"
    )
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )