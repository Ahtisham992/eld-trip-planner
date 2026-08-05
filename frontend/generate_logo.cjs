const sharp = require('sharp');
const fs = require('fs');

const svgCode = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Hexagon Base -->
  <polygon points="256,32 464,152 464,360 256,480 48,360 48,152" fill="none" stroke="url(#grad1)" stroke-width="32" stroke-linejoin="round" />
  
  <!-- Inner Route Nodes -->
  <circle cx="160" cy="256" r="32" fill="url(#grad2)" />
  <circle cx="352" cy="160" r="32" fill="url(#grad2)" />
  <circle cx="352" cy="352" r="32" fill="url(#grad2)" />

  <!-- Connecting Lines -->
  <path d="M 160 256 L 352 160" stroke="url(#grad1)" stroke-width="24" stroke-linecap="round" fill="none" />
  <path d="M 160 256 L 352 352" stroke="url(#grad1)" stroke-width="24" stroke-linecap="round" fill="none" />
</svg>
`;

async function convert() {
  try {
    const buffer = Buffer.from(svgCode);
    
    // Main Logo
    await sharp(buffer)
      .png()
      .toFile('./public/logo.png');
    console.log('Saved logo.png');

    // Favicon (smaller)
    await sharp(buffer)
      .resize(64, 64)
      .png()
      .toFile('./public/favicon.png');
    console.log('Saved favicon.png');
    
  } catch (err) {
    console.error(err);
  }
}

convert();
