# Esquema de Base de Datos

## Tablas

### 1. `usuarios`
Almacena los perfiles de usuario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Primary Key (auto-increment) |
| `nombre` | TEXT | Nombre de usuario (único) |
| `password` | TEXT | Contraseña hasheada con bcrypt (10 rounds) |
| `creado_en` | TIMESTAMP | Fecha de creación (Unix timestamp) |

**Datos iniciales:**
- Usuario: `sira` / Password: `sira` (ID: 1)
- **Nota:** La contraseña se almacena hasheada con bcrypt

---

### 2. `partidas`
Almacena el historial de partidas jugadas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Primary Key (auto-increment) |
| `usuario_id` | INTEGER | Foreign Key → usuarios.id |
| `fecha` | TIMESTAMP | Fecha de la partida |
| `tablas_seleccionadas` | TEXT | JSON con array de tablas: `[2,3,5]` |
| `total_preguntas` | INTEGER | Número total de preguntas |
| `aciertos` | INTEGER | Respuestas correctas |
| `fallos` | INTEGER | Respuestas incorrectas |
| `vidas_configuradas` | INTEGER | Vidas configuradas (null = ilimitadas) |
| `tiempo_segundos` | INTEGER | Tiempo total en segundos |
| `completada` | BOOLEAN | Si se completó la partida |
| `creado_en` | TIMESTAMP | Fecha de creación |

---

### 3. `respuestas`
Almacena cada respuesta individual de una partida.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Primary Key (auto-increment) |
| `partida_id` | INTEGER | Foreign Key → partidas.id |
| `multiplicando` | INTEGER | Primer número (ej: 6) |
| `multiplicador` | INTEGER | Segundo número (ej: 8) |
| `respuesta_correcta` | INTEGER | Resultado correcto (48) |
| `respuesta_usuario` | INTEGER | Lo que respondió el usuario |
| `es_correcto` | BOOLEAN | Si acertó o no |
| `intentos` | INTEGER | Número de intentos |
| `orden` | INTEGER | Orden en la secuencia de la partida |

---

## Relaciones

```
usuarios (1) ──< partidas (n)
partidas (1) ──< respuestas (n)
```

## Comandos útiles

```bash
# Ver schema actual
npm run db:studio

# Regenerar tablas (⚠️ borra datos)
npm run db:push

# Insertar usuario inicial
npm run db:seed
```
