import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public/images/logo.png");

// The full logo contains a wordmark that is illegible at favicon size. This
// crops the recognisable Foundation globe/people mark from that same artwork.
const croppedMark = await sharp(source)
  .extract({ left: 95, top: 0, width: 345, height: 345 })
  .png()
  .toBuffer();

const cleanedMark = await sharp(croppedMark)
  .composite([
    {
      input: {
        create: {
          width: 42,
          height: 55,
          channels: 3,
          background: "#ffffff",
        },
      },
      left: 0,
      top: 290,
    },
  ])
  .png()
  .toBuffer();

const mark = await sharp(cleanedMark)
  .resize(448, 448, { fit: "contain", background: "#ffffff" })
  .extend({
    top: 32,
    right: 32,
    bottom: 32,
    left: 32,
    background: "#ffffff",
  })
  .png()
  .toBuffer();

await mkdir(path.join(root, "public/images"), { recursive: true });

await Promise.all([
  writeFile(path.join(root, "app/icon.png"), mark),
  writeFile(path.join(root, "public/images/favicon.png"), mark),
  sharp(mark).resize(180, 180).png().toFile(path.join(root, "app/apple-icon.png")),
]);

const faviconSizes = [16, 32, 48, 256];
const faviconImages = await Promise.all(
  faviconSizes.map((size) => sharp(mark).resize(size, size).png().toBuffer()),
);

const headerSize = 6 + faviconImages.length * 16;
let imageOffset = headerSize;
const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(faviconImages.length, 4);

faviconImages.forEach((image, index) => {
  const size = faviconSizes[index];
  const entry = 6 + index * 16;
  header.writeUInt8(size === 256 ? 0 : size, entry);
  header.writeUInt8(size === 256 ? 0 : size, entry + 1);
  header.writeUInt8(0, entry + 2);
  header.writeUInt8(0, entry + 3);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(imageOffset, entry + 12);
  imageOffset += image.length;
});

await writeFile(
  path.join(root, "app/favicon.ico"),
  Buffer.concat([header, ...faviconImages]),
);
