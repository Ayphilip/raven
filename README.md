# RAVEN (X) Clone

## Overview
This is a decentralized Twitter (X) clone built with React Vite for Frontend and ExpressJs and NodeJs for backend with Firebase for database implemented on the Celestia blockchain as part of a Mammothon project. The application is developed using the Chopin framework to ensure a fully decentralized, censorship-resistant, and scalable social media experience.

## Features
- **Decentralized Storage**: All tweets, likes, comments, and interactions are stored directly on the Celestia blockchain.
- **Chopin Framework Integration**: Utilizes Chopin for seamless blockchain interactions.
- **Real-Time Updates**: Fetch and display tweets dynamically.
- **User Authentication**: Secure login and identity verification.
- **Tweet Management**: Post, edit, delete, and retrieve tweets.
- **Like & Retweet**: Engage with tweets through likes and retweets.
- **Commenting System**: Nested replies to tweets.
- **Decentralized Chat**: Secure direct messaging using on-chain encryption.

## Tech Stack
- **Frontend**: React (Vite)
- **Backend**: ExpressJs and NodeJs
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
2. Install dependencies For Backend:
   ```sh
   yarn install
   # or
   npm install
   ```
2. Install dependencies For Frontend:
   ```sh
   cd frontend
   npm install
   ```
3. Initialize Chopin Configuration:
   - npx chopd in the raven folder
   ```sh
   npx chopd init
   ```
   
4. Run the application:
   `In the root folder`
   ```sh
   npx chopd
   ```
   `cd frontend`
   ```sh
   npm run dev
   ```
5. Open `http://localhost:4000/` in your browser to view backend and `http://localhost:5173/` in your browser to view frontend.

## Configure Application Settings
- **Initialize and create firebase database**: Follow the Firebase Documentation on how to create a new Project [Get Started with Cloud Firestore | Firebase](https://firebase.google.com/docs/firestore/quickstart).
- **Create .env file**: In the root directory of your project, create a file named `.env`.
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
1. Build the application in the root foler:
   ```sh
   yarn build
   # or
   npm run build
   ```
2. Open `http://localhost:4000/` in your browser to open application

## Future Enhancements
- Implement token-based rewards for content engagement.
- Enable NFT-based profile customization.
- Introduce AI moderation to filter spam and inappropriate content.
- Integrate easters eggs for more user interaction

## Contributors
- **Ayomide Philip** - Lead Developer
- **Ayomide Philip** - Lead Developer
- **Ayomide Philip** - Lead Developer

## License
This project is open-source built originally for Mammothon using Chopin Framework.

## Contact
For queries and contributions, reach out via [ayolaphilip@gmail.com] or join the [Mammothon community](https://mammothon.io).

