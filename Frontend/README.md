# CasinoFi Frontend: Quick Start Guide

CasinoFi Frontend is the user interface for the thrilling multiplayer gaming platform that brings the excitement of a casino to your fingertips. This guide will walk you through setting up the frontend for a seamless CasinoFi experience.

## Getting Started

### Frontend

1. **Clone the Frontend Repository:**
   ```bash
   git clone https://github.com/your-username/casinofi-frontend.git
   ```

2. **Navigate to the Frontend Folder:**
   ```bash
   cd BlackJackFi/Frontend
   ```

3. **Install Dependencies:**
   ```bash
   pnpm install
   ```

4. **Configure Environment Variables:**
   - Create a `.env` file in the root of the `frontend` folder.
   - Add the following environment variables:
   
   ```bash
    REACT_APP_PUBLIC_USERBASE_APP_ID=<USERBASE_APP_ID>
    USERBASE_ACCESS_TOKEN=<USERBASE_ACCESS_TOKEN>
    REACT_APP_CASINOFI_TOKEN_ADDRESS_ARB=<TOKEN_ADDRESS>
    REACT_APP_CASINOFI_BET_ADDRESS=<CASINO_FI_BET_ADDRESS>
    REACT_APP_PAYMASTER_ADDRESS=<PAYMASTER_ADDRESS>
    REACT_APP_BASE_SEPOLIA_API_KEY=<ALCHEMY_BASE_API_KEY>
    REACT_APP_BASE_SEPOLIA_POLICY_ID=<ALCHEMY_BASE_POLICY_ID>
    REACT_APP_SERVER_URL=http://localhost:5000
    ```

5. **Run the Application:**
   ```bash
   pnpm start
   ```
   The CasinoFi frontend will be accessible at `http://localhost:3000` by default.

Now, with the frontend set up, you can access the CasinoFi application at `http://localhost:3000` and start your gaming adventure.

## Connect With Us

Stay updated on the latest CasinoFi news and developments. Connect with us on:

- [Twitter](https://twitter.com/CasinoFiOfficial)
- [Discord](https://discord.gg/casinofi)
- [Website](https://casinofi.com)

Enjoy the thrill of CasinoFi!