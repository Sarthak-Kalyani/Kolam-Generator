// import { CurvePoint, KolamPattern, Point } from '@/types/kolam';
// import { generateSVGPath } from '@/utils/svgPathGenerator';

// export interface SVGOptions {
// 	background?: string;
// 	brush?: string;
// 	padding?: number;
// }

// export function generateKolamSVG(pattern: KolamPattern, options: SVGOptions = {}): string {
// 	const {
// 		background = '#fef3c7',
// 		brush = '#92400e',
// 		padding = 40,
// 	} = options;

// 	const { dimensions, dots, curves } = pattern;

// 	// Generate SVG content
// 	let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
// <svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; background-color: ${background};">
// 	<defs>
// 		<style>
// 			.kolam-curve {
// 				fill: none;
// 				stroke: ${brush};
// 				stroke-width: 3;
// 				stroke-linecap: round;
// 				stroke-linejoin: round;
// 			}
// 			.kolam-dot {
// 				fill: ${brush};
// 			}
// 		</style>
// 	</defs>`;

// 	// Add dots
// 	dots.forEach(dot => {
// 		svgContent += `
// 		<circle class="kolam-dot"
// 			cx="${dot.center.x}" 
// 			cy="${dot.center.y}" 
// 			r="${dot.radius || 3}" 
// 			fill="${brush}" 
// 			stroke="${brush}" 
// 			stroke-width="1"/>`;
// 	});

// 	// Add curves
// 	curves.forEach((curve) => {
// 		if (curve.curvePoints && curve.curvePoints.length > 1) {
// 			// Render as smooth SVG path
// 			const pathData = generateSVGPath(curve.curvePoints);
// 			svgContent += `
// 		<path class="kolam-curve" d="${pathData}"/>`;
// 		} else {
// 			// Handle simple lines (fallback)
// 			svgContent += `
// 		<line class="kolam-curve" x1="${curve.start.x}" y1="${curve.start.y}" x2="${curve.end.x}" y2="${curve.end.y}"/>`;
// 		}
// 	});

// 	svgContent += `
// </svg>`;

// 	return svgContent;
// }

// src/utils/svgGenerator.ts




// import { CurvePoint, KolamPattern, Point } from '@/types/kolam';
// import { generateSVGPath } from '@/utils/svgPathGenerator';

// export interface SVGOptions {
//     background?: string;
//     brush?: string;
//     padding?: number;
// }

// export function generateKolamSVG(pattern: KolamPattern, options: SVGOptions = {}): string {
//     const {
//         background = 'none',  // No background color - transparent
//         brush = '#92400e',    // Visible dark brush color
//         padding = 40,
//     } = options;

//     const { dimensions, dots, curves } = pattern;

//     // Start generating SVG content with transparent background
//     let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
// <svg width="${dimensions.width}" height="${dimensions.height}"
//     viewBox="0 0 ${dimensions.width} ${dimensions.height}"
//     xmlns="http://www.w3.org/2000/svg"
//     style="max-width: 100%; height: auto; background: ${background};">

//     <defs>
//         <style>
//             .kolam-curve {
//                 fill: none;
//                 stroke: ${brush};
//                 stroke-width: 3;
//                 stroke-linecap: round;
//                 stroke-linejoin: round;
//             }
//             .kolam-dot {
//                 fill: ${brush};
//             }
//         </style>
//     </defs>`;

//     // Add dot circles
//     dots.forEach(dot => {
//         svgContent += `
//         <circle class="kolam-dot"
//             cx="${dot.center.x}"
//             cy="${dot.center.y}"
//             r="${dot.radius || 3}"
//         />`;
//     });

//     // Add curves paths or lines
//     curves.forEach(curve => {
//         if (curve.curvePoints && curve.curvePoints.length > 1) {
//             const pathData = generateSVGPath(curve.curvePoints);
//             svgContent += `
//             <path class="kolam-curve" d="${pathData}" />`;
//         } else {
//             svgContent += `
//             <line class="kolam-curve"
//                 x1="${curve.start.x}" y1="${curve.start.y}"
//                 x2="${curve.end.x}" y2="${curve.end.y}"
//             />`;
//         }
//     });

//     svgContent += `
// </svg>`;

//     return svgContent;
// }


// import { NextApiRequest, NextApiResponse } from 'next';
// import sharp from 'sharp';

// import { generateKolam1D } from 'utils/kolamGenerator';

// import { CurvePoint, KolamPattern } from '@/types/kolam';
// import { generateSVGPath } from '@/utils/svgPathGenerator';

// export interface SVGOptions {
//     background?: string;
//     brush?: string;
//     padding?: number;
// }

// export function generateKolamSVG(pattern: KolamPattern, options: SVGOptions = {}): string {
//     const {
//         background = 'none',
//         brush = '#92400e',
//         padding = 40,
//     } = options;

//     const { dimensions, dots, curves } = pattern;

//     let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
// <svg width="${dimensions.width}" height="${dimensions.height}"
//     viewBox="0 0 ${dimensions.width} ${dimensions.height}"
//     xmlns="http://www.w3.org/2000/svg"
//     style="max-width: 100%; height: auto; background: ${background};">

//     <defs>
//         <style>
//             .kolam-curve {
//                 fill: none;
//                 stroke: ${brush};
//                 stroke-width: 3;
//                 stroke-linecap: round;
//                 stroke-linejoin: round;
//             }
//             .kolam-dot {
//                 fill: ${brush};
//             }
//         </style>
//     </defs>`;

//     dots.forEach(dot => {
//         svgContent += `
//         <circle class="kolam-dot"
//             cx="${dot.center.x}"
//             cy="${dot.center.y}"
//             r="${dot.radius || 3}"
//         />`;
//     });

//     curves.forEach(curve => {
//         if (curve.curvePoints && curve.curvePoints.length > 1) {
//             const pathData = generateSVGPath(curve.curvePoints);
//             svgContent += `
//             <path class="kolam-curve" d="${pathData}" />`;
//         } else {
//             svgContent += `
//             <line class="kolam-curve"
//                 x1="${curve.start.x}" y1="${curve.start.y}"
//                 x2="${curve.end.x}" y2="${curve.end.y}"
//             />`;
//         }
//     });

//     svgContent += `</svg>`;

//     return svgContent;
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const size = parseInt((req.query.size as string) || "7", 10);
//     const pattern = generateKolam1D(size);
//     const svgString = generateKolamSVG(pattern, { background: "none" });

//     const pngBuffer = await sharp(Buffer.from(svgString)).png().toBuffer();

//     res.setHeader("Content-Type", "image/png");
//     res.setHeader("Content-Disposition", "inline; filename=kolam.png");
//     res.status(200).send(pngBuffer);

//   } catch (err: any) {
//     console.error("Error generating Kolam:", err);
//     res.status(500).json({ error: "Failed to generate Kolam" });
//   }
// }


// src/utils/svgGenerator.ts
import { CurvePoint, KolamPattern } from '@/types/kolam';
import { generateSVGPath } from '@/utils/svgPathGenerator';

export interface SVGOptions {
  background?: string;
  brush?: string;
  padding?: number;
}

export function generateKolamSVG(pattern: KolamPattern, options: SVGOptions = {}): string {
  const {
    background = 'none',
    brush = '#92400e',
    padding = 40,
  } = options;

  const { dimensions, dots, curves } = pattern;

  let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${dimensions.width}" height="${dimensions.height}"
    viewBox="0 0 ${dimensions.width} ${dimensions.height}"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width: 100%; height: auto; background: ${background};">

    <defs>
        <style>
            .kolam-curve {
                fill: none;
                stroke: ${brush};
                stroke-width: 3;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            .kolam-dot {
                fill: ${brush};
            }
        </style>
    </defs>`;

  dots.forEach(dot => {
    svgContent += `
        <circle class="kolam-dot"
            cx="${dot.center.x}"
            cy="${dot.center.y}"
            r="${dot.radius || 3}"
        />`;
  });

  curves.forEach(curve => {
    if (curve.curvePoints && curve.curvePoints.length > 1) {
      const pathData = generateSVGPath(curve.curvePoints);
      svgContent += `
            <path class="kolam-curve" d="${pathData}" />`;
    } else {
      svgContent += `
            <line class="kolam-curve"
                x1="${curve.start.x}" y1="${curve.start.y}"
                x2="${curve.end.x}" y2="${curve.end.y}"
            />`;
    }
  });

  svgContent += `</svg>`;
  return svgContent;
}
