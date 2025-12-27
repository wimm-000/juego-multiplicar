#!/bin/bash

# Script para generar iconos PWA usando Node.js + Sharp
# Sharp ya está instalado como dependencia de Next.js

echo "🎨 Generando iconos PWA..."
echo ""
echo "Ejecutando: npm run icons:generate"
echo ""

npm run icons:generate

echo ""
echo "✅ Para regenerar los iconos en el futuro, ejecuta:"
echo "   npm run icons:generate"
echo ""
echo "📝 Para personalizar el diseño, edita:"
echo "   public/icons/icon.svg"

