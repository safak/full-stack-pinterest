import Imagekit from "@imagekit/nodejs";
import fs from "fs/promises";
import http from "http";
import https from "https";
import path from "path";
import sharp from "sharp";

const IK_URL_ENDPOINT = process.env.IK_URL_ENDPOINT
const IK_PRIVATE_KEY = process.env.IK_PRIVATE_KEY

export function buildTransformationArray(
  parsedTextOptions: any[],
  parsedCanvasOptions: any,
  width: number,
  height: number,
  cropMode?: "pad_resize" | "force" | "maintain_ratio" | string
) {
  const canvasSize = parsedCanvasOptions?.size || {};
  const baseWidth = canvasSize.width || width;
  const baseHeight = canvasSize.height || height;

  const background = (parsedCanvasOptions?.backgroundColor || "#ffffff").replace("#", "");

  const textArray = Array.isArray(parsedTextOptions)
    ? parsedTextOptions
    : [parsedTextOptions].filter(Boolean);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const scaleCoord = (value: number, base: number, target: number) => {
    if (!Number.isFinite(value) || !Number.isFinite(base) || !Number.isFinite(target) || base <= 0 || target <= 0) {
      return 0;
    }
    // Treat 0..1 as normalized ratio
    if (value >= 0 && value <= 1) return Math.round(value * target);
    // If already close to target scale, keep as-is
    if (value > base && value <= target * 1.2) return Math.round(value);
    // Default: scale from base to target
    return Math.round((value * target) / base);
  };

  const scaleSize = (value: number, base: number, target: number) => {
    if (!Number.isFinite(value)) return 16;
    if (value > 0 && value <= 1) return Math.round(value * target);
    if (value > base && value <= target * 1.2) return Math.round(value);
    return Math.round((value * target) / base);
  };

  const overlays = textArray
    .filter((t: any) => t && t.text)
    .slice(0, 8)
    .map((t: any) => {
      const left = typeof t.left === "number" ? t.left : 0;
      const useBottom = typeof t.top !== "number" && typeof t.bottom === "number";

      const xRaw = scaleCoord(left, baseWidth, width);
      const yRaw = useBottom
        ? height - scaleCoord(t.bottom, baseHeight, height)
        : scaleCoord(t.top || 0, baseHeight, height);

      const x = clamp(xRaw, 0, width);
      const y = clamp(yRaw, 0, height);

      const fontSize = scaleSize(t.fontSize || 16, baseWidth, width);
      const fontColor = (t.color || "#000000").replace("#", "");

      return {
        overlay: {
          type: "text",
          text: t.text,
          position: { x, y },
          transformation: [{ fontSize, fontColor }],
        },
      };
    });

  const baseTransform: any = {
    width,
    height,
    background,
  };

  if (cropMode) {
    baseTransform.cropMode = cropMode;
  }

  if (overlays.length === 0) return [baseTransform];

  return [{ ...baseTransform, overlay: overlays[0].overlay }, ...overlays.slice(1)];
}

export const parseJsonSafely = (value: any, fallback: any) => {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  if (value === "[object Object]") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const optimizeImageBuffer = async (buffer: Buffer) => {
  const MAX_IMAGE_BYTES = parseInt(process.env.MAX_IMAGE_BYTES || "10485760", 10); // 10MB
  const MAX_DIMENSION = parseInt(process.env.MAX_IMAGE_DIMENSION || "2048", 10);

  let metadata = await sharp(buffer).metadata();
  const hasAlpha = !!metadata.hasAlpha;
  const outputFormat = hasAlpha ? "png" : "jpeg";

  let width = metadata.width || 0;
  let height = metadata.height || 0;
  if (MAX_DIMENSION > 0 && Math.max(width, height) > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  let quality = 85;
  let processed = await sharp(buffer)
    .resize({ width, height, fit: "inside" })
    .toFormat(outputFormat as any, outputFormat === "jpeg" ? { quality } : { compressionLevel: 9 })
    .toBuffer();

  for (let i = 0; i < 6 && processed.length > MAX_IMAGE_BYTES; i++) {
    width = Math.max(80, Math.round(width * 0.8));
    height = Math.max(80, Math.round(height * 0.8));
    if (outputFormat === "jpeg") quality = Math.max(30, quality - 15);
    processed = await sharp(buffer)
      .resize({ width, height, fit: "inside" })
      .toFormat(outputFormat as any, outputFormat === "jpeg" ? { quality } : { compressionLevel: 9 })
      .toBuffer();
  }

  metadata = await sharp(processed).metadata();
  return { buffer: processed, metadata };
};

export async function fetchBufferFromUrl(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, (res) => {
      const code = res.statusCode || 0;
      if (code >= 400) {
        reject(new Error(`Failed to fetch image: ${code}`));
        res.resume();
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
  });
}

export async function getImageBuffer(media: string): Promise<Buffer> {
  if (!media) throw new Error("No media provided");
  if (/^https?:\/\//i.test(media)) return fetchBufferFromUrl(media);

  // Try reading local file path (resolve relative to project cwd)
  try {
    const localPath = path.isAbsolute(media) ? media : path.resolve(process.cwd(), media.replace(/^\//, ""));
    return await fs.readFile(localPath);
  } catch (e) {
    // Fallback: if we have an ImageKit endpoint, build a public URL and fetch it
    if (!IK_URL_ENDPOINT) throw e;
    const base = IK_URL_ENDPOINT.replace(/\/$/, "");
    const filePath = media.startsWith("/") ? media : `/${media}`;
    const url = `${base}${filePath}`;
    return fetchBufferFromUrl(url);
  }
}

export const getImagekitClient = () => {
  if (!IK_PRIVATE_KEY) {
    throw new Error("ImageKit credentials are not configured");
  }
  return new Imagekit({
    privateKey: IK_PRIVATE_KEY,
  });
};