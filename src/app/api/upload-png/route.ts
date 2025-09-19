import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, filename } = body;

    if (!imageData || !filename) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Extract base64 part of data URL
    const matches = imageData.match(/^data:image\/png;base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: 'Invalid image data format' }, { status: 400 });
    }
    const base64Data = matches[1];

    // Decode base64 to binary
    const buffer = Buffer.from(base64Data, 'base64');

    // Save directory (public/uploads)
    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, `${filename}.png`);

    // Write file to disk
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ message: 'Image uploaded successfully', url: `/uploads/${filename}.png` });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
