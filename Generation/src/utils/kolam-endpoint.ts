// import type { NextApiRequest, NextApiResponse } from "next";
// import sharp from "sharp";

// // Import your generator functions
// import { generateKolam1D } from "@/lib/kolamGenerator"; // adjust path
// import { generateKolamSVG } from "@/utils/kolamSVG";   // adjust path

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     // Parse query params (e.g., size=7)
//     const size = parseInt((req.query.size as string) || "7", 10);

//     // 1. Generate a Kolam pattern
//     const pattern = generateKolam1D(size);

//     // 2. Turn into SVG string
//     const svgString = generateKolamSVG(pattern, { background: "none" });

//     // 3. Convert SVG → PNG (transparent) using sharp
//     const pngBuffer = await sharp(Buffer.from(svgString))
//       .png()
//       .toBuffer();

//     // 4. Send back PNG
//     res.setHeader("Content-Type", "image/png");
//     res.setHeader("Content-Disposition", "inline; filename=kolam.png");
//     res.status(200).send(pngBuffer);

//   } catch (err: any) {
//     console.error("Error generating Kolam:", err);
//     res.status(500).json({ error: "Failed to generate Kolam" });
//   }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

// Correct imports
import { generateKolam1D } from "../../lib/kolamGenerator";
import { generateKolamSVG } from "../../utils/svgGenerator";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const size = parseInt((req.query.size as string) || "7", 10);
    const pattern = generateKolam1D(size);
    const svgString = generateKolamSVG(pattern, { background: "none" });

    const pngBuffer = await sharp(Buffer.from(svgString)).png().toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", "inline; filename=kolam.png");
    res.status(200).send(pngBuffer);

  } catch (err: any) {
    console.error("Error generating Kolam:", err);
    res.status(500).json({ error: "Failed to generate Kolam" });
  }
}
