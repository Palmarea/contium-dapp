# contium-dapp
Peru Hackaton 2026 - Blockchain (january started)

# 🧪 Testing de Componentes

## Página de Test Local

Durante desarrollo, puedes probar componentes individuales en:
```
http://localhost:5173/test
```

### MintBadgeButton Test

La página `/test` permite probar el componente MintBadgeButton con diferentes estados:

| Checkbox | Simula |
|----------|--------|
| ✅ Documento Registrado | TX1 completada |
| ✅ Documento Validado | TX2 completada |
| ✅ Ya tiene Badge | TX3 completada |

### Errores test:

1. **Sin marcar nada** → Error "Documento no registrado"
2. **Solo Registrado** → Error "Documento no validado"
3. **Todos marcados** → Botón deshabilitado "Badge ya creado"
4. **Registrado + Validado** → Botón activo, intenta mintear

> ⚠️ Esta página es solo para desarrollo. No aparece en producción.