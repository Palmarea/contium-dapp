# 🔐 Privacidad y Seguridad - Contium

## Resumen

Contium está diseñado con **privacidad por diseño**. Los documentos originales **NUNCA** se suben a la blockchain ni a nuestros servidores.

## ¿Qué datos se almacenan?

| Dato | ¿Dónde se guarda? | ¿Es público? |
|------|-------------------|--------------|
| Documento original | **NUNCA** se sube | N/A |
| Hash SHA-256 | Blockchain zkSYS | ✅ Sí |
| Wallet address | Blockchain zkSYS | ✅ Sí |
| Timestamp | Blockchain zkSYS | ✅ Sí |
| Metadata opcional | Blockchain zkSYS | ✅ Sí |

## ¿Cómo funciona el hash?

El hash SHA-256 es una **huella digital única** del documento:

- Es **irreversible**: No se puede reconstruir el documento desde el hash
- Es **único**: Dos documentos diferentes NUNCA tienen el mismo hash
- Es **determinista**: El mismo documento siempre genera el mismo hash
```
Documento: factura_001.pdf (2.5 MB)
     ↓
Hash: 0x7a8b9c3d... (64 caracteres)
```

## Procesamiento Local

Todo el procesamiento ocurre **en tu navegador**:

1. Seleccionas un archivo
2. Tu navegador calcula el hash SHA-256 localmente
3. Solo el hash (64 caracteres) se envía a blockchain
4. El archivo original **permanece en tu dispositivo**

## Seguridad de Smart Contracts

### DocumentRegistry
- ✅ Solo el owner del documento puede validarlo
- ✅ Un hash no puede registrarse dos veces
- ✅ Los registros son inmutables

### ContiumBadge (NFT)
- ✅ Solo se puede mintear para documentos validados
- ✅ Hereda de OpenZeppelin (audited)
- ✅ Ownership controlado

## Wallet y Transacciones

- **MetaMask**: Tu wallet nunca comparte la private key con Contium
- **Firmas**: Cada transacción requiere tu aprobación explícita
- **Gas**: Pagas en TSYS directamente desde tu wallet

## Recomendaciones de Seguridad

1. **Nunca compartas tu seed phrase** con nadie
2. **Verifica la red** antes de firmar (zkSYS PoB DevNet)
3. **Revisa las transacciones** antes de confirmar en MetaMask
4. **Guarda tus documentos originales** - el hash no los reemplaza

## Limitaciones

- Los hashes son públicos (cualquiera puede ver que registraste algo)
- No almacenamos el documento, solo su huella digital
- Si pierdes el documento original, el hash no te ayuda a recuperarlo

## Contacto

Para reportar vulnerabilidades de seguridad, contacta al equipo **ChainPort**.

---

© 2025 Contium by ChainPort