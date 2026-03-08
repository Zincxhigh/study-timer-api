from fastapi import FastAPI, HTTPException
from datetime import datetime
from pydantic import BaseModel
from typing import List
import json
import os

app = FastAPI()

class sessionstart(BaseModel):
    subject: str = "General study"

class sessionresponse(BaseModel):
    message: str
    start: datetime

sessions: List[dict] = []
try:
    if os.path.exists("sessions.json"):
        with open("sessions.json", "r") as f:
            sessions = json.load(f)
except Exception as e:
    print(f"Load error: {e}")

current_sessions: dict | None = None  

@app.post("/start", response_model=sessionresponse)
def start_session(start_data: sessionstart):
    global current_sessions
    if current_sessions is not None: 
        raise HTTPException(status_code=400, detail="A session is already running")
    
    current_sessions = {"start": datetime.now().isoformat(), "subject": start_data.subject}
    
    return sessionresponse(  
        message="Session started", 
        start=datetime.fromisoformat(current_sessions["start"])
    )

@app.post("/stop")

def stop_session():

    global current_sessions, sessions

    if current_sessions is None:

        raise HTTPException(status_code=400, detail="No session is running")
    
    end = datetime.now()
    current_sessions["end"] = end.isoformat()

    sessions.append(current_sessions)
    
    with open("sessions.json", "w") as file:
        json.dump(sessions, file, indent=4)
    
    current_sessions = None

    return {"message": "Session saved", "end_time": end.isoformat()}

@app.get("/session", response_model=List[dict])

def get_sessions():

    return sessions


