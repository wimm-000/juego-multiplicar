# Multiplicar App

Aplicación web educativa para aprender las tablas de multiplicar de manera interactiva y gamificada.

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS (v3)
- **Animaciones**: GSAP
- **Base de datos**: SQLite + Drizzle ORM
- **Autenticación**: bcryptjs (10 rounds)
- **PWA**: @ducanh2912/next-pwa

## Diseño

Estilo **minimalista brutalista retro** con:
- Tipografía monospace (Space Mono)
- Bordes gruesos y sombras duras
- Paleta limitada (negro, blanco, papel, rojo, amarillo)
- Alto contraste

## Instalación y Configuración Inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos
```bash
# Crear la base de datos y aplicar el schema
npm run db:push

# Crear usuario inicial (sira/sira)
npm run db:seed
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### 4. Usuario de prueba
- **Usuario**: `sira`
- **Contraseña**: `sira`

## Scripts Disponibles

```bash
# Desarrollo
npm run dev         # Inicia servidor de desarrollo (puerto 3000)

# Build
npm run build       # Compila para producción
npm run start       # Inicia servidor de producción

# Base de datos
npm run db:push     # Sincronizar schema con DB
npm run db:studio   # Abrir Drizzle Studio (GUI para ver datos)
npm run db:seed     # Seed inicial (crea usuario sira/sira)

# Linting
npm run lint        # Ejecuta ESLint
```

## Estructura del Proyecto

```
multiplicar-app/
├── app/                   # App Router de Next.js
│   ├── (auth)/           # Grupo de rutas de autenticación
│   ├── (main)/           # Grupo de rutas principales
│   ├── layout.tsx        # Layout raíz
│   ├── page.tsx          # Página de inicio
│   └── globals.css       # Estilos globales
├── components/           # Componentes React
│   └── ui/              # Componentes UI reutilizables
├── lib/                 # Lógica de negocio
│   ├── db/             # Configuración de base de datos
│   ├── actions/        # Server Actions
│   ├── utils/          # Utilidades
│   └── types.ts        # Tipos TypeScript
├── public/             # Archivos estáticos
│   └── icons/         # Iconos para PWA
└── package.json
```

## Fases de Desarrollo

- [x] **FASE 1**: Setup Inicial
- [x] **FASE 2**: Base de Datos (3 tablas: usuarios, partidas, respuestas)
- [x] **FASE 3**: Autenticación con bcrypt
- [x] **FASE 4**: Home y Navegación
- [x] **FASE 5**: Módulo Estudiar (tablas 1-10)
- [x] **FASE 6**: Componentes Base del Juego
- [x] **FASE 7**: Configuración del Juego
- [x] **FASE 8**: Lógica de Partida
- [x] **FASE 9**: UI de Partida con animaciones GSAP
- [x] **FASE 10**: Persistencia de Datos (guardado múltiples intentos)
- [x] **FASE 11**: Pantalla de Resultados
- [x] **FASE 12**: Repetir Errores
- [x] **FASE 13**: Perfil y Estadísticas (con resetear)
- [ ] **FASE 14**: PWA Configuration
- [ ] **FASE 15**: Responsive y Optimización
- [ ] **FASE 16**: Testing y Refinamiento

## Estado Actual

**FASE 13 COMPLETADA** - Aplicación funcional con:

### Funcionalidades Implementadas

✅ **Autenticación**
- Login/Logout con cookies HTTP-only
- Contraseñas hasheadas con bcrypt (10 rounds)
- Middleware para protección de rutas
- Checkbox "Recuérdame" (sesión de 30 días)

✅ **Módulo Estudiar**
- Visualización de tablas del 1 al 10
- Diseño en 2 columnas
- Navegación entre tablas

✅ **Módulo Jugar**
- Configuración de partida (tablas, preguntas, vidas)
- Sistema de vidas opcional
- Teclado numérico interactivo
- Animaciones GSAP para feedback
- Timer en tiempo real
- **Sistema de múltiples intentos por pregunta**
- Guardado completo de todas las respuestas en BD

✅ **Resultados**
- Estadísticas detalladas (aciertos, fallos, tiempo)
- **Lista completa de todos los errores cometidos**
- Botón "Repetir Errores" para practicar preguntas falladas
- Feedback visual según porcentaje

✅ **Perfil y Estadísticas**
- Historial de últimas 10 partidas
- Estadísticas globales (partidas, porcentaje, tiempo total)
- Tabla más difícil calculada
- **Botón para resetear todas las estadísticas**
- Diálogo de confirmación con diseño brutalista

### Base de Datos

**Tablas:**
1. `usuarios` - Datos de usuarios con contraseñas hasheadas
2. `partidas` - Historial de partidas jugadas
3. `respuestas` - Todas las respuestas (incluye múltiples intentos por pregunta)

**Usuario de prueba:**
- Usuario: `sira`
- Contraseña: `sira`
- ID: 1

### Fixes Recientes

✅ Bug de conteo de errores corregido:
- Ahora se guardan TODOS los intentos (no solo el último)
- La página de resultados muestra cada error individual
- Las estadísticas cuentan correctamente todos los fallos

## Próximas Funcionalidades

- Soporte para teclado físico (0-9, Backspace, Enter)
- Configuración PWA completa para uso offline
- Más modos de juego (contra reloj, modo perfecto, etc.)
- Mejoras de accesibilidad

## Desarrollo

El servidor de desarrollo corre en [http://localhost:3000](http://localhost:3000)
