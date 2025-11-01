// lib/generateKolam.ts
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateKolam(designType: string) {
  const prompt = `Generate a traditional South Indian kolam design of type ${designType}. 
  Use clean geometric patterns, symmetry, and cultural accuracy.`;

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });

  const image_url = response.data[0].url;

  // Optional: Download image
  const outputDir = path.join(process.cwd(), "public", "kolams");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const image = await fetch(image_url!);
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const filePath = path.join(outputDir, `${designType}.png`);
  fs.writeFileSync(filePath, buffer);

  return `/kolams/${designType}.png`;
}
