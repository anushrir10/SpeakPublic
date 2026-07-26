const { createCanvas } = require('canvas');
const fs = require('fs');

const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#3C3489';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', size / 2, size / 2);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`extension/icons/icon${size}.png`, buffer);
  console.log(`Created icon${size}.png`);
});
