# Implementación de bcrypt para Contraseñas

## 🔐 Resumen

Se ha implementado **bcryptjs** para el hash seguro de contraseñas en la aplicación.

---

## 📦 Dependencias Instaladas

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

**Versión:** bcryptjs (JavaScript puro, compatible con todos los entornos)

---

## 🏗️ Archivos Modificados/Creados

### 1. **lib/utils/password.ts** (NUEVO)
Funciones de utilidad para manejo de contraseñas:

```typescript
export async function hashPassword(password: string): Promise<string>
export async function verifyPassword(password: string, hash: string): Promise<boolean>
```

**Características:**
- Salt rounds: 10 (balance entre seguridad y performance)
- Hash bcrypt estándar (formato: `$2b$10$...`)
- Funciones async para no bloquear el event loop

---

### 2. **lib/actions/auth.ts** (MODIFICADO)
Server Action actualizado para usar bcrypt:

```typescript
// ANTES:
if (usuario[0].password !== password) {
  return { error: 'Contraseña incorrecta' };
}

// DESPUÉS:
const passwordMatch = await bcrypt.compare(password, usuario[0].password);
if (!passwordMatch) {
  return { error: 'Contraseña incorrecta' };
}
```

---

### 3. **lib/db/seed.ts** (MODIFICADO)
Seed actualizado para hashear contraseñas:

```typescript
import { hashPassword } from '../utils/password';

const hashedPassword = await hashPassword('sira');

await db.insert(usuarios).values({
  nombre: 'sira',
  password: hashedPassword, // Hash en vez de texto plano
});
```

**Output del seed:**
```
🔒 Hasheando contraseña con bcrypt...
✅ Usuario inicial creado:
   - ID: 1
   - Nombre: sira
   - Password: [HASHEADO] $2b$10$KVJ9tYE4a60pf...
```

---

## 🔒 Características de Seguridad

### Hash bcrypt
- **Algoritmo:** bcrypt (Blowfish cipher)
- **Salt rounds:** 10 (2^10 = 1,024 iteraciones)
- **Longitud del hash:** 60 caracteres
- **Formato:** `$2b$10$[22 chars salt][31 chars hash]`

### Ventajas sobre texto plano
✅ **Resistente a rainbow tables**
✅ **Slow by design** (dificulta ataques de fuerza bruta)
✅ **Salt único** por contraseña
✅ **Adaptive** (se puede incrementar rounds con el tiempo)

### Ejemplo de hash
```
Contraseña: sira
Hash: $2b$10$KVJ9tYE4a60pf7i.Z3M9w.jFx3GGhzKg8IcuXaiXAlXeDdS0yDlYa
       ^   ^  ^                       ^
       |   |  |                       |
    Versión |  Salt (22 chars)       Hash (31 chars)
         Rounds
```

---

## 🧪 Verificación

### Script de verificación utilizado:
```typescript
import bcrypt from 'bcryptjs';

// Verificar formato
const isValid = hash.startsWith('$2b$') || hash.startsWith('$2a$');

// Verificar contraseña
const matches = await bcrypt.compare('sira', hash);
```

### Resultados:
```
✓ Hash bcrypt válido en BD
✓ Longitud: 60 caracteres
✓ Formato correcto: $2b$10$...
✓ Contraseña "sira" coincide correctamente
```

---

## 📊 Performance

### Tiempo de hash (10 rounds):
- **~100-150ms** por contraseña
- Aceptable para autenticación (no se nota por el usuario)
- No bloquea el servidor (operación async)

### Comparación de rounds:
| Rounds | Tiempo aprox. | Seguridad |
|--------|---------------|-----------|
| 8      | ~40ms         | Básica    |
| **10** | **~100ms**    | **Buena ✓**|
| 12     | ~400ms        | Muy buena |
| 15     | ~3s           | Excelente |

**Selección:** 10 rounds es el estándar recomendado (OWASP)

---

## 🚀 Uso en la Aplicación

### Para hashear nueva contraseña:
```typescript
import { hashPassword } from '@/lib/utils/password';

const hash = await hashPassword('mi_contraseña');
// Guardar hash en BD
```

### Para verificar contraseña:
```typescript
import { verifyPassword } from '@/lib/utils/password';

const isValid = await verifyPassword('mi_contraseña', hashFromDB);
if (isValid) {
  // Login exitoso
}
```

---

## 🔄 Migración Realizada

1. ✅ Eliminada base de datos antigua (contraseñas en texto plano)
2. ✅ Recreada estructura con `npm run db:push`
3. ✅ Ejecutado seed con contraseñas hasheadas
4. ✅ Verificado funcionamiento del login

---

## ✅ Checklist de Seguridad

- [x] Contraseñas hasheadas con bcrypt
- [x] Salt único por contraseña
- [x] 10 rounds (OWASP recommendation)
- [x] Nunca se almacena texto plano
- [x] bcrypt.compare() para verificación
- [x] Funciona en login real
- [x] Build exitoso
- [x] Sin errores de TypeScript

---

## 📝 Notas Importantes

⚠️ **Las contraseñas NUNCA se deben:**
- Enviar por email
- Loggear en consola
- Mostrar en respuestas API
- Almacenar sin hashear

✅ **Las contraseñas SIEMPRE:**
- Se hashean antes de guardar
- Se verifican con bcrypt.compare()
- Se transmiten por HTTPS en producción
- Se validan en el servidor (nunca solo en cliente)

---

## 🎯 Estado Final

**Usuario de prueba:**
- Nombre: `sira`
- Contraseña: `sira` (en texto plano al ingresar)
- Hash en BD: `$2b$10$KVJ9tYE4a60pf7i.Z3M9w.jFx3GGhzKg8IcuXaiXAlXeDdS0yDlYa`

**Autenticación:**
```
Usuario ingresa → "sira" / "sira"
       ↓
Server Action recibe texto plano
       ↓
bcrypt.compare(texto_plano, hash_bd)
       ↓
Si coincide → Crear sesión
Si no → Error "Contraseña incorrecta"
```

---

## 🔜 Futuras Mejoras

- [ ] Rate limiting en login (prevenir fuerza bruta)
- [ ] Bloqueo temporal tras N intentos fallidos
- [ ] Verificación de fortaleza de contraseña en registro
- [ ] Política de cambio de contraseña
- [ ] 2FA (Two-Factor Authentication)

---

**Implementación completada:** ✅
**Fecha:** 27/12/2025
**Versión:** bcryptjs ^2.4.3
