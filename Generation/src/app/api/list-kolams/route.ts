import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const folderPath = path.join(process.cwd(), 'src', 'kolams');

    if (!fs.existsSync(folderPath)) {
      return NextResponse.json({ success: false, message: 'No kolams folder found.' });
    }

    const files = fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.svg'))
      .map(file => ({
        name: file,
        url: `/src/kolams/${file}`,
      }));

    return NextResponse.json({
      success: true,
      count: files.length,
      kolams: files,
    });
  } catch (error) {
    console.error('❌ Failed to list kolams:', error);
    return NextResponse.json({ success: false, message: 'Failed to list kolams.' }, { status: 500 });
  }
}
