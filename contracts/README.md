# 🛡️ CONTIUM

**Verificación y certificación de documentos en blockchain**

Contium es una dApp para empresas de comercio exterior que necesitan comprobar la autenticidad de documentos como facturas, contratos y certificados.

## 🎯 ¿Qué problema resuelve?

En comercio internacional, los documentos falsos o alterados causan pérdidas millonarias. Contium permite:

- **Registrar** documentos en blockchain (inmutable)
- **Validar** que un documento es auténtico
- **Certificar** con un NFT Badge como prueba de cumplimiento

## 🚀 ¿Cómo funciona?

1. 📤 **Sube tu documento** → Se genera un hash SHA-256
2. ⛓️ **Registra el hash** → Se guarda en blockchain zkSYS
3. ✅ **Valida** → El sistema verifica y te da puntos
4. 🏆 **Mintea un Badge NFT** → Certificado digital

## 🛠️ Tecnología

| Componente | Tecnología |
|------------|------------|
| Blockchain | zkSYS PoB DevNet (Syscoin L2) |
| Smart Contracts | Solidity |
| Frontend | SvelteKit |
| Wallet | MetaMask |

## 📜 Smart Contracts Deployados

| Contrato | Función | Address |
|----------|---------|---------|
| DocumentRegistry | Registra y valida documentos | `0xd707cc8D9FC170fe100147a8903e3DB33D596322` |
| ContiumBadge | NFT de certificación | `0x912675023673C6BD0045630194caeA746B564959` |

**Network:** zkSYS PoB DevNet  
**Chain ID:** 57042  
**RPC:** https://rpc-pob.dev11.top  
**Explorer:** https://explorer-pob.dev11.top

## 📁 Estructura del Proyecto
```
contium-dapp/
├── contracts/          # Smart contracts Solidity
│   ├── contracts/      # DocumentRegistry.sol, ContiumBadge.sol
│   ├── scripts/        # Deploy scripts
│   ├── test/           # Tests unitarios
│   └── hardhat.config.ts
├── frontend/           # Aplicación SvelteKit
│   └── src/
│       ├── routes/     # Páginas (app, leaderboard)
│       └── lib/        # Componentes y config
└── docs/               # Documentación
```

## 🏃 Ejecutar Localmente

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Abre http://localhost:5173

### Contracts (tests)
```bash
cd contracts
npm install
npx hardhat test
```

## 🔗 Links

- [Explorer](https://explorer-pob.dev11.top)
- [DocumentRegistry](https://explorer-pob.dev11.top/address/0xd707cc8D9FC170fe100147a8903e3DB33D596322)
- [ContiumBadge](https://explorer-pob.dev11.top/address/0x912675023673C6BD0045630194caeA746B564959)

## 👥 Equipo

**ChainPort** - Desarrollado para el **zkSYS Hackathon 2025**

---

© 2025 Contium by ChainPort - RegTech on Syscoin