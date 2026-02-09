# 🏗️ Arquitectura del Sistema — Contium

## Diagrama General

```mermaid
graph TB
    subgraph Usuario["👤 Usuario"]
        A[Navegador + Pali Wallet]
    end

    subgraph Frontend["🖥️ Frontend — SvelteKit"]
        B[Landing Page<br/><i>routes/+page.svelte</i>]
        C[Dashboard App<br/><i>routes/app/+page.svelte</i>]
        D[Leaderboard<br/><i>routes/leaderboard/+page.svelte</i>]
        E[WalletConnect<br/><i>components/WalletConnect.svelte</i>]
        F[FileUpload<br/><i>components/FileUpload.svelte</i>]
        G[RegisterButton<br/><i>components/RegisterButton.svelte</i>]
        H[ValidateButton<br/><i>components/ValidateButton.svelte</i>]
        I[MintBadgeButton<br/><i>components/MintBadgeButton.svelte</i>]
        J[config.js<br/><i>ABIs + Addresses + Network</i>]
    end

    subgraph Blockchain["⛓️ zkSYS PoB DevNet — Chain ID 57042"]
        K["📄 DocumentRegistry<br/>0xd707...6322<br/><i>Registro + Validación + Scores</i>"]
        L["🏆 ContiumBadge<br/>0x9126...4959<br/><i>NFT Badge ERC-721</i>"]
        M["🔍 Block Explorer<br/>explorer-pob.dev11.top"]
    end

    A -->|Conectar Wallet| E
    A -->|Subir Archivo| F
    F -->|SHA-256 Local| C
    E -->|window.ethereum<br/>Pali EVM Provider| K
    G -->|registerDocument<br/>hash + metadata| K
    H -->|validateDocument<br/>hash| K
    I -->|mintBadge<br/>recipient + hash| L
    K -->|Eventos + TX| M
    L -->|Eventos + TX| M
    D -->|getTopUsers| K
    C -->|getScore| K
    J -->|ABI + Address| G
    J -->|ABI + Address| H
    J -->|ABI + Address| I
```

## Flujo de Datos

```mermaid
sequenceDiagram
    actor U as Usuario
    participant PW as Pali Wallet
    participant FE as Frontend (SvelteKit)
    participant DR as DocumentRegistry
    participant CB as ContiumBadge
    participant EX as Explorer

    U->>FE: 1. Abre la app
    FE->>PW: 2. Solicitar conexión
    PW->>U: 3. Aprobar conexión + red zkSYS
    PW-->>FE: 4. Cuenta conectada

    U->>FE: 5. Sube documento
    FE->>FE: 6. Genera SHA-256 (local)
    FE-->>U: 7. Muestra hash

    U->>FE: 8. Click "Registrar"
    FE->>PW: 9. Firmar TX
    PW->>U: 10. Aprobar TX
    PW->>DR: 11. registerDocument(hash, "")
    DR-->>EX: 12. TX confirmada
    DR-->>FE: 13. Evento DocumentRegistered

    U->>FE: 14. Click "Validar"
    FE->>PW: 15. Firmar TX
    PW->>DR: 16. validateDocument(hash)
    DR-->>DR: 17. score += 10
    DR-->>FE: 18. Evento DocumentValidated

    U->>FE: 19. Click "Mint Badge"
    FE->>PW: 20. Firmar TX
    PW->>CB: 21. mintBadge(address, hash)
    CB-->>FE: 22. Badge NFT creado 🎉
```

## Componentes Principales

### Smart Contracts

| Contrato | Funciones Principales | Eventos |
|----------|----------------------|---------|
| **DocumentRegistry** | `registerDocument(hash, metadata)` | `DocumentRegistered(hash, owner, timestamp)` |
| | `validateDocument(hash)` | `DocumentValidated(hash, owner, newScore)` |
| | `getDocument(hash)` → DocumentInfo | |
| | `getScore(address)` → uint256 | |
| | `getTopUsers(limit)` → address[], uint256[] | |
| | `isRegistered(hash)` → bool | |
| | `isValidated(hash)` → bool | |
| **ContiumBadge** | `mintBadge(recipient, documentHash)` | `Transfer(from, to, tokenId)` |
| | `balanceOf(address)` → uint256 | |
| | `tokenURI(tokenId)` → string | |

### Frontend

| Componente | Responsabilidad |
|-----------|----------------|
| **WalletConnect.svelte** | Conexión con Pali Wallet, detección de red, modal para agregar zkSYS |
| **FileUpload.svelte** | Subida de archivo y generación de hash SHA-256 local |
| **RegisterButton.svelte** | Llamada a `registerDocument()` en el contrato |
| **ValidateButton.svelte** | Llamada a `validateDocument()` en el contrato |
| **MintBadgeButton.svelte** | Llamada a `mintBadge()` en ContiumBadge |
| **config.js** | Configuración centralizada: network, addresses, ABIs |

## Configuración de Red

| Parámetro | Valor |
|-----------|-------|
| **Chain ID** | 57042 (0xDED2) |
| **Red** | zkSYS PoB DevNet |
| **RPC** | https://rpc-pob.dev11.top |
| **Explorer** | https://explorer-pob.dev11.top |
| **Token Nativo** | TSYS (18 decimales) |
| **Wallet** | Pali Wallet v2 (EVM mode) |