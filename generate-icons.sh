#!/bin/bash

# Script para generar iconos PWA simples usando ImageMagick
# Si no tienes ImageMagick, los iconos se pueden crear manualmente

# Colores
BG_COLOR="#FFFEF2"  # papel
TEXT_COLOR="#000000" # negro

# Crear SVG base
cat > /tmp/icon-base.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#FFFEF2"/>
  <rect x="8" y="8" width="496" height="496" fill="none" stroke="#000000" stroke-width="8"/>
  <text x="256" y="320" font-family="monospace" font-size="240" font-weight="bold" text-anchor="middle" fill="#000000">×</text>
</svg>
EOF

# Tamaños necesarios
SIZES=(72 96 128 144 152 192 384 512)

# Si tienes ImageMagick instalado, descomentar:
# for size in "${SIZES[@]}"; do
#   convert /tmp/icon-base.svg -resize ${size}x${size} public/icons/icon-${size}x${size}.png
#   echo "Created icon-${size}x${size}.png"
# done

echo "SVG base creado en /tmp/icon-base.svg"
echo "Para generar los PNG, necesitas ImageMagick:"
echo "  brew install imagemagick  # en macOS"
echo "  sudo apt install imagemagick  # en Ubuntu/Debian"
echo ""
echo "O puedes usar un servicio online como:"
echo "  https://realfavicongenerator.net/"
echo "  https://www.favicon-generator.org/"
