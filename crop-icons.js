const sharp = require('sharp');
const fs = require('fs');

async function processIcons() {
  const inputPath = 'public/bohenixx.png';
  
  // Create a 512x512 circle mask
  const circleSvg = `<svg width="512" height="512">
    <circle cx="256" cy="256" r="256" fill="white" />
  </svg>`;
  const circleMask = Buffer.from(circleSvg);

  // Read original
  const image = sharp(inputPath);
  
  // 1. icon-512x512.png (Transparent Circle)
  await image
    .resize(512, 512)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toFile('public/icon-512x512.png');
    
  // 2. icon-192x192.png (Transparent Circle)
  const circleSvg192 = `<svg width="192" height="192"><circle cx="96" cy="96" r="96" fill="white" /></svg>`;
  await image
    .resize(192, 192)
    .composite([{ input: Buffer.from(circleSvg192), blend: 'dest-in' }])
    .png()
    .toFile('public/icon-192x192.png');
    
  // 3. apple-touch-icon.png (Solid dark background with circular logo, or just keep as square so iOS rounds it natively)
  // If we leave it as a square, iOS will apply a squircle mask (which is "like a real app icon" for iOS).
  // But if the user really wants a CIRCLE on iOS, we have to composite the circle onto a dark background.
  // Let's just make it a circle on a transparent background for now? No, iOS will make transparency black.
  // Since the bohenixx background is probably dark anyway, let's just use the transparent circle. The black corners will match the dark background.
  const circleSvg180 = `<svg width="180" height="180"><circle cx="90" cy="90" r="90" fill="white" /></svg>`;
  await image
    .resize(180, 180)
    .composite([{ input: Buffer.from(circleSvg180), blend: 'dest-in' }])
    .png()
    .toFile('public/apple-touch-icon.png');
    
  // Also create a maskable icon just in case
  await image
    .resize(512, 512)
    .png()
    .toFile('public/icon-maskable.png');
    
  console.log('Icons cropped to circles successfully!');
}

processIcons().catch(console.error);
