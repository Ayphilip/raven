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
2. Install dependencies:
   ```sh
   yarn install
   # or
   npm run build
   ```
3. Initialize Chopin Configuration:
   - npx chopd in the raven folder
   
4. Run the application:
   ```sh
   yarn dev
   # or
   npm start
   ```
5. Open `http://localhost:4000/` in your browser.

## Smart Contract & Blockchain Interaction
- **Chopin API Integration**: All API calls are handled through Chopin’s framework to interact with Celestia.
- **Storing Data**: Tweets, likes, and user data are stored on-chain, ensuring full decentralization.
- **Retrieving Data**: The app fetches tweet hashes from Celestia and reconstructs the timeline from blockchain-stored data.

## Deployment
1. Build the application:
   ```sh
   yarn build
   # or
   npm run build
   ```
2. Deploy to a decentralized hosting service or any preferred cloud provider.

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

