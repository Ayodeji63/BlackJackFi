# CasinoFi: Contracts

Welcome to the CasinoFi Contracts repository. This project encompasses the smart contracts powering the CasinoFi platform.

**Smart Contracts:**
- [CasinoFiToken](https://sepolia.basescan.org/address/0x430a863cc9a8b4b65e7ca085e62b9aae3df80f2a)
- [CasinoFiBet](https://sepolia.basescan.org/address/0x35e3e666eA1c5669A579fa35c85013a11eB640e5)

## About

CasinoFi is designed as a stablecoin platform where users can deposit WETH and WBTC in exchange for a token pegged to the USD.

## Getting Started

### Requirements
- [foundry](https://getfoundry.sh/) (Ensure you have it installed by running `forge --version`)

### Quickstart

```bash
git clone https://github.com/Ayodeji63/BlackJackFi
cd contracts
forge install
forge install OpenZeppelin/openzeppelin-contracts
forge remapings > remappings.txt
forge build
```

## Usage

### Start a Local Node

```bash
make anvil
```

### Deploy

This will deploy to your local node (ensure it's running in another terminal).

```bash
make deploy
```

### Deployment to a Testnet or Mainnet

1. **Setup Environment Variables:**
   - `PRIVATE_KEY`: Private key of your account (from Metamask).
   - `BASE_SEP_RPC_URL`: URL of the sepolia testnet node.
   - Optionally, add `BASE_API_KEY` for contract verification on [Sepolia Basescan](https://sepolia.basescan.org/).

2. **Deploy:**

```bash
make deploy ARGS="--network baseSep"
```

3. **Deploy CasinoFiBet:**

```bash
make deployCasinoFiBet ARGS="--network baseSep"
```

### Estimate Gas

Estimate gas costs by running:

```bash
forge snapshot
```

This generates a `.gas-snapshot` file.

## Testing

```bash
forge test
```

### Test Coverage

```bash
forge coverage
```

For coverage-based testing:

```bash
forge coverage --report debug
```

## Formatting

To run code formatting:

```bash
forge fmt
```

## Slither (Security Analysis)

```bash
slither :; slither . --config-file slither.config.json
```

## CasinoFiBet: Betting and Rewards

### Features

- **Set Bet:** Players can set their bets for a specific table.
- **Remove Bet:** Players can remove bets from a table.
- **Handle Win and Loss:** The contract handles player wins and losses, distributing rewards accordingly.
- **Total Bet Query:** Query the total amount of chips a player has bet on a specific table.
- **Early Access Minting:** Early users can mint CasinoFiTokens during the early access period.

### Set Bet

Players can set their bets for a specific table using the `setBet` function. The function checks the player's balance and transfers the specified amount to the contract. The event `CasinoFiBet__SetBet` is emitted.

### Remove Bet

Players can remove bets from a table using the `removeBet` function. The function checks the player's available chips on the table, updates the bet amount, and transfers the chips back to the player. The event `CasinoFiBet__RemoveBet` is emitted.

### Handle Win and Loss

The `handleWinAndLoose` function manages player wins and losses. If a player wins, the contract calculates the win amount, deducts a table fee, and transfers the remaining amount to the player. The table fee is sent to the dealer. If a player loses, no action is taken.

### Total Bet Query

The `getTotalBetChips` function allows querying the total amount of chips a player has bet on a specific table.

### Early Access Minting

During the early access period, early users can mint CasinoFiTokens using the `mintForEarlyUsers` function. This function is accessible until the end of the early access period, after which it becomes disabled.

## CasinoFiToken: Tokenomics and Functionality

### Tokenomics

- **Max Supply:** 300 million tokens (CFI).
- **Early Access Supply:** 5% of the max supply for early users.
- **Treasury Supply:** 20% of the max supply for the treasury.
- **CasinoFi Pool:** 30% of the max supply allocated for the CasinoFiBet pool.
- **Developer Rewards Supply:** 4% of the max supply for developers.
- **Staking Rewards Supply:** 6% of the max supply for staking rewards.
- **Buyback and Burn Supply:** 1% of the max supply for buyback and burn.

### Functionality

- **Minting:** The contract mints initial supplies for early users, treasury, developers, and additional supplies for staking rewards and buyback.
- **Early Access Minting:** Early users can mint additional tokens during the early access period.
- **End Early Access:** The owner can end the early access period, disabling further minting for early users.
- **Mint CasinoFiBet Pool:** The owner can mint tokens for the CasinoFiBet pool.
- **Transfer Developers Allocation:** The owner can transfer tokens allocated for developers to another address.
- **Burn Token:** The contract allows burning tokens, reducing the total supply.

## Staking: Stake and Claim Rewards

The Staking contract enables users to stake CasinoFiTokens and claim staking rewards.

### Stake

Users can stake their CasinoFiTokens using the `stake` function. The contract checks the user's balance and transfers the specified amount to the contract.

### Unstake

Users can unstake their tokens using the `unstake` function. The contract checks the user's staked amount, updates the staked balance, and transfers the staked tokens back to the user.

### Claim Rewards

The `claim` function calculates and transfers staking rewards to the user. Rewards are based on the staked amount and the duration since the last claim.

Feel free to explore # CasinoFi: Contracts

Welcome to the CasinoFi Contracts repository. This project encompasses the smart contracts powering the CasinoFi platform.

**Smart Contracts:**
- [CasinoFiToken](https://sepolia.basescan.org/address/0x430a863cc9a8b4b65e7ca085e62b9aae3df80f2a)
- [CasinoFiBet](https://sepolia.basescan.org/address/0x35e3e666eA1c5669A579fa35c85013a11eB640e5)

## About

CasinoFi is designed as a stablecoin platform where users can deposit WETH and WBTC in exchange for a token pegged to the USD.

## Getting Started

### Requirements
- [foundry](https://getfoundry.sh/) (Ensure you have it installed by running `forge --version`)

### Quickstart

```bash
git clone https://github.com/Ayodeji63/BlackJackFi
cd contracts
forge install
forge install OpenZeppelin/openzeppelin-contracts
forge remapings > remappings.txt
forge build
```

## Usage

### Start a Local Node

```bash
make anvil
```

### Deploy

This will deploy to your local node (ensure it's running in another terminal).

```bash
make deploy
```

### Deployment to a Testnet or Mainnet

1. **Setup Environment Variables:**
   - `PRIVATE_KEY`: Private key of your account (from Metamask).
   - `BASE_SEP_RPC_URL`: URL of the sepolia testnet node.
   - Optionally, add `BASE_API_KEY` for contract verification on [Sepolia Basescan](https://sepolia.basescan.org/).

2. **Deploy:**

```bash
make deploy ARGS="--network baseSep"
```

3. **Deploy CasinoFiBet:**

```bash
make deployCasinoFiBet ARGS="--network baseSep"
```

### Estimate Gas

Estimate gas costs by running:

```bash
forge snapshot
```

This generates a `.gas-snapshot` file.

## Testing

```bash
forge test
```

### Test Coverage

```bash
forge coverage
```

For coverage-based testing:

```bash
forge coverage --report debug
```

## Formatting

To run code formatting:

```bash
forge fmt
```

## Slither (Security Analysis)

```bash
slither :; slither . --config-file slither.config.json
```

## Thank You!

Feel free to explore 