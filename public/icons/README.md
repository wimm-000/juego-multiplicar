# PWA Icons

## Diseño Brutalista

Los iconos siguen el estilo brutalista de la aplicación:
- Fondo color papel (#FFFEF2)
- Borde negro grueso
- Símbolo de multiplicación (×) prominente
- Detalle "1-10" indicando las tablas

## Generar Iconos

Los iconos PNG se generan automáticamente desde el SVG base usando Sharp (incluido con Next.js).

### Regenerar iconos:

```bash
npm run icons:generate
```

o

```bash
./generate-icons.sh
```

### Personalizar diseño:

1. Edita `public/icons/icon.svg`
2. Ejecuta `npm run icons:generate`
3. Los PNG se actualizarán automáticamente

## Iconos Generados

- ✅ icon-72x72.png (972 bytes)
- ✅ icon-96x96.png (1.3 KB)
- ✅ icon-128x128.png (1.8 KB)
- ✅ icon-144x144.png (2.0 KB)
- ✅ icon-152x152.png (2.2 KB)
- ✅ icon-192x192.png (2.7 KB)
- ✅ icon-384x384.png (6.8 KB)
- ✅ icon-512x512.png (10 KB)

## Archivos

- `icon.svg` - Icono base (512x512)
- `icon-{size}x{size}.png` - Iconos en diferentes tamaños
- `/public/favicon.svg` - Favicon del navegador

## Script de Generación

El script `scripts/generate-icons.js` usa Sharp para convertir el SVG a PNG en todos los tamaños necesarios para PWA.

