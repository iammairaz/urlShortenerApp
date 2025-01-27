**URL Shortener Application**
A simple and efficient URL shortener application that allows users to create, manage, and analyze shortened URLs. The app includes features such as analytics (clicks, devices, geolocation), Google Authentication, and more.

**Features**
1. Shorten long URLs with custom aliases.
2. Track analytics such as total clicks, unique users, devices, and operating systems.
3. Google OAuth2 Authentication.
4. MongoDB integration for data persistence.
5. Supports both local and Docker-based setups.

**Prerequisites**
Make sure you have the following installed:
1. Node.js (v16 or later)
2. MongoDB (if running locally without Docker)
3. Docker and Docker Compose (for Docker-based setup)

**Setup**
1. Clone the Repository:
   git clone https://github.com/<your-username>/urlShortenerApp.git
   cd urlShortenerApp
2. Create Environment Files
   Create the .env file inside the env/ folder for the environment you want to use. For example, local.env for local development.
   NODE_ENV=local
   SERVER_HOSTNAME=localhost
   SERVER_PORT=3000
   MAX_UPLOAD_LIMIT=50mb
   # MongoDB Config
   MONGO_HOST=localhost
   MONGO_USERNAME=JMTK
   MONGO_PORT=27017
   MONGO_URL=mongodb://localhost:27017/ 
   # Google OAuth Config
   CLIENT_ID=<CLIENT_ID>
   CLIENT_SECRET=<CLIENT_SECRET>
   REDIRECT_URI=<REDIRECT_URI> 
   # Secrets
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret

**Run Locally Without Docker  **
1. Install Dependencies:
   npm install
2. Start MongoDB
   Make sure your MongoDB instance is running on localhost:27017 or update the MONGO_URL in the .env file.
3. Build and Start the Server:
   npm run build
   npm run local
4. Test the Application
   Access the app on http://localhost:3000.
   
**Run Locally With Docker**
1. Build and Start the Docker Containers
Ensure Docker is running, then:
   docker-compose up --build
2. Verify Containers
Check that the following containers are running:
   url-shortener-app (Node.js application)
   mongo (MongoDB)
3. Access the Application
V   isit http://localhost:3000 in your browser.

**API Endpoints**
1. Shorten URL
POST /api/task/shorten
Request Body:
{
  "longUrl": "https://example.com",
  "customAlias": "myAlias",
  "topic": "exampleTopic"
}

Response:
{
  "status": 200,
  "message": "Success",
  "data": {
    "shortUrl": "http://localhost:3000/api/task/redirect/myAlias",
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
2. Redirect to Original URL
GET /api/task/redirect/:alias

3. Analytics
Alias-based Analytics: GET /api/analytics/alias/:alias
Topic-based Analytics: GET /api/analytics/topic/:topic
User-based Analytics: GET /api/analytics/user

**Testing**
Run the unit and integration tests
  npm run test

**File Structure**
urlShortenerApp/
│
├── src/
│   ├── config/            # Configuration files (e.g., Google OAuth, dotenv setup)
│   ├── controllers/       # Controller logic for routes
│   ├── models/            # Mongoose schemas and interfaces
│   ├── routes/            # Express route definitions
│   ├── services/          # Business logic and helper services
│   ├── utils/             # Utility functions
│   └── server.ts          # Main entry point for the application
│
├── env/
│   ├── local.env          # Environment variables for local setup
│   └── prod.env           # Environment variables for production
│
├── Dockerfile             # Docker configuration for the app
├── docker-compose.yml     # Docker Compose configuration
├── package.json           # NPM dependencies and scripts
└── README.md              # Documentation

