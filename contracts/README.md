# 🛡️ Contium — Contracts

Smart contracts for document verification and NFT certification on zkSYS blockchain.

## Deployed Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| DocumentRegistry | `0xf0f456e3873d76832BFA8646660bfF28edB7D3bD` | Document registration, validation, scoring |
| ContiumBadge | `0x50081354245135c20088D05737aD3a3AFc737972` | ERC-721 NFT badge with on-chain metadata |

**Network:** zkSYS PoB DevNet
**Chain ID:** 57042
**RPC:** https://rpc-pob.dev11.top
**Explorer:** https://explorer-pob.dev11.top
**Wallet:** Pali Wallet (https://paliwallet.com)

## Setup
```bash
npm install
cp .env.example .env  # add PRIVATE_KEY and ZKSYS_RPC_URL
```

## Commands
```bash
npx hardhat test                                    # run tests
npx hardhat run scripts/deploy.js --network zksys  # deploy
```

## Stack

- Solidity ^0.8.28
- Hardhat 3
- OpenZeppelin (ERC721, Base64, Strings)
