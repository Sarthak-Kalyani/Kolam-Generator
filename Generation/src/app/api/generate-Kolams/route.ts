// import { NextResponse } from 'next/server';
// import sharp from 'sharp';
// import { generateKolam1D } from '@/utils/kolamGenerator';
// import { generateKolamSVG } from '@/utils/svgGenerator';

// // Temporary mock pattern generators — replace these later with your real ones
// import { generateDiamondKolam, generateLotusKolam, generateStarKolam } from '@/utils/kolamGenerator'; 

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);

//     // Get type and size from URL
//     const type = searchParams.get('type') || '1d';
//     const size = parseInt(searchParams.get('size') || '512', 10);

//     // Choose pattern generator based on type
//     let pattern;
//     switch (type.toLowerCase()) {
//       case 'diamond':
//         pattern = generateDiamondKolam(size);
//         break;
//       case 'lotus':
//         pattern = generateLotusKolam(size);
//         break;
//       case 'star':
//         pattern = generateStarKolam(size);
//         break;
//       case '1d':
//       default:
//         pattern = generateKolam1D(size);
//         break;
//     }

//     // Generate SVG and convert to PNG
//     const svgString = generateKolamSVG(pattern, {
//       background: 'none',
//       brush: '#ffffff',
//       padding: 20,
//     });

//     const pngBuffer = await sharp(Buffer.from(svgString, 'utf-8')).png().toBuffer();

//     return new NextResponse(pngBuffer, {
//       headers: {
//         'Content-Type': 'image/png',
//         'Content-Disposition': `inline; filename=${type}-kolam.png`,
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





// import { NextResponse } from 'next/server';
// import sharp from 'sharp';
// import fs from 'fs';
// import path from 'path';
// import { generateDiamondKolam, generateLotusKolam, generateStarKolam } from '@/utils/kolamGenerator';
// import { generateKolamSVG } from '@/utils/svgGenerator';

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const type = searchParams.get('type') || 'diamond'; // e.g. ?type=lotus
//     const size = parseInt(searchParams.get('size') || '512', 10);

//     let pattern;
//     if (type === 'lotus') pattern = generateLotusKolam(size);
//     else if (type === 'star') pattern = generateStarKolam(size);
//     else pattern = generateDiamondKolam(size);

//     const svgString = generateKolamSVG(pattern, {
//       background: 'none', // transparent
//       brush: '#ffffff',
//       padding: 20,
//     });

//     const outputDir = path.join(process.cwd(), 'public', 'kolams');
//     if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

//     // Save SVG
//     const svgPath = path.join(outputDir, `${type}-${Date.now()}.svg`);
//     fs.writeFileSync(svgPath, svgString);

//     // Generate PNG with transparent background
//     const pngBuffer = await sharp(Buffer.from(svgString))
//       .png({ quality: 100 })
//       .toBuffer();

//     const pngPath = path.join(outputDir, `${type}-${Date.now()}.png`);
//     fs.writeFileSync(pngPath, pngBuffer);

//     return new NextResponse(pngBuffer, {
//       status: 200,
//       headers: {
//         'Content-Type': 'image/png',
//         'Cache-Control': 'public, max-age=3600',
//       },
//     });
//   } catch (err: any) {
//     console.error('❌ Kolam API Error:', err);
//     return NextResponse.json(
//       { error: 'Failed to generate Kolam image' },
//       { status: 500 }
//     );
//   }
// }















// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';
// import { generateKolam1D, generateDiamondKolam, generateLotusKolam, generateStarKolam } from '@/utils/kolamGenerator';
// import { generateKolamSVG } from '@/utils/svgGenerator';

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const type = searchParams.get('type') || '1d';
//     const size = parseInt(searchParams.get('size') || '5', 10);

//     let kolam;
//     switch (type) {
//       case 'diamond':
//         kolam = generateDiamondKolam(size);
//         break;
//       case 'lotus':
//         kolam = generateLotusKolam(size);
//         break;
//       case 'star':
//         kolam = generateStarKolam(size);
//         break;
//       default:
//         kolam = generateKolam1D(size);
//       }

//       // added line...........................................................................................
//       console.log('✅ Generated Kolam pattern summary:', {
//       width: kolam.dimensions.width,
//       height: kolam.dimensions.height,
//       dots: kolam.dots.length,
//       curves: kolam.curves.length
//       });


//     // ✅ generate SVG from pattern
//     const svgContent = generateKolamSVG(kolam);

//     // ✅ Save SVG file
//     const folderPath = path.join(process.cwd(), 'src', 'kolams');
//     if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

//     const filePath = path.join(folderPath, `${type}-${Date.now()}.svg`);
//     fs.writeFileSync(filePath, svgContent, 'utf-8');

//     return NextResponse.json({
//       message: 'Kolam generated successfully',
//       filePath: `/src/kolams/${path.basename(filePath)}`
//     });
//   } catch (error) {
//     console.error('❌ Kolam generation failed:', error);
//     return NextResponse.json({ error: 'Failed to generate Kolam image' }, { status: 500 });
//   }
// }








// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';
// import { 
//   generateKolam1D, 
//   generateDiamondKolam, 
//   generateLotusKolam, 
//   generateStarKolam 
// } from '@/utils/kolamGenerator';
// import { generateKolamSVG } from '@/utils/svgGenerator';

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const type = searchParams.get('type')?.toLowerCase() || '1d';
//     const requestedSize = parseInt(searchParams.get('size') || '5', 10);

//     // ✅ Prevent huge input crash (RangeError)
//     const size = Math.min(Math.max(requestedSize, 5), 128);

//     console.log(`🎨 Generating Kolam: type=${type}, size=${size}`);

//     let kolam;
//     switch (type) {
//       case 'diamond':
//         kolam = generateDiamondKolam(size);
//         break;
//       case 'lotus':
//         kolam = generateLotusKolam(size);
//         break;
//       case 'star':
//         kolam = generateStarKolam(size);
//         break;
//       default:
//         kolam = generateKolam1D(size);
//     }

//     if (!kolam || !kolam.dots?.length || !kolam.curves?.length) {
//       throw new Error('Kolam generator returned empty data.');
//     }

//     // ✅ Safe summary log
//     console.log('✅ Kolam summary:', {
//       width: kolam.dimensions?.width,
//       height: kolam.dimensions?.height,
//       dots: kolam.dots.length,
//       curves: kolam.curves.length,
//     });

//     // ✅ Generate SVG (transparent + white brush)
//     const svgContent = generateKolamSVG(kolam, {
//       background: 'none',
//       brush: '#ffffff',
//       padding: 20,
//     });

//     // ✅ Save SVG to src/kolams
//     const folderPath = path.join(process.cwd(), 'src', 'kolams');
//     if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

//     const fileName = `${type}-${Date.now()}.svg`;
//     const filePath = path.join(folderPath, fileName);
//     fs.writeFileSync(filePath, svgContent, 'utf-8');

//     console.log(`💾 Saved Kolam: ${filePath}`);

//     // ✅ Respond with success JSON
//     return NextResponse.json({
//       success: true,
//       message: 'Kolam generated successfully',
//       type,
//       size,
//       filePath: `/src/kolams/${fileName}`,
//     });

//   } catch (error: any) {
//     console.error('❌ Kolam generation failed:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to generate Kolam image', details: error.message },
//       { status: 500 }
//     );
//   }
// }





// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';
// import { 
//   generateKolam1D, 
//   generateDiamondKolam, 
//   generateLotusKolam, 
//   generateStarKolam 
// } from '@/utils/kolamGenerator';
// import { generateKolamSVG } from '@/utils/svgGenerator';

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const type = searchParams.get('type')?.toLowerCase() || '1d';
//     const requestedSize = parseInt(searchParams.get('size') || '5', 10);

//     // ✅ Clamp input size (avoid overload)
//     const size = Math.min(Math.max(requestedSize, 5), 128);

//     console.log(`🎨 Generating Kolam: type=${type}, size=${size}`);

//     let kolam;
//     switch (type) {
//       case 'diamond':
//         kolam = generateDiamondKolam(size);
//         break;
//       case 'lotus':
//         kolam = generateLotusKolam(size);
//         break;
//       case 'star':
//         kolam = generateStarKolam(size);
//         break;
//       default:
//         kolam = generateKolam1D(size);
//     }

//     if (!kolam || !kolam.dots?.length || !kolam.curves?.length) {
//       throw new Error('Kolam generator returned empty data.');
//     }

//     // ✅ Clamp or scale huge outputs to 800x800 max
//     if (kolam.dimensions) {
//       const maxSize = 800;
//       const scaleFactor = Math.min(
//         maxSize / kolam.dimensions.width,
//         maxSize / kolam.dimensions.height,
//         1 // never upscale
//       );
//       kolam.dimensions.width = Math.round(kolam.dimensions.width * scaleFactor);
//       kolam.dimensions.height = Math.round(kolam.dimensions.height * scaleFactor);
//     }

//     console.log('✅ Kolam summary:', {
//       width: kolam.dimensions?.width,
//       height: kolam.dimensions?.height,
//       dots: kolam.dots.length,
//       curves: kolam.curves.length,
//     });

//     // ✅ Generate SVG (transparent bg + white brush)
//     const svgContent = generateKolamSVG(kolam, {
//       background: 'none',
//       brush: '#ffffff',
//       padding: 20,
//     });

//     // ✅ Save SVG to src/kolams
//     const folderPath = path.join(process.cwd(), 'src', 'kolams');
//     if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

//     const fileName = `${type}-${Date.now()}.svg`;
//     const filePath = path.join(folderPath, fileName);
//     fs.writeFileSync(filePath, svgContent, 'utf-8');

//     console.log(`💾 Saved Kolam: ${filePath}`);

//     return NextResponse.json({
//       success: true,
//       message: 'Kolam generated successfully',
//       type,
//       size,
//       dimensions: kolam.dimensions,
//       filePath: `/src/kolams/${fileName}`,
//     });
//   } catch (error: any) {
//     console.error('❌ Kolam generation failed:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to generate Kolam image', details: error.message },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { 
  generateKolam1D, 
  generateDiamondKolam, 
  generateLotusKolam, 
  generateStarKolam 
} from '@/utils/kolamGenerator';
import { generateKolamSVG } from '@/utils/svgGenerator';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type')?.toLowerCase() || '1d';
    const requestedSize = parseInt(searchParams.get('size') || '5', 10);

    // ✅ Prevent huge input crash
    const size = Math.min(Math.max(requestedSize, 5), 128);

    console.log(`🎨 Generating Kolam: type=${type}, size=${size}`);

    let kolam;
    switch (type) {
      case 'diamond':
        kolam = generateDiamondKolam(size);
        break;
      case 'lotus':
        kolam = generateLotusKolam(size);
        break;
      case 'star':
        kolam = generateStarKolam(size);
        break;
      default:
        kolam = generateKolam1D(size);
    }

    if (!kolam || !kolam.dots?.length || !kolam.curves?.length) {
      throw new Error('Kolam generator returned empty data.');
    }

    console.log('✅ Kolam summary:', {
      width: kolam.dimensions?.width,
      height: kolam.dimensions?.height,
      dots: kolam.dots.length,
      curves: kolam.curves.length,
    });

    // ✅ Generate SVG (transparent + white brush)
    const svgContent = generateKolamSVG(kolam, {
      background: 'none',
      brush: '#ffffff',
      padding: 20,
    });

    // ✅ Save SVG file to public folder (not src!)
    const folderPath = path.join('/photos');
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    const fileName = `${type}-${Date.now()}.svg`;
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, svgContent, 'utf-8');

    console.log(`💾 Saved Kolam: ${filePath}`);

    // // ✅ Public URL (accessible from browser)
    // const publicUrl = `/kolams/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'Kolam generated successfully',
      type,
      size,
      filePath: filePath, // 👈 This is the line you asked about
    });

  } catch (error: any) {
    console.error('❌ Kolam generation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate Kolam image', details: error.message, status: 500 }
    );
  }
}
