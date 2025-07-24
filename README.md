# NewsDash App

A professional, full-stack news reader web application inspired by CNN, featuring real-time news, weather, and a modern, compact UI.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Branding & UI](#branding--ui)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview
NewsDash App is a full-stack web application that delivers the latest news headlines, custom news searches, and real-time weather updates in a visually appealing, CNN-style interface. Built with Node.js/Express, React, and MongoDB, it integrates with NewsAPI.org and Open-Meteo for live data.

## Features
- **Live News Headlines:** Top stories from NewsAPI.org
- **Custom News Search:** Search and save custom queries
- **User Authentication:** Simple login system (demo credentials: `admin`/`admin`)
- **Saved Searches:** Save, load, and manage news queries
- **Real-Time Weather Widget:** City picker, live weather (Fahrenheit)
- **Modern UI:** Compact, edge-to-edge, CNN-inspired design
- **Robust Error Handling:** Friendly messages for API errors, rate limits, and backend issues
- **Comprehensive API Test Suite:** `/frontend/public/api-tests.html` for backend endpoint testing

## Tech Stack
- **Frontend:** React, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (for user and query persistence)
- **APIs:** NewsAPI.org, Open-Meteo

## Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Final-Captone-Project
   ```
2. **Install dependencies:**
   - Backend:
     ```bash
     cd back-end
     npm install
     ```
   - Frontend:
     ```bash
     cd ../frontend
     npm install
     ```
3. **Configure environment variables:**
   - Create a `.env` file in `back-end/` with:
     ```env
     API_KEY=your_newsapi_key
     MONGODB_URI=your_mongodb_connection_string
     ```

## Running the App
- **Start Backend:**
  ```bash
  cd back-end
  npm start
  ```
- **Start Frontend:**
  ```bash
  cd frontend
  npm start
  ```
- **Access the app:**
  - Frontend: [http://localhost:3000](http://localhost:3000)
  - Backend API: [http://localhost:4000](http://localhost:4000)

## API Endpoints
- `GET /news` — Top headlines (US)
- `POST /news` — Custom news search (JSON body)
- `GET /users` — List users (no passwords)
- `POST /users/authenticate` — Login (JSON body)
- `GET /queries` — Get saved queries
- `POST /queries` — Save queries (JSON array)

See `/frontend/public/api-tests.html` for a full interactive test suite and endpoint documentation.

## Testing
- **Backend API:** Open `/frontend/public/api-tests.html` in your browser for a comprehensive, interactive test suite.
- **Frontend UI:** See `/frontend/public/frontend-tests.html` for UI/UX checks.
- **Manual:** Use the app as a user to verify all features and error handling.

## Project Structure
```
Final-Captone-Project/
├── back-end/           # Node.js/Express backend
│   ├── routes/
│   ├── server.js
│   └── ...
├── frontend/           # React frontend
│   ├── public/
│   ├── src/
│   └── ...
├── queries.json        # Saved queries
├── .env                # Environment variables (not committed)
├── package.json        # Project metadata
└── README.md           # This file
```

## Branding & UI
- **CNN-style:** Red/black/white color scheme, bold headlines, compact cards
- **Edge-to-edge layout:** Maximizes visible news
- **Weather widget:** Bottom right, matches app style
- **Logo:** Custom logo in header
- **Responsive:** Works on desktop and mobile

## Troubleshooting
- **CORS errors:** Ensure backend allows requests from frontend origin
- **API_KEY issues:** Make sure `.env` is set and server restarted
- **MongoDB errors:** Check your connection string and database status
- **NewsAPI rate limits:** Friendly error messages shown in UI
- **Port conflicts:** Default ports are 3000 (frontend) and 4000 (backend)

## License
MIT License. See LICENSE file for details.
