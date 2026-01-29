import Imagekit from "imagekit";
import Image from "../models/image.model.ts"
import sharp from "sharp";
import fs from "fs/promises";
import http from "http";
import https from "https";
import path from "path";

function buildTransformationString(parsedTextOptions: any[], parsedCanvasOptions: any, width: number, height: number, croppingStrategy: string) {
  const bg = (parsedCanvasOptions?.backgroundColor || "#ffffff").substring(1);
  const base = `w-${width},h-${height}${croppingStrategy},bg-${bg}`;

  const textArray = parsedTextOptions || [];

  const overlays = (textArray as any[])
    .map((t: any) => {
      if (!t || !t.text) return "";
      const lx = Math.round(((t.left || 0) * width) / 375);
      const ly = Math.round(((t.top || 0) * height) / (parsedCanvasOptions?.height || height));
      // const fs = Math.round((t.fontSize || 16) * 2.1);
      const fs = Math.round((t.fontSize || 16) * width / 372);
      const co = (t.color || "#000000").substring(1);
      return `,l-text,i-${encodeURIComponent(t.text)},fs-${fs},lx-${lx},ly-${ly},co-${co},l-end`;
    })
    .join("");

  return base + overlays;
}

const IK_PUBLIC_KEY = process.env.IK_PUBLIC_KEY
const IK_PRIVATE_KEY = process.env.IK_PRIVATE_KEY
const IK_URL_ENDPOINT = process.env.IK_URL_ENDPOINT

async function fetchBufferFromUrl(url: string): Promise<Buffer> {
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

async function getImageBuffer(media: string): Promise<Buffer> {
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

export const getUserImages = async (req: any, res: any) => {
  const userId = req.userId;
  const images = (await Image.find({ user: userId })).filter((img) => !img.published);
  return res.status(200).json({ message: "Images fetched successfully.", data: images });
};

export const createImage = async (req: any, res: any) => {

  const media = req.files.media;

  if (!media) {
    return res.status(400).json({ message: "Image is required!" });
  }

  const metadata = await sharp(media.data).metadata();

  const originalOrientation =
    metadata.width < metadata.height ? "portrait" : "landscape";

  let width;
  let height;

  width = metadata.width;
  height = metadata.width / Number(originalOrientation);

  const imagekit = new Imagekit({
    publicKey: IK_PUBLIC_KEY!,
    privateKey: IK_PRIVATE_KEY!,
    urlEndpoint: IK_URL_ENDPOINT!,
  });

  const transformationString = `w-${width},h-${height}`;

  imagekit
    .upload({
      file: media.data,
      fileName: media.name,
      folder: "pins",
      transformation: {
        pre: transformationString,
      },
    })
    .then(async (response) => {
      console.log("response?????????????????", response)

      const newImage = await Image.create({
        fileId: response.fileId,
        user: req.userId,
        media: response.filePath,
        published: false,
        width: response.width,
        height: response.height,
      });
      return res.status(201).json(newImage);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

export const updateImage = async (req: any, res: any) => {
  const imageId = req.params.id;
  const {
    textOptions,
    canvasOptions,
  } = req.body;
  console.log("textOptions", textOptions);
  console.log("canvasOptions", canvasOptions);

  if ((!textOptions && !canvasOptions)) {
    return res.status(400).json({ message: "Options are required!" });
  }

  const image = await Image.findById(imageId);
  console.log("image", image?.media.split("/"));


  if (!image) {
    return res.status(404).json({ message: "Image not found!" });
  }

  const parsedTextOptions = (() => {
    try {
      if (!textOptions) return [];
      if (typeof textOptions === "string") {
        if (textOptions === "[object Object]") return [];
        return JSON.parse(textOptions);
      }
      if (Array.isArray(textOptions)) return textOptions;
      return [textOptions];
    } catch (e) {
      console.warn("Failed to parse textOptions:", e, textOptions);
      return [];
    }
  })();

  const parsedCanvasOptions = (() => {
    try {
      if (!canvasOptions) return {};
      if (typeof canvasOptions === "string") {
        if (canvasOptions === "[object Object]") return {};
        return JSON.parse(canvasOptions);
      }
      return canvasOptions;
    } catch (e) {
      console.warn("Failed to parse canvasOptions:", e, canvasOptions);
      return {};
    }
  })();

  let imageBuffer: Buffer;
  try {
    imageBuffer = await getImageBuffer(image.media);
  } catch (err: any) {
    console.error('Failed to load image media:', err);
    return res.status(500).json({ message: 'Failed to load image media', error: String(err) });
  }

  const metadata = await sharp(imageBuffer).metadata();

  const originalOrientation =
    metadata.width < metadata.height ? "portrait" : "landscape";
  const originalAspectRatio = metadata.width / metadata.height;

  let clientAspectRatio;
  let width;
  let height;

  if (parsedCanvasOptions.name !== "original") {
    clientAspectRatio =
      parsedCanvasOptions.size.width /
      parsedCanvasOptions.size.height
  } else {
    parsedCanvasOptions.orientation === originalOrientation
      ? (clientAspectRatio = originalOrientation)
      : (clientAspectRatio = 1 / originalAspectRatio);
  }

  width = metadata.width;
  height = metadata.width / Number(clientAspectRatio);

  // `parsedTextOptions` is an array of text overlays; per-text positions are
  // calculated inside `buildTransformationString`, so skip single-position math.

  let croppingStrategy = "";

  if (parsedCanvasOptions.size.name !== "original") {
    if (Number(originalAspectRatio) > Number(clientAspectRatio)) {
      croppingStrategy = ",cm-pad_resize";
    }
  } else {
    if (
      originalOrientation === "landscape" &&
      parsedCanvasOptions.orientation === "portrait"
    ) {
      croppingStrategy = ",cm-pad_resize";
    }
  }

  const imagekit = new Imagekit({
    publicKey: IK_PUBLIC_KEY!,
    privateKey: IK_PRIVATE_KEY!,
    urlEndpoint: IK_URL_ENDPOINT!,
  });

  const transformationString = buildTransformationString(
    parsedTextOptions,
    parsedCanvasOptions,
    width,
    height,
    croppingStrategy
  );

  try {
    const response = await imagekit.upload({
      file: imageBuffer,
      fileName: image.media.split("/").pop() || "image",
      folder: "pins",
      transformation: {
        pre: transformationString,
      },
    });

    const newImage = await Image.create({
      fileId: response.fileId,
      user: req.userId,
      media: response.filePath,
      published: false,
      width: response.width,
      height: response.height,
    });

    try {
      await imagekit.deleteFile(image.fileId);
    } catch (e) {
      console.warn('Failed to delete old file from ImageKit:', e);
    }

    try {
      await Image.findByIdAndDelete(imageId);
    } catch (e) {
      console.warn('Failed to delete old DB image record:', e);
    }

    return res.status(201).json({ message: "Image created!", data: newImage });
  } catch (err) {
    console.error('Upload failed:', err);
    return res.status(500).json(err);
  }

};

export const deleteImage = async (req: any, res: any) => {
  const imageId = req.params.id;
  const image = await Image.findById(imageId);
  if (!image) {
    return res.status(404).json({ message: "Image not found!" });
  }

  const imagekit = new Imagekit({
    publicKey: IK_PUBLIC_KEY!,
    privateKey: IK_PRIVATE_KEY!,
    urlEndpoint: IK_URL_ENDPOINT!,
  });
  try {
    await imagekit.deleteFile(image.fileId);
    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete image.", error });
  }
  return res.status(204).json({ message: "Image deleted successfully." });
}

// export const updateImage = async (req: any, res: any) => {
//   const imageId = req.params.id;
//   const {
//     textOptions,
//     canvasOptions,
//   } = req.body;

//   const media = req.files.media;

//   if ((!media)) {
//     return res.status(400).json({ message: "Image is required!" });
//   }

//   const image = await Image.findById(imageId);
//   if (!image) {
//     return res.status(404).json({ message: "Image not found!" });
//   }

//   const parsedTextOptions = JSON.parse(textOptions || "{}");
//   const parsedCanvasOptions = JSON.parse(canvasOptions || "{}");

//   const metadata = await sharp(media.data).metadata();

//   const originalOrientation =
//     metadata.width < metadata.height ? "portrait" : "landscape";
//   const originalAspectRatio = metadata.width / metadata.height;

//   let clientAspectRatio;
//   let width;
//   let height;

//   if (parsedCanvasOptions.size !== "original") {
//     clientAspectRatio =
//       parsedCanvasOptions.size.split(":")[0] /
//       parsedCanvasOptions.size.split(":")[1];
//   } else {
//     parsedCanvasOptions.orientation === originalOrientation
//       ? (clientAspectRatio = originalOrientation)
//       : (clientAspectRatio = 1 / originalAspectRatio);
//   }

//   width = metadata.width;
//   height = metadata.width / Number(clientAspectRatio);

//   const imagekit = new Imagekit({
//     publicKey: process.env.IK_PUBLIC_KEY!,
//     privateKey: process.env.IK_PRIVATE_KEY!,
//     urlEndpoint: process.env.IK_URL_ENDPOINT!,
//   });

//   const textLeftPosition = Math.round((parsedTextOptions.left * width) / 375);
//   const textTopPosition = Math.round(
//     (parsedTextOptions.top * height) / parsedCanvasOptions.height
//   );

//   let croppingStrategy = "";

//   if (parsedCanvasOptions.size !== "original") {
//     if (Number(originalAspectRatio) > Number(clientAspectRatio)) {
//       croppingStrategy = ",cm-pad_resize";
//     }
//   } else {
//     if (
//       originalOrientation === "landscape" &&
//       parsedCanvasOptions.orientation === "portrait"
//     ) {
//       croppingStrategy = ",cm-pad_resize";
//     }
//   }

//   const transformationString = `w-${width},h-${height}${croppingStrategy},bg-${parsedCanvasOptions.backgroundColor.substring(
//     1
//   )}${parsedTextOptions.text
//     ? `,l-text,i-${parsedTextOptions.text},fs-${parsedTextOptions.fontSize * 2.1
//     },lx-${textLeftPosition},ly-${textTopPosition},co-${parsedTextOptions.color.substring(
//       1
//     )},l-end`
//     : ""
//     }`;

//   imagekit
//     .updateFileDetails(image.fileId, {
//       dfgdfg
//     })
//     .then(async (response) => {
//       // FIXED: ADD NEW BOARD

//       const updatedImage = await Image.findByIdAndUpdate(imageId, {
//         fileId: response.fileId,
//         user: req.userId,
//         media: response.filePath,
//         published: false,
//         width: response.width,
//         height: response.height,
//       });
//       return res.status(201).json(updatedImage);
//     })
//     .catch((err) => {
//       console.log(err);
//       return res.status(500).json(err);
//     });
// };