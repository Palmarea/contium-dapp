# 📁 Estructura de Carpetas y Código - Contium

## Estructura del Proyecto
```
contium-dapp/
│
├── 📄 README.md                 # Documentación principal
├── 📄 .gitignore                # Archivos ignorados por Git
│
├── 📁 contracts/                # Smart Contracts (Hardhat)
│   │
│   ├── 📁 contracts/            # Código Solidity
│   │   ├── DocumentRegistry.sol # Registro y validación de documentos
│   │   ├── ContiumBadge.sol     # NFT Badge ERC-721
│   │   └── Counter.sol          # Contrato de prueba
│   │
│   ├── 📁 scripts/              # Scripts de deployment
│   │   └── deploy.js            # Deploy a zkSYS
│   │
│   ├── 📁 test/                 # Tests unitarios
│   │   ├── DocumentRegistry.test.js  # 15 tests
│   │   └── Counter.ts           # Tests del counter
│   │
│   ├── 📄 hardhat.config.ts     # Configuración Hardhat 3
│   ├── 📄 package.json          # Dependencias contracts
│   ├── 📄 deployments.json      # Addresses deployados
│   ├── 📄 .env                  # Variables privadas (NO en Git)
│   └── 📄 .gitignore            # Ignora .env, artifacts, cache
│
├── 📁 frontend/                 # Aplicación Web (SvelteKit)
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 routes/           # Páginas de la app
│   │   │   ├── +layout.svelte   # Layout global
│   │   │   ├── +page.svelte     # Landing page (/)
│   │   │   │
│   │   │   ├── 📁 app/          # Dashboard principal
│   │   │   │   └── +page.svelte # Subir, registrar, validar
│   │   │   │
│   │   │   ├── 📁 leaderboard/  # Ranking de usuarios
│   │   │   │   └── +page.svelte # Top users por score
│   │   │   │
│   │   │   └── 📁 test/         # Página de pruebas
│   │   │       └── +page.svelte
│   │   │
│   │   └── 📁 lib/              # Código compartido
│   │       │
│   │       ├── 📁 components/   # Componentes Svelte
│   │       │   ├── WalletConnect.svelte    # Conexión MetaMask
│   │       │   ├── FileUpload.svelte       # Subir + hash SHA-256
│   │       │   ├── RegisterButton.svelte   # Registrar en blockchain
│   │       │   ├── ValidateButton.svelte   # Validar documento
│   │       │   ├── MintBadgeButton.svelte  # Mintear NFT
│   │       │   ├── Hero.svelte             # Hero landing
│   │       │   ├── HowItWorks.svelte       # Sección explicativa
│   │       │   ├── JourneySection.svelte   # Timeline de pasos
│   │       │   ├── Features.svelte         # Características
│   │       │   ├── Footer.svelte           # Footer
│   │       │   └── PrivacyModal.svelte     # Modal privacidad
│   │       │
│   │       └── 📄 config.js     # Addresses, ABIs, network
│   │
│   ├── 📄 package.json          # Dependencias frontend
│   ├── 📄 svelte.config.js      # Config SvelteKit
│   ├── 📄 vite.config.js        # Config Vite
│   └── 📄 tsconfig.json         # Config TypeScript
│
└── 📁 docs/                     # Documentación
    ├── ARCHITECTURE.md          # Arquitectura del sistema
    ├── FLOW_DIAGRAM.md          # Diagramas de flujo
    ├── PRIVACY_SECURITY.md      # Privacidad y seguridad
    └── CODE_STRUCTURE.md        # Este archivo
```

## Convenciones de Código

### Solidity (Smart Contracts)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title DocumentRegistry
/// @notice Registro de documentos en blockchain
/// @dev Almacena hashes SHA-256 de documentos
contract DocumentRegistry {
    
    // ============ STRUCTS ============
    
    struct DocumentInfo {
        address owner;
        uint256 timestamp;
        bool isValidated;
        string metadata;
    }
    
    // ============ STATE ============
    
    mapping(bytes32 => DocumentInfo) private documents;
    mapping(address => uint256) public scores;
    
    // ============ EVENTS ============
    
    event DocumentRegistered(
        bytes32 indexed hash,
        address indexed owner,
        uint256 timestamp
    );
    
    // ============ FUNCTIONS ============
    
    /// @notice Registra un nuevo documento
    /// @param _hash Hash SHA-256 del documento
    /// @param _metadata Metadata opcional
    function registerDocument(
        bytes32 _hash,
        string calldata _metadata
    ) external {
        // Validaciones
        require(_hash != bytes32(0), "hash invalido");
        require(!isRegistered(_hash), "hash ya registrado");
        
        // Almacenar
        documents[_hash] = DocumentInfo({
            owner: msg.sender,
            timestamp: block.timestamp,
            isValidated: false,
            metadata: _metadata
        });
        
        // Emitir evento
        emit DocumentRegistered(_hash, msg.sender, block.timestamp);
    }
}
```

### Svelte (Frontend Components)
```svelte
<script>
  // 1. Imports
  import { onMount } from 'svelte';
  import { CONTRACTS, ABIS } from '$lib/config.js';
  
  // 2. Props (exportados)
  export let hash = "";
  
  // 3. Estado local
  let status = 'idle';
  let errorMsg = '';
  
  // 4. Funciones helper
  function normalizeHash(h) {
    return h.startsWith('0x') ? h : `0x${h}`;
  }
  
  // 5. Funciones principales
  async function onSubmit() {
    // Lógica aquí
  }
  
  // 6. Lifecycle
  onMount(() => {
    // Inicialización
  });
</script>

<!-- Template: estructura clara -->
<div class="wrapper">
  {#if status === 'loading'}
    <p>Cargando...</p>
  {:else}
    <button on:click={onSubmit}>
      Enviar
    </button>
  {/if}
</div>

<!-- Estilos: al final, scoped -->
<style>
  .wrapper {
    padding: 1rem;
  }
</style>
```

### JavaScript/TypeScript (Config)
```javascript
/**
 * Configuración de red para la dApp
 * @description Contiene addresses, ABIs y helpers
 */

// Constantes en SCREAMING_SNAKE_CASE
export const NETWORK = {
  chainId: 57042,
  name: 'zkSYS PoB DevNet',
  rpcUrl: 'https://rpc-pob.dev11.top'
};

// Addresses de contratos
export const CONTRACTS = {
  documentRegistry: '0xd707cc8D9FC170fe100147a8903e3DB33D596322',
  contiumBadge: '0x912675023673C6BD0045630194caeA746B564959'
};

// Funciones helper en camelCase
export function truncateAddress(address, start = 6, end = 4) {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
```

## Naming Conventions

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Archivos Svelte | PascalCase | `WalletConnect.svelte` |
| Archivos JS/TS | camelCase | `config.js` |
| Contratos Solidity | PascalCase | `DocumentRegistry.sol` |
| Componentes | PascalCase | `<FileUpload />` |
| Variables | camelCase | `walletAddress` |
| Constantes | SCREAMING_SNAKE | `NETWORK`, `CONTRACTS` |
| Funciones | camelCase | `handleSubmit()` |
| Events Solidity | PascalCase | `DocumentRegistered` |
| CSS classes | kebab-case | `.upload-card` |

## Git Commits

Usamos **Conventional Commits**:
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato (no afecta lógica)
refactor: reestructuración de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

Ejemplos:
```
feat(SC-06): agregar addresses y ABIs de contratos
fix: JourneySection visible en landing page
docs: agregar README principal
refactor: limpiar estructura de carpetas
```

## Archivos Importantes

### `.env` (contracts/)
```env
# NUNCA subir a Git
PRIVATE_KEY=0x...
ZKSYS_RPC_URL=https://rpc-pob.dev11.top
```

### `config.js` (frontend/)
```javascript
// Centraliza toda la configuración
export const NETWORK = { ... };
export const CONTRACTS = { ... };
export const ABIS = { ... };
```

### `deployments.json` (contracts/)
```json
{
  "network": "zksys",
  "chainId": 57042,
  "DocumentRegistry": "0xd707...",
  "ContiumBadge": "0x9126..."
}
```

## Tests

### Ejecutar tests de contratos
```bash
cd contracts
npx hardhat test
```

### Resultado esperado
```
DocumentRegistry
  ✓ Should register a document
  ✓ Should not register same hash twice
  ✓ Should validate a document
  ✓ Should increase score on validation
  ... (15 tests passing)
```

---

© 2025 Contium by ChainPort