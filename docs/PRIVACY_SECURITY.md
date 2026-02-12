# Privacy and Security — Contium

## Overview

Contium is designed with privacy by design. Original documents are never uploaded to the blockchain or to any server.

## What Data Is Stored?

| Data               | Where is it stored?       | Is it public? |
|--------------------|---------------------------|---------------|
| Original document  | Never uploaded            | N/A           |
| SHA-256 hash       | zkSYS blockchain          | Yes           |
| Wallet address     | zkSYS blockchain          | Yes           |
| Timestamp          | zkSYS blockchain          | Yes           |
| Optional metadata  | zkSYS blockchain          | Yes           |

## How Does Hashing Work?

The SHA-256 hash is a unique digital fingerprint of the document.

- **Irreversible:** The document cannot be reconstructed from the hash.
- **Unique:** Two different documents will never produce the same hash.
- **Deterministic:** The same document always generates the same hash.

```
Document: invoice_001.pdf (2.5 MB)
     |
     v
Hash: 0x7a8b9c3d... (64 characters)
```

Any modification to the document, even a single character, produces an entirely different hash. This is how tampering is detected.

## Local Processing

All processing occurs in the user's browser:

1. The user selects a file.
2. The browser computes the SHA-256 hash locally using the Web Crypto API.
3. Only the hash (64 characters) is sent to the blockchain.
4. The original file remains on the user's device.

No data is transmitted to any external server at any point in this process.

## Smart Contract Security

### DocumentRegistry

- Only the document owner can validate their document.
- A hash cannot be registered twice (prevents duplicate entries).
- All records are immutable once written to the blockchain.
- Events are emitted for every registration and validation for transparency.

### ContiumBadge (NFT)

- Badges can only be minted for validated documents.
- Inherits from OpenZeppelin contracts (industry-standard, audited).
- Ownership is controlled and traceable.

## Wallet and Transactions

- **Pali Wallet:** Your wallet never shares your private key with Contium. All signing happens inside the wallet extension.
- **Transaction signing:** Every transaction requires explicit user approval through the wallet popup.
- **Gas fees:** Paid in TSYS directly from the user's wallet.
- **Network:** All transactions occur on the zkSYS PoB DevNet, which inherits Bitcoin's security via Syscoin merged mining.

## Zero Trust Approach

Contium follows Zero Trust principles:

- No implicit trust is granted to any actor in the system.
- Every action (registration, validation, minting) requires cryptographic authentication via wallet signature.
- Document integrity is verified mathematically, not by trusting any institution or intermediary.
- All operations are verifiable on-chain by any third party.

## Security Recommendations

1. Never share your seed phrase or private key with anyone.
2. Verify the network before signing transactions (zkSYS PoB DevNet, Chain ID 57042).
3. Review transaction details before confirming in Pali Wallet.
4. Keep your original documents safe. The hash does not replace the document itself.

## Limitations

- Hashes are public. Anyone can see that a registration was made, but not the document content.
- Contium does not store documents. Only the cryptographic fingerprint is recorded.
- If the original document is lost, the hash cannot be used to recover it.
- The system proves integrity and timestamp, not the legal validity of the document content.

---

Copyright 2025 Contium by ChainPort