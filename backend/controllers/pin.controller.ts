import ImageKit from 'imagekit'
import Pin from '../models/pin.model.ts'
import Image from '../models/image.model.ts'
import Like from '../models/like.model.ts'
import Save from '../models/save.model.ts'
import jwt from 'jsonwebtoken'

const IK_PUBLIC_KEY = process.env.IK_PUBLIC_KEY
const IK_PRIVATE_KEY = process.env.IK_PRIVATE_KEY
const IK_URL_ENDPOINT = process.env.IK_URL_ENDPOINT

// GET ALL PINS
export const getPins = async (req: any, res: any) => {
  const pageNumber = Number(req.query.cursor)
  const search = req.query.search
  const userId = req.query.userId
  const LIMIT = 21
  const pins = (await Pin.find(
    search ? {
      $or: [
        {
          title: { $regex: search, $options: "i" },
          tags: { $in: [search] }
        }
      ]
    } : userId ? {
      user: userId
    } : {}).limit(LIMIT).skip(pageNumber * LIMIT))
  const hasNextPage = pins.length === LIMIT
  return res.status(200).json({
    message: "Pins fetched successfully.",
    data: pins,
    nextCursor: hasNextPage ? pageNumber + 1 : null
  })
}

// GET PIN BY ID
export const getPin = async (req: any, res: any) => {
  const id = req.params?.id || req.query?.id
  if (!id) return res.status(400).json({ message: "Missing pin id." })

  const pin = await Pin.findById(id).populate("user", "username img displayName")
  if (!pin) return res.status(404).json({ message: "Pin not found." })

  return res.status(200).json({ message: "Pin fetched successfully.", data: pin })
}

// CREATE PIN
export const createPin = async (req: any, res: any) => {
  const pin = req.body
  const userId = req.userId
  if (!pin.title || !pin.description || !pin.imageId) {
    return res.status(400).json({ message: "Missing required fields." })
  }
  try {
    const imagekit = new ImageKit({
      publicKey: IK_PUBLIC_KEY!,
      privateKey: IK_PRIVATE_KEY!,
      urlEndpoint: IK_URL_ENDPOINT!,
    });

    const image = await Image.findById(pin.imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    const imageDetails = await imagekit.getFileDetails(image.fileId);


    // flag image as published
    await Image.findByIdAndUpdate(pin.imageId, { published: true });

    const newPin = await Pin.create({
      media: imageDetails.filePath,
      width: imageDetails.width || 372,
      height: imageDetails.height || 372,
      link: pin.link || null,
      board: pin.board || null,
      title: pin.title,
      description: pin.description,
      tags: pin.tags ? pin.tags.split(",").map((tag: string) => tag.trim()) : [],
      user: userId,
      likes: []
    })

    return res.status(201).json({ message: "Pin created successfully.", data: newPin })
  } catch (error) {
    console.error("Error creating pin:", error);
    return res.status(500).json({ message: "Error creating pin.", error })
  }
}

// UPDATE PIN
export const updatePin = async (req: any, res: any) => {
  const { id } = req.params
  const { description, likes, media, width, height, title, link, board, tags } = req.body

  const existingPin = await Pin.findById(id)
  if (!existingPin) {
    return res.status(404).json({ message: "Pin not found" })
  }

  const updatedPin = await Pin.findByIdAndUpdate(
    id,
    {
      description: description ?? existingPin.description,
      media: media ?? existingPin.media,
      width: width ?? existingPin.width,
      height: height ?? existingPin.height,
      title: title ?? existingPin.title,
      link: link ?? existingPin.link,
      board: board ?? existingPin.board,
      tags: tags ?? existingPin.tags,
      likes: likes ? likes : existingPin.likes
    },
    { new: true }
  )

  return res.status(200).json({ message: "Pin updated successfully", data: updatedPin })
}

export const deletePin = async (req: any, res: any) => {
  const { id } = req.params
  await Pin.findByIdAndDelete(id)
  return res.status(200).json({ message: "Pin deleted successfully." })
}

export const interactionCheck = async (req: any, res: any) => {
  const { id } = req.params;
  const token = req.cookies.token;

  const likeCount = await Like.countDocuments({ pin: id });
  let userId = null;
  if (!token) {
    return res.status(200).json({ message: "Pin interaction status fetched successfully.", data: { likeCount, isLiked: false, isSaved: false } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    userId = (decoded as any).id
  } catch (error) {
    return res
      .status(200)
      .json({ message: "Pin interaction status fetched successfully.", data: { likeCount, isLiked: false, isSaved: false } });
  }

  const isLiked = await Like.findOne({
    user: userId,
    pin: id,
  });
  const isSaved = await Save.findOne({
    user: userId,
    pin: id,
  });

  return res.status(200).json({
    message: "Pin interaction status fetched successfully.",
    data: {
      likeCount,
      isLiked: isLiked ? true : false,
      isSaved: isSaved ? true : false,
    }
  });

};


export const interactPin = async (req: any, res: any) => {
  const { id } = req.params
  const { type } = req.body
  const userId = req.userId

  const pin = await Pin.findById(id)

  if (!pin) return res.status(404).json({ message: "Pin not found." })

  if (type === "like") {
    const isLiked = await Like.findOne({
      pin: id,
      user: userId,
    });

    if (isLiked) {
      await Like.deleteOne({
        pin: id,
        user: userId,
      });
    } else {
      await Like.create({
        pin: id,
        user: userId,
      });
    }
  } else {
    const isSaved = await Save.findOne({
      pin: id,
      user: userId,
    });

    if (isSaved) {
      await Save.deleteOne({
        pin: id,
        user: userId,
      });
    } else {
      await Save.create({
        pin: id,
        user: userId,
      });

      const isSaved = await Save.findOne({
        user: userId,
        pin: id,
      });
    }
  }

  await pin.save()

  return res.status(200).json({ message: "Pin interaction updated successfully.", data: pin })
}

export const getSavedPins = async (req: any, res: any) => {
  const userId = req.params.userId
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" })
  }
  const saves = await Save.find({ user: userId }).populate('pin')
  const savedPins = saves.map(save => save.pin)
  return res.status(200).json({ message: "Saved pins fetched successfully.", data: savedPins })
}