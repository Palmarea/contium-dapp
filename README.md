# 🛡️ Contium

**Plataforma de verificación documental descentralizada sobre zkSYS**

Contium permite a los usuarios registrar, validar y certificar documentos en la blockchain zkSYS de Syscoin, generando una huella digital (hash SHA-256) inmutable que garantiza la autenticidad e integridad de cualquier archivo.

---

## 🚀 ¿Qué es Contium?

Contium es una dApp construida para el hackathon **Proof-of-Builders** de Syscoin. Resuelve el problema de la verificación documental: ¿cómo probar que un documento no ha sido alterado y que fue registrado en un momento específico?

Con Contium puedes:

- **Registrar** documentos en blockchain generando un hash SHA-256 único
- **Validar** documentos previamente registrados y ganar puntos de reputación
- **Mintear badges NFT** (ERC-721) como prueba de participación
- **Competir en el leaderboard** con otros validadores

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | SvelteKit + Vite |
| **Wallet** | Pali Wallet (EVM) |
| **Blockchain** | zkSYS PoB DevNet (Chain ID: 57042) |
| **Smart Contracts** | Solidity ^0.8.28 (Hardhat 3) |
| **Token Nativo** | TSYS |

---

## 📦 Contratos Desplegados

| Contrato | Dirección | Función |
|----------|-----------|---------|
| **DocumentRegistry** | `0xd707cc8D9FC170fe100147a8903e3DB33D596322` | Registro y validación de documentos, sistema de puntaje |
| **ContiumBadge** | `0x912675023673C6BD0045630194caeA746B564959` | NFT Badge ERC-721 para certificar participación |

**Red:** zkSYS PoB DevNet
**RPC:** `https://rpc-pob.dev11.top`
**Explorer:** `https://explorer-pob.dev11.top`

---

## 🔧 Instalación y Ejecución

### Prerequisitos

- Node.js v18+
- Pali Wallet (extensión de navegador) — [paliwallet.com](https://paliwallet.com)
- TSYS tokens en la red zkSYS PoB DevNet

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`

### Smart Contracts

```bash
cd contracts
npm install
cp .env.example .env  # Configura tu PRIVATE_KEY
npx hardhat test      # Ejecutar tests (15 tests)
npx hardhat run scripts/deploy.js --network zksys  # Deploy
```

---

## 📋 Flujo de Usuario

1. **Conectar Wallet** — El usuario conecta Pali Wallet y se agrega la red zkSYS automáticamente
2. **Subir Documento** — Se selecciona un archivo y se genera el hash SHA-256 localmente (el archivo nunca sale del navegador)
3. **Registrar en Blockchain** — El hash se registra en el contrato DocumentRegistry con timestamp inmutable
4. **Validar Documento** — El usuario valida el documento y gana +10 puntos de reputación
5. **Mint Badge NFT** — Se mintea un badge ERC-721 como certificado de participación

---

## 🔐 Privacidad y Seguridad

- Los documentos **nunca se suben** a ningún servidor ni a la blockchain
- Solo se registra el **hash SHA-256** del documento, que es irreversible
- El hash se genera **localmente en el navegador** del usuario
- La verificación es **trustless**: cualquiera puede comprobar si un hash está registrado

---

## 🧪 Tests

```bash
cd contracts
npx hardhat test
```

```
DocumentRegistry
  ✓ Should register a document
  ✓ Should not register same hash twice
  ✓ Should validate a document
  ✓ Should increase score on validation
  ... (15 tests passing)
```

---

## 👥 Equipo — ChainPort

| Miembro | Rol |
|---------|-----|
| 🍎 Manzana | PM + Wallet Integration |
| 👨‍💻 Michael | Smart Contracts + TX Confirmation |
| 📊 Jesús | Documentación + Arquitectura |
| 🎯 André | QA + Testing |
| 🎨 Josué | UI/UX + Landing Page |
| 💅 Kimberly | Testing + Social Media |

---

## 🔗 Links

- **Explorer:** [explorer-pob.dev11.top](https://explorer-pob.dev11.top)
- **GitHub:** [github.com/Contium](https://github.com/Contium)
- **X (Twitter):** [@ContiumApp](https://x.com/ContiumApp)

---

## 📄 Licencia

MIT — Construido para el hackathon Proof-of-Builders de Syscoin.

© 2025 Contium by ChainPort