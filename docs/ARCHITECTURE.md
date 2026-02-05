# 🏗️ Arquitectura de Contium

## Visión General

Contium es una **dApp (aplicación descentralizada)** para verificación documental en comercio exterior. Sigue una arquitectura de 2 capas sin backend tradicional.

```
┌─────────────────────────────────────────────────────────────┐
│                      USUARIO                                │
│                (Browser + MetaMask)                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              CAPA DE PRESENTACIÓN (Frontend)                │
│                                                             │
│                    Svelte + ethers.js                       │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│   │  Landing    │  │  Dashboard  │  │ Leaderboard │         │
│   └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│   📁 components/   📁 services/   📁 stores/                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ JSON-RPC (ethers.js)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               CAPA DE DATOS (Blockchain)                    │
│                                                             │
│   zkSYS PoB DevNet (Chain ID: 57042)                        │
│                                                             │
│   ┌────────────────────┐    ┌────────────────────┐          │
│   │  DocumentRegistry  │◄───│   ContiumBadge     │          │
│   │  ────────────────  │    │   ──────────────   │          │
│   │  • registerDoc()   │    │   • mintBadge()    │          │
│   │  • validateDoc()   │    │   • ERC-721 NFT    │          │
│   │  • scores mapping  │    │   • tokenURI       │          │
│   └────────────────────┘    └────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      EXPLORER                               │
│              https://explorer-pob.dev11.top                 │
│           (Verificación pública de transacciones)           │
└─────────────────────────────────────────────────────────────┘
```

---

## ¿Por qué NO hay Backend tradicional?

En aplicaciones **Web3/Blockchain**, los smart contracts reemplazan al backend:

| Componente | Web2 Tradicional | Web3 (Contium) |
|------------|------------------|----------------|
| **Servidor** | Node.js/Python en AWS | No necesario |
| **Base de datos** | PostgreSQL/MongoDB | Mappings en smart contract |
| **API** | REST/GraphQL | Llamadas directas a blockchain |
| **Autenticación** | JWT/Sessions | Wallet signature (MetaMask) |
| **Hosting** | AWS/Vercel | Solo frontend estático |

### Ventajas de esta arquitectura:
- **Descentralizado** - No hay servidor central que pueda caer
- **Transparente** - Todo es verificable en el explorer
- **Inmutable** - Los registros no pueden ser alterados
- **Sin costos de servidor** - Solo pagas gas por transacciones

---

## Estructura del Proyecto (actualizando constantemente)

```
contium-dapp/
│
├── 📁 frontend/                 # Capa de presentación
│   └── 📁 src/
│       ├── 📁 routes/              # Páginas (SvelteKit routing)
│       │   ├── +page.svelte           # Landing page
│       │   ├── 📁 app/
│       │   │   └── +page.svelte       # Dashboard principal
│       │   └── 📁 leaderboard/
│       │       └── +page.svelte       # Ranking de usuarios
│       │
│       └── 📁 lib/
│           ├── 📁 components/      # UI reutilizable
│           │   ├── FileUpload.svelte
│           │   ├── WalletConnect.svelte
│           │   ├── RegisterButton.svelte
│           │   ├── ValidateButton.svelte
│           │   ├── MintBadgeButton.svelte
│           │   ├── JourneySection.svelte
│           │   ├── PrivacyModal.svelte
│           │   └── Footer.svelte
│           │
│           ├── 📁 services/        # Lógica de negocio
│           │   ├── blockchain.js      # Interacción con contratos
│           │   ├── hash.js            # Generador SHA-256
│           │   └── wallet.js          # Utilidades MetaMask
│           │
│           ├── 📁 stores/          # Estado global (Svelte stores)
│           │   ├── walletStore.js
│           │   └── documentStore.js
│           │
│           ├── 📁 utils/           # Funciones helper puras
│           │   ├── formatters.js      # truncateAddress, formatDate
│           │   └── validators.js      # isValidHash, etc
│           │
│           ├── 📁 constants/       # Configuración
│           │   ├── config.js          # Red, addresses de contratos
│           │   └── errors.js          # Mensajes de error
│           │
│           └── 📁 abis/            # Interfaces de contratos
│               ├── DocumentRegistry.json
│               └── ContiumBadge.json
│
├── 📁 contracts/                # Capa de datos (blockchain)
│   ├── 📁 contracts/              # Código Solidity
│   │   ├── DocumentRegistry.sol      # Contrato principal
│   │   ├── ContiumBadge.sol          # NFT ERC-721
│   │   └── 📁 interfaces/
│   │       └── IDocumentRegistry.sol
│   │
│   ├── 📁 scripts/                # Scripts de deploy
│   │   └── deploy.js
│   │
│   ├── 📁 test/                   # Tests unitarios
│   │   └── DocumentRegistry.test.js  # 15 tests
│   │
│   ├── deployments.json            # Addresses de contratos deployados
│   └── hardhat.config.ts           # Configuración Hardhat
│
├── 📁 docs/                     # Documentación
│   ├── ARCHITECTURE.md             # Este archivo
│   ├── INSTALACION.md
│   ├── PRIVACIDAD_Y_SEGURIDAD.md
│   ├── DIAGRAMA_FLUJO.md
│   └── 📁 diagramas/
│       ├── arquitectura-general.png
│       ├── flujo-transacciones.png
│       └── smart-contracts.png
│
├── README.md
├── .gitignore
└── LICENSE
```

---

## Flujo de Datos

```
Usuario sube archivo
        │
        ▼
┌─────────────────┐
│ calculateHash() │  ← Todo LOCAL, archivo nunca sale del browser
│ (SHA-256)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     TX1
│ registerDocument│ ──────────► Blockchain
│ ()              │             (hash guardado permanentemente)
└────────┬────────┘
         │
         ▼
┌─────────────────┐     TX2
│ validateDocument│ ──────────► Blockchain
│ ()              │             (isValidated = true, score += 10)
└────────┬────────┘
         │
         ▼
┌─────────────────┐     TX3
│ mintBadge()     │ ──────────► Blockchain
│                 │             (NFT ERC-721 creado)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Leaderboard     │ ◄────────── getTopUsers()
│ actualizado     │
└─────────────────┘
```

---

## Smart Contracts

### DocumentRegistry.sol

**Propósito:** Almacenar hashes de documentos y gestionar validaciones

```solidity
// Estructura de datos principal
struct DocumentInfo {
    address owner;      // Quien registró el documento
    uint256 timestamp;  // Cuando se registró
    bool isValidated;   // Si ya fue validado
    string metadata;    // Info adicional (JSON)
}

// Mappings (nuestra "base de datos" en blockchain)
mapping(bytes32 => DocumentInfo) public documents;   // hash → documento
mapping(address => uint256) public scores;           // wallet → puntos
```

**Funciones principales:**
- `registerDocument(hash, metadata)` → Registra un documento nuevo
- `validateDocument(hash)` → Valida y suma 10 puntos al owner
- `getTopUsers(limit)` → Retorna ranking ordenado por score

### ContiumBadge.sol (ERC-721)

**Propósito:** Emitir NFTs de cumplimiento para documentos verificados

```solidity
// Hereda estándar ERC-721 de OpenZeppelin
// Cada badge está vinculado a un documento validado
mapping(bytes32 => uint256) public documentToToken;
```

**Funciones principales:**
- `mintBadge(hash, tokenURI)` → Crea NFT para documento validado

---

## Testing

El proyecto incluye **15 tests unitarios** que verifican:

### Registro (4 tests)
- Registrar documento nuevo correctamente
- Almacenar información correcta (owner, metadata, timestamp)
- Rechazar hash duplicado
- Rechazar hash inválido (bytes32(0))

### Validación (5 tests)
- Validar documento registrado
- Sumar 10 puntos al validar
- Rechazar validación de documento inexistente
- Rechazar doble validación
- Rechazar validación por usuario no autorizado

### Score y Leaderboard (4 tests)
- Score inicia en 0
- Score acumula 10 por cada validación
- getTotalUsers cuenta correctamente
- getTopUsers retorna ranking ordenado

```bash
# Correr tests
cd contracts
npx hardhat test
```

---

## Principios de Código Limpio

### 1. Separation of Concerns (SoC)

Cada carpeta tiene una responsabilidad única:

| Carpeta | Responsabilidad |
|---------|-----------------|
| `components/` | Solo UI, sin lógica de negocio |
| `services/` | Lógica de negocio, llamadas a blockchain |
| `stores/` | Estado global de la aplicación |
| `utils/` | Funciones puras, sin side effects |
| `constants/` | Configuración, no lógica |

### 2. Nombres Descriptivos

```javascript
// ❌ MAL - ¿Qué es 'd', 'c', 'h'?
const d = await c.gd(h);
if (d.v) { s += 10; }

// ✅ BIEN - Se entiende sin comentarios
const document = await contract.getDocument(documentHash);
if (document.isValidated) {
  userScore += POINTS_PER_VALIDATION;
}
```

### 3. Funciones Pequeñas con Una Responsabilidad

```javascript
// ❌ MAL - Función gigante que hace todo
async function handleDocument(file) {
  // 50 líneas haciendo hash, validando, registrando...
}

// ✅ BIEN - Funciones pequeñas y específicas
async function calculateHash(file) { ... }
async function registerDocument(hash) { ... }
async function validateDocument(hash) { ... }
```

### 4. Manejo de Errores Específico

```javascript
// ❌ MAL - Error genérico
throw new Error('Something went wrong');

// ✅ BIEN - Errores específicos con contexto
class DocumentNotFoundError extends Error {
  constructor(hash) {
    super(`Documento con hash ${hash} no encontrado`);
    this.name = 'DocumentNotFoundError';
  }
}
```

### 5. Documentación con JSDoc

```javascript
/**
 * Registra un documento en la blockchain
 *
 * @param {string} documentHash - Hash SHA-256 del documento (con 0x)
 * @param {string} metadata - Metadatos en formato JSON string
 * @returns {Promise<TransactionReceipt>} Recibo de la transacción
 * @throws {DocumentAlreadyExistsError} Si el hash ya está registrado
 */
export async function registerDocument(documentHash, metadata) {
  // implementación...
}
```

---

## Tecnologías Utilizadas

| Capa | Tecnología | ¿Por qué? |
|------|------------|-----------|
| **Frontend** | Svelte/SvelteKit | Ligero, reactivo, compila a vanilla JS |
| **Blockchain** | Solidity 0.8.20 | Estándar para EVM |
| **Librería Web3** | ethers.js v6 | API moderna, mejor que web3.js |
| **Contratos base** | OpenZeppelin | Audited, estándar industria |
| **Testing** | Hardhat 3 + Chai | Mejor DX para Solidity |
| **Red** | zkSYS PoB DevNet | Requisito del hackathon |

---

## Decisiones de Arquitectura

### ¿Por qué Svelte y no React?
- Menos boilerplate y código más limpio
- Mejor rendimiento (compila a vanilla JS)
- Stores nativos (no necesita Redux/Zustand)

### ¿Por qué ethers.js y no web3.js?
- API más moderna y limpia
- Mejor soporte de TypeScript
- Mantenimiento más activo

### ¿Por qué no IPFS todavía?
- MVP primero, IPFS en fase futura
- Mantener complejidad baja para hackathon
- Los hashes en blockchain son suficientes para demostrar el concepto

---

## Seguridad

### En Frontend
- Hash se calcula localmente (documento nunca sale del browser)
- Validación de inputs antes de enviar a blockchain
- Manejo de errores sin exponer información sensible
- Modal de advertencia de privacidad antes de usar la dApp

### En Smart Contracts
- Uso de OpenZeppelin (código auditado por la comunidad)
- Checks de ownership antes de validar documentos
- Prevención de duplicados (mismo hash no se registra 2 veces)
- Eventos para transparencia y debugging
- 15 tests unitarios cubriendo casos positivos y negativos

---

## Escalabilidad Futura

| Actual (MVP) | Futuro |
|--------------|--------|
| Solo zkSYS DevNet | Multi-chain (Ethereum, Polygon) |
| Metadatos básicos | IPFS para documentos cifrados |
| Leaderboard simple | Sistema de rankings avanzado |
| 1 tipo de badge | Múltiples niveles (A, B, C) |
| Sin autenticación | Login con email/social (opcional) |

---

*Documentación creada para el hackathon zkSYS Proof-of-Builders 2025*
*Equipo: Paloma, Michael, Jesús, André, Josué, Kimberly*