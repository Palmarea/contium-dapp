# System Architecture — Contium

## General Diagram

```mermaid
graph TB
    subgraph User["User"]
        A[Browser + Pali Wallet]
    end

    subgraph Frontend["Frontend — SvelteKit"]
        B[Landing Page<br/><i>routes/+page.svelte</i>]
        C[Dashboard<br/><i>routes/app/+page.svelte</i>]
        D[Leaderboard<br/><i>routes/leaderboard/+page.svelte</i>]
        E[WalletConnect<br/><i>components/WalletConnect.svelte</i>]
        F[FileUpload<br/><i>components/FileUpload.svelte</i>]
        G[RegisterButton<br/><i>components/RegisterButton.svelte</i>]
        H[ValidateButton<br/><i>components/ValidateButton.svelte</i>]
        I[MintBadgeButton<br/><i>components/MintBadgeButton.svelte</i>]
        J[config.js<br/><i>ABIs + Addresses + Network</i>]
    end

    subgraph Blockchain["zkSYS PoB DevNet — Chain ID 57042"]
        K["DocumentRegistry<br/>0xd707...6322<br/><i>Registration + Validation + Scores</i>"]
        L["ContiumBadge<br/>0x9126...4959<br/><i>NFT Badge ERC-721</i>"]
        M["Block Explorer<br/>explorer-pob.dev11.top"]
    end

    A -->|Connect Wallet| E
    A -->|Upload File| F
    F -->|SHA-256 Local| C
    E -->|window.ethereum<br/>Pali EVM Provider| K
    G -->|registerDocument<br/>hash + metadata| K
    H -->|validateDocument<br/>hash| K
    I -->|mintBadge<br/>recipient + hash| L
    K -->|Events + TX| M
    L -->|Events + TX| M
    D -->|getTopUsers| K
    C -->|getScore| K
    J -->|ABI + Address| G
    J -->|ABI + Address| H
    J -->|ABI + Address| I
```

## Data Flow

```mermaid
sequenceDiagram
    actor U as User
    participant PW as Pali Wallet
    participant FE as Frontend (SvelteKit)
    participant DR as DocumentRegistry
    participant CB as ContiumBadge
    participant EX as Explorer

    U->>FE: 1. Opens the app
    FE->>PW: 2. Request connection
    PW->>U: 3. Approve connection + zkSYS network
    PW-->>FE: 4. Account connected

    U->>FE: 5. Uploads document
    FE->>FE: 6. Generates SHA-256 (local)
    FE-->>U: 7. Displays hash

    U->>FE: 8. Click "Register"
    FE->>PW: 9. Sign TX
    PW->>U: 10. Approve TX
    PW->>DR: 11. registerDocument(hash, "")
    DR-->>EX: 12. TX confirmed
    DR-->>FE: 13. DocumentRegistered event

    U->>FE: 14. Click "Validate"
    FE->>PW: 15. Sign TX
    PW->>DR: 16. validateDocument(hash)
    DR-->>DR: 17. score += 10
    DR-->>FE: 18. DocumentValidated event

    U->>FE: 19. Click "Mint Badge"
    FE->>PW: 20. Sign TX
    PW->>CB: 21. mintBadge(address, hash)
    CB-->>FE: 22. Badge NFT created
```

## Main Components

### Smart Contracts

| Contract | Main Functions | Events |
|----------|---------------|--------|
| **DocumentRegistry** | `registerDocument(hash, metadata)` | `DocumentRegistered(hash, owner, timestamp)` |
| | `validateDocument(hash)` | `DocumentValidated(hash, owner, newScore)` |
| | `getDocument(hash)` returns DocumentInfo | |
| | `getScore(address)` returns uint256 | |
| | `getTopUsers(limit)` returns address[], uint256[] | |
| | `isRegistered(hash)` returns bool | |
| | `isValidated(hash)` returns bool | |
| **ContiumBadge** | `mintBadge(recipient, documentHash)` | `Transfer(from, to, tokenId)` |
| | `balanceOf(address)` returns uint256 | |
| | `tokenURI(tokenId)` returns string | |

### Frontend

| Component | Responsibility |
|-----------|---------------|
| **WalletConnect.svelte** | Pali Wallet connection, network detection, modal to add zkSYS |
| **FileUpload.svelte** | File upload and local SHA-256 hash generation |
| **RegisterButton.svelte** | Calls `registerDocument()` on the contract |
| **ValidateButton.svelte** | Calls `validateDocument()` on the contract |
| **MintBadgeButton.svelte** | Calls `mintBadge()` on ContiumBadge |
| **TxConfirmation.svelte** | Transaction confirmation progress bar (1/5 to 5/5 blocks) |
| **InstructionPanel.svelte** | Step-by-step instruction panel for user guidance |
| **config.js** | Centralized configuration: network, addresses, ABIs |

## Network Configuration

| Parameter | Value |
|-----------|-------|
| **Chain ID** | 57042 (0xDED2) |
| **Network** | zkSYS PoB DevNet |
| **RPC** | https://rpc-pob.dev11.top |
| **Explorer** | https://explorer-pob.dev11.top |
| **Native Token** | TSYS (18 decimals) |
| **Wallet** | Pali Wallet v2 (EVM mode) |