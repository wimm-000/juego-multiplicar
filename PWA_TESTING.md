# PWA y Modo Offline - Guía de Testing

Esta guía explica cómo probar las funcionalidades de PWA y modo offline de Multiplicar App.

## Características PWA Implementadas

### ✅ Service Worker
- Cache de recursos estáticos (JS, CSS, imágenes)
- Cache de fuentes
- Estrategias de cache optimizadas:
  - **CacheFirst**: Fuentes de Google
  - **StaleWhileRevalidate**: Assets estáticos
  - **NetworkFirst**: API calls y páginas

### ✅ Manifest
- App instalable en dispositivos móviles y escritorio
- Iconos para diferentes tamaños (72px - 512px)
- Shortcuts para acceso rápido (Jugar, Estudiar, Perfil)
- Tema color: negro (#000000)
- Background: papel (#FFFEF2)

### ✅ Offline Fallback
- Página `/offline` personalizada
- Notificación automática de estado de conexión
- Indica funcionalidades disponibles offline

### ✅ Indicador de Estado
- Notificación visual cuando se pierde/recupera conexión
- Aparece en esquina superior derecha
- Auto-oculta después de 3 segundos (al reconectar)

## Cómo Probar el Modo Offline

### Método 1: Chrome DevTools (Recomendado)

1. **Iniciar la aplicación:**
   ```bash
   npm run build
   npm run start
   ```

2. **Abrir en navegador:**
   - http://localhost:3000

3. **Abrir Chrome DevTools:**
   - Presiona F12 o Cmd+Option+I (Mac)
   - Ve a la pestaña "Application"

4. **Verificar Service Worker:**
   - En el sidebar, click en "Service Workers"
   - Deberías ver el SW activo y running

5. **Activar modo offline:**
   - En la pestaña "Network"
   - Marca el checkbox "Offline"
   - Recarga la página (F5)

6. **Verificar funcionalidades:**
   - ✅ La app debe cargar desde cache
   - ✅ Debe aparecer notificación "SIN CONEXIÓN"
   - ✅ Navegación debe funcionar
   - ✅ Modo Estudiar debe funcionar
   - ✅ Modo Jugar debe funcionar (sin guardar stats)

### Método 2: Modo Avión (Dispositivo Real)

1. **Compilar y deployar:**
   ```bash
   npm run build
   # Deployar a servidor (Vercel, Netlify, etc.)
   ```

2. **Visitar la app en móvil:**
   - Abre la URL en el navegador móvil
   - Navega por la app (genera cache)

3. **Activar modo avión:**
   - Cierra el navegador
   - Activa modo avión
   - Abre el navegador y vuelve a la URL

4. **Verificar:**
   - La app debe cargar completamente
   - Todas las funcionalidades offline deben funcionar

### Método 3: Desconectar WiFi

Similar al método 2, pero desconectando WiFi en lugar de modo avión.

## Instalación de la PWA

### Desktop (Chrome/Edge)

1. Abre la app en el navegador
2. En la barra de direcciones, verás un ícono de instalación (+)
3. Click en "Instalar Multiplicar App"
4. La app se abrirá en su propia ventana

### Móvil (iOS Safari)

1. Abre la app en Safari
2. Toca el botón "Compartir" (cuadrado con flecha)
3. Scroll down y toca "Agregar a pantalla de inicio"
4. Confirma

### Móvil (Android Chrome)

1. Abre la app en Chrome
2. Toca el menú (3 puntos)
3. Toca "Instalar app" o "Agregar a pantalla de inicio"
4. Confirma

## Funcionalidades Disponibles Offline

### ✅ Totalmente Funcional Offline:

- **Modo Estudiar:**
  - Ver todas las tablas de multiplicar (1-10)
  - Navegar entre tablas
  - Diseño responsive

- **Modo Jugar:**
  - Configurar partida
  - Jugar con preguntas aleatorias
  - Teclado numérico (pantalla y físico)
  - Animaciones
  - Vidas y timer
  - Resultados
  - Repetir errores

- **Navegación:**
  - Home
  - Todas las rutas principales

### ❌ Requiere Conexión:

- **Autenticación:**
  - Login (necesita verificar contraseña en BD)
  - Logout

- **Estadísticas:**
  - Guardar partidas en base de datos
  - Ver perfil y historial
  - Resetear estadísticas

## Estrategias de Cache

### Cache First (fuentes)
```typescript
urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i
handler: 'CacheFirst'
expiration: 365 días
```

### Stale While Revalidate (assets estáticos)
```typescript
urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css)$/i
handler: 'StaleWhileRevalidate'
expiration: 7-24 horas
```

### Network First (API y páginas)
```typescript
urlPattern: /\/api\/.*$/i
handler: 'NetworkFirst'
networkTimeout: 10 segundos
fallback: cache
```

## Archivos Cacheados Automáticamente

- HTML de todas las páginas visitadas
- JavaScript bundles de Next.js
- CSS y estilos
- Iconos y imágenes
- Fuentes (Space Mono)
- Manifest

## Limpiar Cache (Development)

Si necesitas limpiar el cache durante desarrollo:

1. Chrome DevTools → Application → Storage
2. Click en "Clear site data"
3. Recarga la página

O desde consola:
```javascript
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

## Troubleshooting

### Service Worker no se registra

**Problema:** No aparece en DevTools

**Solución:**
```bash
# Asegurar que la app está compilada
npm run build
npm run start

# Verificar en: http://localhost:3000 (no http://localhost:3001)
```

### App no funciona offline

**Problema:** Error al cargar offline

**Soluciones:**
1. Visita todas las páginas en modo online primero (para generar cache)
2. Verifica que el SW esté activo en DevTools
3. Recarga con Shift+F5 para forzar actualización del SW

### Cambios no se reflejan

**Problema:** Código actualizado no se ve

**Solución:**
1. En DevTools → Application → Service Workers
2. Click en "Unregister"
3. Recarga la página
4. O marca "Update on reload"

## Testing Checklist

- [ ] Service Worker se registra correctamente
- [ ] Manifest es válido (sin errores en consola)
- [ ] Iconos cargan correctamente
- [ ] App es instalable
- [ ] Notificación de offline/online aparece
- [ ] Página /offline se muestra cuando falla red
- [ ] Modo Estudiar funciona offline
- [ ] Modo Jugar funciona offline
- [ ] Navegación funciona offline
- [ ] Al reconectar, notificación "CONECTADO" aparece
- [ ] Stats se guardan al reconectar (si estaban pendientes)

## Mejoras Futuras

- [ ] Sync API para guardar partidas pendientes al reconectar
- [ ] IndexedDB para guardar partidas localmente
- [ ] Notification API para recordatorios
- [ ] Background Sync para estadísticas pendientes
- [ ] Web Share API para compartir resultados

## Recursos

- [Next PWA Documentation](https://github.com/DuCanhGH/next-pwa)
- [Workbox Strategies](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
