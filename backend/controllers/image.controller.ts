import { toFile } from "@imagekit/nodejs";
import sharp from "sharp";
import Image from "../models/image.model.ts";
import { getImageBuffer, getImagekitClient, optimizeImageBuffer } from "../utils/image.ts";

function buildTransformationString(parsedTextOptions: any[], parsedCanvasOptions: any, width: number, height: number, croppingStrategy: string) {
  const bg = (parsedCanvasOptions?.backgroundColor || "#ffffff").substring(1);
  const base = `w-${width},h-${height}${croppingStrategy},bg-${bg}`;

  const textArray = parsedTextOptions || [];

  const overlays = (textArray as any[])
    .map((t: any, index) => {
      if (!t || !t.text) return "";
      const lx = Math.round(((t.left || 0) * width) / 359);
      const ly = Math.round(((t.top || 0) * height) / (parsedCanvasOptions?.size?.height || height));
      const fs = Math.round((t.fontSize || 16) * width / 359);
      const co = (t.color || "#000000").substring(1);
      if (index === 0) {
        return `,l-text,i-${encodeURIComponent(t.text)},fs-${fs},lx-${lx},ly-${ly},co-${co},l-end`
      }
      return `:l-text,i-${encodeURIComponent(t.text)},fs-${fs},lx-${lx},ly-${ly},co-${co},l-end`;
    })
    .join("");

  return base + overlays;
}

export const getUserImages = async (req: any, res: any) => {
  const userId = req.userId;
  const images = (await Image.find({ user: userId })).filter((img) => !img.published);
  return res.status(200).json({ message: "Images fetched successfully.", data: images });
};

export const createImage = async (req: any, res: any) => {
  try {
    const media = req.files?.media;
    if (!media?.data) {
      return res.status(400).json({ message: "Image is required!" });
    }

    const imagekit = getImagekitClient();
    const { buffer, metadata } = await optimizeImageBuffer(media.data as Buffer);

    const file = await toFile(buffer, media.name || "image");
    const response = await imagekit.files.upload({
      file,
      fileName: media.name || "image",
      folder: "pins",
    });

    const newImage = await Image.create({
      fileId: response.fileId,
      user: req.userId,
      media: response.filePath,
      published: false,
      width: response.width ?? metadata.width,
      height: response.height ?? metadata.height,
    });

    return res.status(201).json(newImage);
  } catch (err: any) {
    console.error("createImage failed:", err);
    return res.status(500).json({ message: err.message || "Failed to create image" });
  }
};

export const updateImage = async (req: any, res: any) => {
  const imageId = req.params.id;
  const {
    textOptions,
    canvasOptions,
  } = req.body;

  if ((!textOptions && !canvasOptions)) {
    return res.status(400).json({ message: "Options are required!" });
  }

  const image = await Image.findById(imageId);

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
    croppingStrategy = ",cm-pad_resize";
  }
  // else {
  //   if (
  //     originalOrientation === "landscape" &&
  //     parsedCanvasOptions.orientation === "portrait"
  //   ) {
  //     croppingStrategy = ",cm-pad_resize";
  //   }
  // }

  const imagekit = getImagekitClient();

  const transformationString = buildTransformationString(
    parsedTextOptions,
    parsedCanvasOptions,
    width,
    height,
    croppingStrategy
  );

  const file = await toFile(imageBuffer, image.media.split("/").pop() || "image");
  try {
    const response = await imagekit.files.upload({
      file: file,
      fileName: image.media.split("/").pop() || "image",
      folder: "pins",
      transformation: {
        pre: transformationString
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
      await imagekit.files.delete(image.fileId);
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

// export const updateImage = async (req: any, res: any) => {
//   const imageId = req.params.id;
//   const {
//     textOptions,
//     canvasOptions,
//   } = req.body;

//   if ((!textOptions && !canvasOptions)) {
//     return res.status(400).json({ message: "Options are required!" });
//   }

//   const image = await Image.findById(imageId);

//   if (!image) {
//     return res.status(404).json({ message: "Image not found!" });
//   }

//   const parsedTextOptions = parseJsonSafely(textOptions, []);
//   const parsedCanvasOptions = parseJsonSafely(canvasOptions, {});
//   // const normalizedTextOptions = Array.isArray(parsedTextOptions)
//   //   ? parsedTextOptions
//   //   : [parsedTextOptions].filter(Boolean);

//   let imageBuffer: Buffer;
//   try {
//     imageBuffer = await getImageBuffer(image.media);
//   } catch (err: any) {
//     console.error('Failed to load image media:', err);
//     return res.status(500).json({ message: 'Failed to load image media', error: String(err) });
//   }

//   const metadata = await sharp(imageBuffer).metadata();

//   const originalOrientation =
//     metadata.width < metadata.height ? "portrait" : "landscape";
//   const originalAspectRatio = metadata.width / metadata.height;

//   const canvasName = parsedCanvasOptions?.name || "original";
//   const canvasSize = parsedCanvasOptions?.size || {};
//   const canvasOrientation = parsedCanvasOptions?.orientation || originalOrientation;

//   const clientAspectRatio = canvasName !== "original"
//     ? (canvasSize.width || metadata.width) / (canvasSize.height || metadata.height)
//     : (canvasOrientation === originalOrientation ? originalAspectRatio : 1 / originalAspectRatio);

//   let width = canvasSize.width || metadata.width || 0;
//   let height = canvasSize.height || 0;
//   if (!height && width) {
//     height = Math.round(width / clientAspectRatio);
//   }
//   if (!width && height) {
//     width = Math.round(height * clientAspectRatio);
//   }

//   // `parsedTextOptions` is an array of text overlays; per-text positions are
//   // calculated inside `buildTransformationArray`, so skip single-position math.

//   let cropMode: "pad_resize" | undefined = undefined;

//   if (canvasName !== "original") {
//     if (Number(originalAspectRatio) > Number(clientAspectRatio)) {
//       cropMode = "pad_resize";
//     }
//   } else if (originalOrientation === "landscape" && canvasOrientation === "portrait") {
//     cropMode = "pad_resize";
//   }

//   if (!cropMode && parsedCanvasOptions?.backgroundColor && (canvasSize.width || canvasSize.height)) {
//     cropMode = "pad_resize";
//   }

//   const imagekit = getImagekitClient();

//   const transformation = buildTransformationArray(
//     parsedTextOptions,
//     parsedCanvasOptions,
//     width,
//     height,
//     cropMode
//   );

//   const textOverlayUrl = imagekit.helper.buildSrc({
//     urlEndpoint: process.env.IK_URL_ENDPOINT!,
//     src: image.media,
//     transformation
//   });

//   console.log("textOverlayUrl", textOverlayUrl);
//   console.log("transformation", transformation);

//   return res.status(200).json({
//     message: "Image updated successfully.",
//   })

//   try {
//     // const fileName = image.media.split("/").pop() || "image";
//     // const response = await imagekit.files.upload({
//     //   file: await toFile(imageBuffer, fileName),
//     //   fileName,
//     //   folder: "pins",
//     //   transformation: [
//     //     {
//     //       width: width.toString(),
//     //       height: height.toString(),
//     //       overlay: {
//     //         type: 'text',
//     //         text: 'Sample Text Overlay',
//     //         position: {
//     //           x: 50,
//     //           y: 50,
//     //           focus: 'center',
//     //         },
//     //         transformation: [
//     //           {
//     //             fontSize: 40,
//     //             fontFamily: 'Arial',
//     //             fontColor: 'FFFFFF',
//     //             typography: 'b', // bold
//     //           },
//     //         ],
//     //       },
//     //     },
//     //   ]
//     // });

//     // const newImage = await Image.create({
//     //   fileId: response.fileId,
//     //   user: req.userId,
//     //   media: response.filePath,
//     //   published: false,
//     //   width: response.width,
//     //   height: response.height,
//     // });

//     // try {
//     //   await imagekit.files.delete(image.fileId);
//     // } catch (e) {
//     //   console.warn("Failed to delete old file from ImageKit:", e);
//     // }

//     // try {
//     //   await Image.findByIdAndDelete(imageId);
//     // } catch (e) {
//     //   console.warn("Failed to delete old DB image record:", e);
//     // }

//     // return res.status(201).json({ message: "Image created!", data: newImage });
//   } catch (err) {
//     console.error('Upload failed:', err);
//     return res.status(500).json(err);
//   }

// };

export const deleteImage = async (req: any, res: any) => {
  const imageId = req.params.id;
  const image = await Image.findById(imageId);
  if (!image) {
    return res.status(404).json({ message: "Image not found!" });
  }

  const imagekit = getImagekitClient();
  try {
    await imagekit.files.delete(image.fileId);
    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete image.", error });
  }
  return res.status(204).json({ message: "Image deleted successfully." });
}