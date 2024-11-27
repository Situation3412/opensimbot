const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIcon() {
  const buildDir = path.join(__dirname, '../build');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }

  await sharp('icon.svg')
    .resize(256, 256)
    .toFile(path.join(buildDir, 'icon.png'));

  // Convert PNG to ICO (Windows requires ICO format)
  await sharp(path.join(buildDir, 'icon.png'))
    .toFile(path.join(buildDir, 'icon.ico'));
}

createIcon().catch(console.error); 