# RAVEN (X) Clone

## Overview
RAVEN is a decentralized Twitter (X) clone built using React (Vite) for the frontend and Express.js with Node.js for the backend. It integrates Firebase for database management and is implemented on the Celestia blockchain as part of the Mammothon project. The application is developed using the Chopin framework to ensure a fully decentralized, censorship-resistant, and scalable social media experience.

## Features
- **Decentralized Storage**: All tweets, likes, comments, and interactions are stored on Firebase, with all POST requests directed to the Celestia blockchain.
- **Chopin Framework Integration**: Utilizes Chopin for seamless blockchain interactions.
- **Real-Time Updates**: Fetch and display tweets, treasure hunt lobbies, and chats dynamically.
- **User Authentication**: Secure login and identity verification using Chopin.
- **Tweet Management**: Post, edit, delete, and retrieve tweets.
- **Like & Retweet**: Engage with tweets through likes and retweets.
- **In-App Token**: Integration of the Raven Trust Token (RTT).
- **User Account Upgrade**: Users can upgrade their accounts using the in-app token to unlock additional features.
- **In-App Game & Rewards**: Treasure Hunt feature, hosted by upgraded users, with rewards for winners.
- **Commenting System**: Nested replies to tweets.
- **Decentralized Chat**: Secure direct messaging using end-to-end encryption (E2EE) and on-chain chat transactions via Chopin.

## Tech Stack
- **Frontend**: React (Vite)
- **Backend**: Express.js, Node.js
- **Storage**: Firebase
- **Blockchain**: Celestia
- **Authentication**: Chopin
- **API**: Chopin Framework

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (v20+)
- Yarn or npm

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/Ayphilip/raven.git
   cd raven
   ```
2. Install dependencies for the backend:
   ```sh
   yarn install
   # or
   npm install
   ```
3. Install dependencies for the frontend:
   ```sh
   cd frontend
   npm install
   ```
4. Initialize Chopin Configuration:
   ```sh
   npx chopd init
   ```
5. Run the application:
   ```sh
   npx chopd
   ```
   ```sh
   cd frontend
   npm run dev
   ```
6. Open the application in your browser:
   - Backend: `http://localhost:4000/`
   - Frontend: `http://localhost:5173/`

## Configuration
### Firebase Setup
Follow the [Firebase Documentation](https://firebase.google.com/docs/firestore/quickstart) to initialize and create a new Firestore database.

### Environment Variables
Create a `.env` file in the root directory and add the following:
   ```sh
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Deployment
1. Build the application:
   ```sh
   yarn build
   # or
   npm run build
   ```
2. Open the deployed application:
   - `http://localhost:4000/`

## Future Enhancements
- Implement token-based rewards for content engagement.
- Enable NFT-based profile customization.
- Introduce AI moderation to filter spam and inappropriate content.
- Integrate Easter eggs for more user interaction.

## Project Structure
```
RAVEN/
│── .chopin/              # Chopin framework configuration files
│── backend/              # Backend application
│   ├── config/           # Configuration files (including Firebase setup)
│   ├── controller/       # Controller logic
│   ├── routes/           # API routes
│   ├── index.js          # Main backend entry file
│   ├── util.js           # Utility functions, including Chopin framework (Oracle) functionalities
│
│── frontend/             # Frontend application
│   ├── .vite/            # Vite build settings
│   ├── assets/           # Static assets (images, fonts, etc.)
│   ├── dist/             # Build output directory
│   ├── node_modules/     # Installed dependencies
│   ├── public/           # Public assets (favicon, etc.)
│   ├── src/              # React source code
│   ├── .gitignore        # Git ignore rules
│   ├── eslint.config.js  # ESLint configuration
│   ├── index.html        # Main HTML file
│   ├── package.json      # Frontend dependencies
│   ├── package-lock.json # Dependency lock file
│   ├── vite.config.js    # Vite configuration
│
│── node_modules/         # Root dependencies
│── .env                  # Environment variables
│── .gitignore            # Git ignore rules
│── chopin.config.json    # Global Chopin configuration
│── package.json          # Root dependencies
│── package-lock.json     # Root lock file
│── README.md             # Project documentation
```

## Contributors
- **Usamah Abduljalil** - Application Manager
- **Ayomide Philip** - Lead Developer
- **Nasir Abdulganiu** - QA Engineer

## License
This project is open-source and was originally built for the Celestia Mammothon using the Chopin Framework.

## Contact
For queries and contributions, reach out via:
- **Email**: [usamahabduljalil21@gmail.com](mailto:usamahabduljalil21@gmail.com), [ayolaphilip@gmail.com](mailto:ayolaphilip@gmail.com)
- **Telegram**: [Raven Telegram Chat](https://t.me/+r0vL7W5gcC1kMDJk)

