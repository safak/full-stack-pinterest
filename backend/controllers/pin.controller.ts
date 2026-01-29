import ImageKit from 'imagekit'
import Pin from '../models/pin.model.ts'
import Image from '../models/image.model.ts'

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

    console.log("imageDetails", imageDetails);



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

    console.log("created pin", newPin);


    return res.status(201).json({ message: "Pin created successfully.", data: newPin })
  } catch (error) {
    console.error("Error creating pin:", error);
    return res.status(500).json({ message: "Error creating pin.", error })
  }
}

// UPDATE PIN
export const updatePin = async (req: any, res: any) => {
  const { pinId } = req.params
  const { description, likes, media, width, height, title, link, board, tags } = req.body

  const existingPin = await Pin.findById(pinId)
  if (!existingPin) {
    return res.status(404).json({ message: "Pin not found" })
  }

  const updatedPin = await Pin.findByIdAndUpdate(
    pinId,
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