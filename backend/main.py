from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging
import uvicorn
import os

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log")
    ]
)
logger = logging.getLogger("deli_bag_backend")

# Import internally
from backend.models import ConsultationRequest
from backend.telegram_service import send_telegram_notification

app = FastAPI(title="DeliBag Backend", version="1.0.0")

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:80",
    "https://deli-bag.ru",
    "https://www.deli-bag.ru"
]

# Allow all for development convenience if needed, but specific is better
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For now allow all to avoid issues during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/submit", status_code=status.HTTP_201_CREATED)
async def submit_consultation(request: ConsultationRequest):
    logger.info(f"Received consultation request from {request.email}")
    
    # Send notification
    success = await send_telegram_notification(request)
    
    if not success:
        logger.warning("Notification failed, but saving request (simulated)")
        # In a real app, you might want to save to DB here even if notification fails
    
    return {"message": "Заявка успешно принята", "status": "success"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
