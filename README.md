# Medical Corner App

Medical Corner is a comprehensive healthcare application designed to connect patients with healthcare services efficiently. This app provides a platform for patients to schedule appointments, access medical records, consult with doctors, and manage their healthcare needs in one place.

## Features

- **Appointment Scheduling**: Book, reschedule, and cancel appointments with healthcare providers.
- **Medical Records**: Access and manage personal medical records securely.
- **Doctor Consultation**: Consult with doctors via chat or video call.
- **Prescription Management**: View and manage prescriptions online.
- **Health Tips**: Receive personalized health tips and notifications.
- **Emergency Services**: Quick access to emergency contacts and services.

## Installation

### Prerequisites

- Node.js
- npm or yarn
- MongoDB (for the backend)

### Backend

1. Clone the repository:
    ```bash
    git clone https://github.com/kaiyumdev/Medical-Corner-Server
    ```
2. Navigate to the backend directory:
    ```bash
    cd Medical-Corner-Server
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Configure the environment variables:
    Create a `.env` file in the root of the backend directory and add the following:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```
5. Start the backend server:
    ```bash
    npm start