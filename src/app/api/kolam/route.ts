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


// import { NextResponse } from "next/server";
// import * as PImage from "pureimage";
// import { Writable } from "stream";

// export async function GET() {
//   const size = 512;

//   // Create canvas
//   const img = PImage.make(size, size);
//   const ctx = img.getContext("2d");

//   // Clear with transparency
//   ctx.fillStyle = "rgba(0,0,0,0)";
//   ctx.fillRect(0, 0, size, size);

//   // Draw white kolam (simple circle)
//   ctx.strokeStyle = "white";
//   ctx.lineWidth = 3;
//   ctx.beginPath();
//   const center = size / 2;
//   ctx.arc(center, center, 200, 0, Math.PI * 2);
//   ctx.stroke();

//   // Convert stream to buffer
//   const buffer = await new Promise<Buffer>((resolve, reject) => {
//     const chunks: Buffer[] = [];
//     const writable = new Writable({
//       write(chunk, _encoding, callback) {
//         chunks.push(Buffer.from(chunk));
//         callback();
//       },
//     });
//     PImage.encodePNGToStream(img, writable).then(() => {
//       resolve(Buffer.concat(chunks));
//     }).catch(reject);
//   });

//   // Return PNG response
//   return new NextResponse(buffer, {
//     headers: {
//       "Content-Type": "image/png",
//       "Content-Disposition": "inline; filename=kolam.png",
//     },
//   });
// }


// import { NextResponse } from "next/server";
// import sharp from "sharp";

// // ⬅️ Import your generator from where you have it
// import { generateKolamSVG } from "@/lib/kolamGenerator";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const size = parseInt(searchParams.get("size") || "512", 10);

//     // 🔹 Generate Kolam as SVG (using your existing generator)
//     const svg = generateKolamSVG(
//       {
//         dimensions: { width: size, height: size },
//         dots: [],       // or pass your real dots
//         curves: [],     // or pass real curves
//       },
//       {
//         background: "none",  // transparent background
//         brush: "white",      // stroke color
//         padding: 20,
//       }
//     );

//     // 🔹 Convert SVG → PNG (transparent background preserved)
//     const pngBuffer = await sharp(Buffer.from(svg))
//       .png()
//       .toBuffer();

//     // 🔹 Return PNG response
//     return new NextResponse(pngBuffer, {
//       headers: {
//         "Content-Type": "image/png",
//         "Content-Disposition": "inline; filename=kolam.png",
//         "Cache-Control": "public, max-age=3600",
//       },
//     });
//   } catch (err: any) {
//     console.error("❌ Kolam API Error:", err);
//     return new NextResponse(
//       JSON.stringify({ error: "Failed to generate kolam image" }),
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import sharp from "sharp";
// import { generateKolamSVG } from "../../../utils/kolamSVG";  // adjust relative path

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const size = parseInt(searchParams.get("size") || "512", 10);

//     const svg = generateKolamSVG(
//       {
//         dimensions: { width: size, height: size },
//         dots: [],
//         curves: [],
//       },
//       {
//         background: "none",
//         brush: "white",
//         padding: 20,
//       }
//     );

//     const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

//     return new NextResponse(pngBuffer, {
//       headers: {
//         "Content-Type": "image/png",
//         "Content-Disposition": "inline; filename=kolam.png",
//         "Cache-Control": "public, max-age=3600",
//       },
//     });
//   } catch (err: any) {
//     console.error("❌ Kolam API Error:", err);
//     return new NextResponse(JSON.stringify({ error: "Failed to generate kolam image" }), {
//       status: 500,
//     });
//   }
// }


// import { NextResponse } from "next/server";
// import sharp from "sharp";
// import { generateKolamSVG } from "@/utils/kolamSVG"; // use alias

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const size = parseInt(searchParams.get("size") || "512", 10);

//     const svg = generateKolamSVG(
//       {
//         dimensions: { width: size, height: size },
//         dots: [],
//         curves: [],
//       },
//       {
//         background: "none",
//         brush: "white",
//         padding: 20,
//       }
//     );

//     const pngBuffer = await sharp(Buffer.from(svg), { density: 300 })
//       .png()
//       .toBuffer();

//     return new NextResponse(pngBuffer, {
//       headers: {
//         "Content-Type": "image/png",
//         "Content-Disposition": "inline; filename=kolam.png",
//         "Cache-Control": "public, max-age=3600",
//       },
//     });
//   } catch (err: any) {
//     console.error("❌ Kolam API Error:", err);
//     return new NextResponse(JSON.stringify({ error: "Failed to generate kolam image" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }


// src/app/api/kolam/route.ts
// import { NextResponse } from 'next/server';
// import sharp from 'sharp';
// import { generateKolam1D } from '@/utils/kolamGenerator';
// import { generateKolamSVG } from '@/utils/svgGenerator';

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const size = parseInt(searchParams.get('size') || '512', 10);

//     const pattern = generateKolam1D(size);
//     const svgString = generateKolamSVG(pattern, {
//       background: 'none',
//       brush: '#ffffff',
//       padding: 20,
//     });

//     const pngBuffer = await sharp(Buffer.from(svgString, 'utf-8'))
//       .png()
//       .toBuffer();

//     return new NextResponse(pngBuffer, {
//       headers: {
//         'Content-Type': 'image/png',
//         'Content-Disposition': 'inline; filename=kolam.png',
//         'Cache-Control': 'public, max-age=3600',
//       },
//     });
//   } catch (err: any) {
//     console.error('❌ Kolam API Error:', err);
//     return new NextResponse(
//       JSON.stringify({ error: 'Failed to generate Kolam image' }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { generateKolam1D } from '../../../utils/kolamGenerator';
import { generateKolamSVG } from '../../../utils/svgGenerator';

/**
 * Example URL:
 * http://localhost:3000/api/generateKolams?size=512&type=1d
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const size = parseInt(searchParams.get('size') || '512', 10);
    const type = searchParams.get('type') || '1d'; // pattern type (e.g. 1d, star, diamond, lotus, etc.)

    // ✅ Select pattern generator by type
    let pattern;
    switch (type) {
      case '1d':
        pattern = generateKolam1D(size);
        break;

      // You can later add:
      // case 'star': pattern = generateStarKolam(size); break;
      // case 'diamond': pattern = generateDiamondKolam(size); break;
      default:
        pattern = generateKolam1D(size);
    }

    const svgString = generateKolamSVG(pattern, {
      background: 'none',
      brush: '#ffffff',
      padding: 20,
    });

    const pngBuffer = await sharp(Buffer.from(svgString))
      .png()
      .toBuffer();

    return new NextResponse(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename=kolam.png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: any) {
    console.error('❌ Kolam API Error:', err);
    return NextResponse.json(
      { error: 'Failed to generate Kolam image' },
      { status: 500 }
    );
  }
}
