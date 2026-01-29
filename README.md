# AptiVerse — AI-Based Personalized Aptitude Platform

AptiVerse is a full-stack aptitude learning platform featuring personalized recommendations, study tools, and institute management, powered by an AI microservice.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Mongoose (MongoDB)
- **AI Service**: Python, FastAPI
- **Database**: MongoDB Atlas

## Project Structure
- `/frontend`: React Client
- `/backend`: Express API
- `/ai-service`: Python AI API
- `/docs`: Documentation

## Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas Connection String

## Environment Setup

### Backend (.env)
Create `backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AI_SERVICE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173
```

### Frontend
Create `frontend/.env` (optional, defaults in code):
```
VITE_API_URL=http://localhost:5000
```

## Running Locally

### 1. Start AI Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- **Student Dashboard**: KPI Cards, AI Recommendations, Recent Activity.
- **Study Room**: Practice topic-wise questions.
- **Institute Dashboard**: Create tests, view cohort reports.
- **AI Recommendations**: Personalized suggestions based on test performance.

## Deployment
- **Frontend**: Vercel (Build command: `npm run build`, Output: `dist`)
- **Backend**: Render (Command: `npm start`)
- **AI Service**: Render/Railway (Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`)

## API Documentation
See `backend/src/routes` for full route list.
- **POST** `/auth/register`: Register user
- **POST** `/auth/login`: Login
- **GET** `/dashboard/:userId`: Get student stats
- **POST** `/tests/start`: Start a test
- **POST** `/admin/questions/upload-csv`: Upload questions (Admin/Institute)
