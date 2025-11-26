import { NextResponse } from 'next/server';

export async function GET() {
  const availableKolams = [
    {
      type: '1d',
      description: 'Basic line-based Kolam pattern',
      sizes: [128, 256, 512, 1024],
    },
    {
      type: 'star',
      description: 'Star shaped Kolam pattern',
      sizes: [256, 512, 1024],
    },
    {
      type: 'diamond',
      description: 'Diamond shaped Kolam pattern',
      sizes: [256, 512],
    },
    {
      type: 'lotus',
      description: 'Lotus-flower Kolam pattern',
      sizes: [300, 512, 800],
    },
  ];

  return NextResponse.json({
    success: true,
    message: 'Available Kolam pattern types and grid sizes',
    data: availableKolams,
  });
}
