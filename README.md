# Taskify - Task Manager

## Getting Started

To get started with the Task Manager project, follow these steps:

### Prerequisites

- **Node.js**: Make sure you have Node.js installed on your computer. You can download it from [nodejs.org](https://nodejs.org).

### Installation

1. Clone the repository to your local machine:
    ```bash
    https://github.com/harshalhonde21/voosh-task-manager.git
    ```

### Client (Frontend)

2. Change into the client directory:
    ```bash
    cd client
    ```

3. Install the client dependencies:
    ```bash
    npm install
    ```

4. Run the development server:
    ```bash
    npm run dev
    ```

### Server (Backend)

5. Return to the main directory and change into the server directory:
    ```bash
    cd ..
    cd server
    ```

6. Install the server dependencies:
    ```bash
    npm install
    ```

7. Run the development server:
    ```bash
    npm start
    ```

### Environment Variables

Ensure that you have set up your environment variables:

- Create a `.env` file in the `server` directory and include:
    ```plaintext
   PORT = 5000
   MONGO_URL = "mongodb://localhost:27017/voosh"
   FIREBASE_SERVICE_ACCOUNT_KEY='{
    "type": "service_account",
    "project_id": "your_project_id",
    "private_key_id": "your_private_key_id",
    "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk@example.iam.gserviceaccount.com",
    "client_id": "your_client_id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk@example.iam.gserviceaccount.com"
    }'
    CLOUDINARY_CLOUD_NAME = *******
    CLOUDINARY_API_KEY = ********
    CLOUDINARY_API_SECRET = **********
    ```

- (Optional) Create a `.env` file in the `client` directory if necessary for client-specific variables:
    ```plaintext
    VITE_API_BASE_URL=http://localhost:5000/api
    ```


