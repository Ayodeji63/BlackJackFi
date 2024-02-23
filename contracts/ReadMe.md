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

## Thank You!

Feel free to explore the CasinoFi Contracts repository and contribute to its development. If you have any questions or feedback, please don't hesitate to reach out. Happy coding!