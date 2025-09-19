// import { NextResponse } from "next/server";
// import { createCanvas } from "@napi-rs/canvas";

// export async function GET() {
//   // Create canvas with transparent background
//   const size = 512;
//   const canvas = createCanvas(size, size);
//   const ctx = canvas.getContext("2d");

//   // Clear with transparency
//   ctx.clearRect(0, 0, size, size);

//   // Draw white kolam
//   ctx.strokeStyle = "white";  // Kolam line color
//   ctx.lineWidth = 3;

//   ctx.beginPath();
//   ctx.arc(size / 2, size / 2, 200, 0, 2 * Math.PI); // simple circle kolam
//   ctx.stroke();

//   // Export as transparent PNG
//   const buffer = canvas.toBuffer("image/png");
//   return new NextResponse(new Uint8Array(buffer), {
//   headers: {
//     "Content-Type": "image/png",
//     "Content-Disposition": "inline; filename=kolam.png",
//   },
// });
// }


import { NextResponse } from "next/server";
import * as PImage from "pureimage";
import { Writable } from "stream";

export async function GET() {
  const size = 512;

  // Create canvas
  const img = PImage.make(size, size);
  const ctx = img.getContext("2d");

  // Clear with transparency
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, size, size);

  // Draw white kolam (simple circle)
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.beginPath();
  const center = size / 2;
  ctx.arc(center, center, 200, 0, Math.PI * 2);
  ctx.stroke();

  // Convert stream to buffer
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const writable = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      },
    });
    PImage.encodePNGToStream(img, writable).then(() => {
      resolve(Buffer.concat(chunks));
    }).catch(reject);
  });

  // Return PNG response
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": "inline; filename=kolam.png",
    },
  });
}


