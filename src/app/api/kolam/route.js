import { createCanvas } from "canvas";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get("size") || "500");
  const dot = searchParams.get("brush") || "#000000";

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // ❌ Do not paint background → keeps transparency

  // Draw dots (example pattern)
  ctx.fillStyle = dot;
  for (let x = 50; x < size; x += 100) {
    for (let y = 50; y < size; y += 100) {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Convert to PNG (supports transparency)
  const buffer = canvas.toBuffer("image/png");

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
