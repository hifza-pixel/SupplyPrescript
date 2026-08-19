import os
from dotenv import load_dotenv
load_dotenv()
APP_NAME= os.getenv(
    "APP_NAME" , "SupplyPrescript"
)
APP_VERSION=os.getenv(
    "APP_VERSION", "1.0.0"
)
DATABASE_URL=os.getenv(
    "DATABASE_URL" 
)
ENVIRONMENT=os.getenv(
    "ENVIRONMENT", "development"
)