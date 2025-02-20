# Twitter (X) Clone

## Overview
This is a decentralized Twitter (X) clone built with React Vite and hosted on the Celestia blockchain as part of a Mammothon project. The application is developed using the Chopin framework to ensure a fully decentralized, censorship-resistant, and scalable social media experience.

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
- **Blockchain**: Celestia
- **Framework**: Chopin
- **Storage**: On-chain via Celestia, Firebase
- **API**: Smart contracts interacting with Celestia

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (v16+)
- Yarn or npm

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/twitter-clone.git
   cd twitter-clone
   ```
2. Install dependencies:
   ```sh
   yarn install
   # or
   npm install
   ```
3. Configure Celestia node:
   - Follow [Celestia’s documentation](https://docs.celestia.org) to set up your light node.
   - Add the node URL in the `.env` file:
     ```
     REACT_APP_CELESTIA_NODE=https://your-celestia-node
     ```
4. Run the application:
   ```sh
   yarn dev
   # or
   npm run dev
   ```
5. Open `http://localhost:5173/` in your browser.

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

## Contributors
- **Ayomide Philip** - Lead Developer
- [Your Team Members]

## License
This project is open-source under the MIT License.

## Contact
For queries and contributions, reach out via [your-email@example.com] or join the [Mammothon community](https://mammothon.io).

