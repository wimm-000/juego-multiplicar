# PWA Icons Generator

Los iconos para la PWA se pueden generar de las siguientes formas:

## Opción 1: Usar ImageMagick (Local)

```bash
# Instalar ImageMagick
brew install imagemagick  # macOS
# o
sudo apt install imagemagick  # Ubuntu/Debian

# Generar iconos
for size in 72 96 128 144 152 192 384 512; do
  convert public/icons/icon.svg -resize ${size}x${size} public/icons/icon-${size}x${size}.png
done
```

## Opción 2: Usar servicio online

1. Ve a https://realfavicongenerator.net/
2. Sube `public/icons/icon.svg`
3. Descarga el paquete de iconos
4. Extrae los archivos en `public/icons/`

## Opción 3: Usar Node.js (Sharp)

```bash
npm install sharp --save-dev
node scripts/generate-icons.js
```

## Iconos Necesarios

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Estado Actual

✅ SVG base creado: `public/icons/icon.svg`
✅ Favicon SVG creado: `public/favicon.svg`
⏳ PNG icons: Pendiente de generar

La aplicación funciona con el SVG como fallback, pero para mejor compatibilidad con dispositivos móviles, se recomiendan los PNG.
