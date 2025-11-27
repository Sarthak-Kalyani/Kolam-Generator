import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ files: [] });
    }
    const files = fs.readdirSync(uploadDir).filter(file => file.endsWith('.png'));
    const urls = files.map(file => `/uploads/${file}`);
    return NextResponse.json({ files: urls });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
