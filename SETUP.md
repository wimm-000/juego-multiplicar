# Setup Rápido - Multiplicar App

Guía rápida para configurar el proyecto desde cero.

## Requisitos Previos

- Node.js 18+ instalado
- npm o yarn

## Instalación Paso a Paso

### 1. Clonar repositorio (si aplica)
```bash
git clone <repository-url>
cd multiplicar-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar base de datos
```bash
# Crear la base de datos SQLite y aplicar el schema
npm run db:push

# Crear usuario de prueba (sira/sira)
npm run db:seed
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Login
- **Usuario**: `sira`
- **Contraseña**: `sira`

## Comandos Útiles

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

### Base de Datos
```bash
npm run db:push      # Sincronizar schema
npm run db:studio    # Abrir Drizzle Studio (GUI)
npm run db:seed      # Re-crear usuario sira/sira
```

## Verificar Instalación

1. **Página de login**: http://localhost:3000/login
2. **Login con**: sira / sira
3. **Deberías ver**: Pantalla principal con botones ESTUDIAR, JUGAR, PERFIL

## Estructura de la Base de Datos

La aplicación crea automáticamente un archivo `sqlite.db` con 3 tablas:

- `usuarios` - Usuarios con contraseñas hasheadas (bcrypt)
- `partidas` - Historial de partidas jugadas
- `respuestas` - Respuestas individuales (incluye múltiples intentos)

## Fixtures Incluidas

El seed (`npm run db:seed`) crea:

- **Usuario**: sira
- **Contraseña**: sira (hasheada con bcrypt)
- **ID**: 1

## Resetear Todo

Si necesitas empezar desde cero:

```bash
# Eliminar base de datos
rm sqlite.db

# Re-crear base de datos y usuario
npm run db:push
npm run db:seed

# Reiniciar servidor
npm run dev
```

## Problemas Comunes

### Error: "no such table: usuarios"
```bash
npm run db:push
```

### No puedo hacer login
```bash
npm run db:seed
# Usuario: sira, Contraseña: sira
```

### Puerto 3000 en uso
El servidor usa automáticamente el puerto 3001 si el 3000 está ocupado.

## Ver Datos en la Base de Datos

```bash
npm run db:studio
```

Se abre una interfaz web en http://localhost:4983 para ver/editar datos.

## Stack Tecnológico

- Next.js 16 (Turbopack)
- TypeScript
- Tailwind CSS
- GSAP (animaciones)
- SQLite + Drizzle ORM
- bcryptjs (autenticación)

## Documentación Adicional

- `README.md` - Documentación completa del proyecto
- `DB_SCHEMA.md` - Esquema de base de datos
- `BCRYPT_IMPLEMENTATION.md` - Detalles de autenticación
