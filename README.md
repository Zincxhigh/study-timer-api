Study Timer API 🚀
A simple FastAPI-powered study timer for tracking Pomodoro-style sessions. Start sessions, stop & save them, view history - perfect for students!

✨ Live Demo
Try it live!
Interactive Swagger UI - test endpoints in browser!

📖 Features
POST /start - Start a study session with subject

POST /stop - End session & save to history

GET /session - View all saved sessions

🚀 Quick Start (Local)
bash
# 1. Install dependencies
pip install fastapi uvicorn pydantic

# 2. Run server
uvicorn main:app --reload

# 3. Open docs
http://127.0.0.1:8000/docs
🛠 API Endpoints
Endpoint	Method	Description	Example
/start	POST	Start timer	{"subject": "Math"}
/stop	POST	Stop & save	-
/session	GET	View history	-
Example usage:

bash
# Start Math session
curl -X POST "http://localhost:8000/start" -d '{"subject": "Math"}'

# Stop session
curl -X POST "http://localhost:8000/stop"

# View history
curl "http://localhost:8000/session"
📁 File Structure
text
study-timer-api/
├── main.py          # FastAPI app
├── requirements.txt # Dependencies
└── Procfile         # Railway deployment
☁️ Deploy Anywhere
Railway (used here): railway.app → GitHub repo → Live!

Render: Free tier works great

Heroku/Vercel: Add Procfile

🛠 Tech Stack
FastAPI - API framework + auto-docs

Pydantic - Data validation

JSON - Session persistence

Railway - Production hosting

📄 License
MIT - Use freely for hackathons, projects, learning!

Built by zincxhigh | #Flavourtown #HackClub 🎉

