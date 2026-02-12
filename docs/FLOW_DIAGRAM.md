# Technical Flow Diagram — Contium

## Main User Flow

```mermaid
graph LR
    A[Upload Document] --> B[Generate SHA-256 Hash]
    B --> C[Register on Blockchain]
    C --> D[Validate Document]
    D --> E[Mint Badge NFT]
    
    A -.- A1[User selects file]
    B -.- B1[Browser computes hash locally]
    C -.- C1[Hash stored on zkSYS]
    D -.- D1[+10 reputation points]
    E -.- E1[ERC-721 certificate]
```

## Detailed Technical Flow

### 1. Document Upload

```
User                         Frontend (Browser)
  |                                |
  |  Selects file                  |
  | -----------------------------> |
  |                                |
  |                         [FileReader API]
  |                         Reads file into memory
  |                                |
  |  File loaded in memory         |
  | <----------------------------- |
```

The document never leaves the user's device. It is read into browser memory solely for hash computation.

### 2. Hash Generation

```
Frontend                     Web Crypto API
  |                                |
  |  crypto.subtle.digest()        |
  | -----------------------------> |
  |                                |
  |                         [SHA-256 Algorithm]
  |                         Produces 256-bit hash
  |                                |
  |  Hash (bytes32)                |
  | <----------------------------- |
  |                                |
  |  Example: 0x7a8b9c3d...       |
```

SHA-256 properties: irreversible (cannot reconstruct the document from the hash), unique (no two different documents produce the same hash), deterministic (same document always produces the same hash).

### 3. Register on Blockchain

```
Frontend              Pali Wallet            DocumentRegistry
  |                       |                        |
  |  registerDocument()   |                        |
  | --------------------> |                        |
  |                       |                        |
  |  Request signature    |                        |
  | <-------------------- |                        |
  |                       |                        |
  |  User confirms        |                        |
  | --------------------> |                        |
  |                       |   Signed TX            |
  |                       | ---------------------> |
  |                       |                        |
  |                       |                 [Stores:]
  |                       |                 - hash
  |                       |                 - owner address
  |                       |                 - timestamp
  |                       |                        |
  |                       |   TX receipt           |
  |                       | <--------------------- |
  |  Confirmation         |                        |
  | <--------------------------------------------- |
```

### 4. Document Validation

```
Frontend              Pali Wallet            DocumentRegistry
  |                       |                        |
  |  validateDocument()   |                        |
  | --------------------> |                        |
  |                       |   Signed TX            |
  |                       | ---------------------> |
  |                       |                        |
  |                       |                 [Checks:]
  |                       |                 - exists?
  |                       |                 - is owner?
  |                       |                 - already validated?
  |                       |                        |
  |                       |                 [Updates:]
  |                       |                 - validated = true
  |                       |                 - score += 10
  |                       |                        |
  |  Event emitted        |                        |
  | <--------------------------------------------- |
```

### 5. Mint Badge NFT

```
Frontend              Pali Wallet            ContiumBadge         DocumentRegistry
  |                       |                      |                      |
  |  mintBadge()          |                      |                      |
  | --------------------> |                      |                      |
  |                       |   Signed TX          |                      |
  |                       | -------------------> |                      |
  |                       |                      |                      |
  |                       |                      |  isValidated(hash)?  |
  |                       |                      | -------------------> |
  |                       |                      |                      |
  |                       |                      |  true                |
  |                       |                      | <------------------- |
  |                       |                      |                      |
  |                       |               [Mints ERC-721 NFT]          |
  |                       |                      |                      |
  |  NFT received         |                      |                      |
  | <------------------------------------------- |                      |
```

## Contract Architecture

```mermaid
graph TB
    subgraph zkSYS["zkSYS PoB DevNet — Chain ID 57042"]
        DR["DocumentRegistry<br/>0xd707cc8D...6322<br/><br/>registerDocument()<br/>validateDocument()<br/>getDocument()<br/>getScore()<br/>getTopUsers()<br/>isValidated()"]
        CB["ContiumBadge<br/>0x912675...4959<br/><br/>mintBadge()<br/>balanceOf()<br/>ownerOf()<br/>tokenURI()<br/><br/>ERC-721 Standard"]
    end
    
    CB -->|"isValidated(hash)"| DR
    
    U[User + Pali Wallet] -->|"register / validate"| DR
    U -->|"mintBadge"| CB
```

## Transaction Confirmation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant TX as TxConfirmation
    participant BC as Blockchain

    U->>FE: Submits action
    FE->>BC: Sends transaction
    BC-->>FE: Returns TX hash
    FE->>TX: Displays progress bar
    
    loop Block confirmations
        BC-->>TX: Block 1/5 confirmed
        BC-->>TX: Block 2/5 confirmed
        BC-->>TX: Block 3/5 confirmed
        BC-->>TX: Block 4/5 confirmed
        BC-->>TX: Block 5/5 confirmed
    end
    
    TX-->>U: Transaction fully confirmed
```

---

Copyright 2025 Contium by ChainPort