const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconSvgPath = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  console.log('🎨 Generando iconos PWA...\n');

  // Verificar que existe el SVG base
  if (!fs.existsSync(iconSvgPath)) {
    console.error('❌ No se encontró el archivo icon.svg');
    process.exit(1);
  }

  // Leer el SVG
  const svgBuffer = fs.readFileSync(iconSvgPath);

  // Generar cada tamaño
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Creado: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error generando icon-${size}x${size}.png:`, error.message);
    }
  }

  console.log('\n🎉 ¡Iconos generados exitosamente!');
  console.log('📁 Ubicación: public/icons/');
}

generateIcons().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
