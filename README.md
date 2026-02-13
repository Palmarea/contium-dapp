# Contium

**Decentralized document verification platform on zkSYS**

Contium allows users to register, validate, and certify documents on Syscoin's zkSYS blockchain, generating an immutable digital fingerprint (SHA-256 hash) that guarantees the authenticity and integrity of any file.

---

## Project Description

Contium is a dApp built for the Syscoin Proof-of-Builders hackathon. It solves the document verification problem: how to prove that a document has not been altered and was registered at a specific point in time.

Core functionalities:

- Register documents on the blockchain by generating a unique SHA-256 hash.
- Validate previously registered documents and earn reputation points.
- Mint NFT badges (ERC-721) as proof of participation.
- Compete on the leaderboard with other validators.

---

## Tech Stack

| Layer             | Technology                              |
|-------------------|-----------------------------------------|
| Frontend          | SvelteKit + Vite                        |
| Wallet            | Pali Wallet (EVM)                       |
| Blockchain        | zkSYS PoB DevNet (Chain ID: 57042)      |
| Smart Contracts   | Solidity ^0.8.28 (Hardhat 3)           |
| Native Token      | TSYS                                    |

---

## Deployed Contracts

| Contract          | Address                                         | Purpose                                          |
|-------------------|-------------------------------------------------|--------------------------------------------------|
| DocumentRegistry  | `0xd707cc8D9FC170fe100147a8903e3DB33D596322`    | Document registration and validation, scoring system |
| ContiumBadge      | `0x912675023673C6BD0045630194caeA746B564959`    | ERC-721 NFT Badge for certification              |

- **Network:** zkSYS PoB DevNet
- **RPC:** `https://rpc-pob.dev11.top`
- **Explorer:** `https://explorer-pob.dev11.top`

---

## Installation and Setup

### Prerequisites

- Node.js v18+
- Pali Wallet (browser extension) — https://paliwallet.com
- TSYS tokens on the zkSYS PoB DevNet network

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

### Smart Contracts

```bash
cd contracts
npm install
cp .env.example .env  # Configure your PRIVATE_KEY
npx hardhat test      # Run tests (15 tests)
npx hardhat run scripts/deploy.js --network zksys  # Deploy
```

---

## User Flow

1. **Connect Wallet** — The user connects Pali Wallet and the zkSYS network is added automatically.
2. **Upload Document** — A file is selected and the SHA-256 hash is generated locally. The file never leaves the browser.
3. **Register on Blockchain** — The hash is registered on the DocumentRegistry contract with an immutable timestamp.
4. **Validate Document** — The user validates the document and earns +10 reputation points.
5. **Mint Badge NFT** — An ERC-721 badge is minted as a certificate of participation.

---

## Privacy and Security

- Documents are never uploaded to any server or to the blockchain.
- Only the SHA-256 hash of the document is recorded, which is irreversible.
- The hash is generated locally in the user's browser.
- Verification is trustless: anyone can check if a hash is registered.

---

## Tests

```bash
cd contracts
npx hardhat test
```

Expected output:

```
DocumentRegistry
  Should register a document
  Should not register same hash twice
  Should validate a document
  Should increase score on validation
  ... (15 tests passing)
```

---

## Team — ChainPort

| Miembro   | Rol                                                         |   
|-----------|-------------------------------------------------------------|
| Paloma    | CTO & PM - Fullstack Dev, Architecture, Wallet Integration |
| Michael   | Blockchain Engineer - Smart Contracts, Backend Integration  |
| Jesus     | Research & Documentation - Blockchain Economics             |
| Andre     | QA Engineer - Smart Contract Developer                      |
| Josue     | Frontend Lead & Fullstack Dev - UI/UX, Landing Page         |
| Kimberly  | QA & Fullstack Dev - Testing, Community Manager             |

---

## Links

- **Explorer:** https://explorer-pob.dev11.top
- **GitHub:** https://github.com/Palmarea/contium-dapp
- **X (Twitter):** https://x.com/contiumx

---

## License

MIT — Built for the Syscoin Proof-of-Builders hackathon.

Copyright 2025 Contium by ChainPort