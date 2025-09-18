import { createCanvas } from "canvas";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get("size") || "500");

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Transparent background (do nothing, keep default transparent)

  // White kolam (dots or lines)
  ctx.fillStyle = "#ffffff"; // white
  for (let x = 50; x < size; x += 100) {
    for (let y = 50; y < size; y += 100) {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Return PNG with transparency
  const buffer = canvas.toBuffer("image/png");

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
