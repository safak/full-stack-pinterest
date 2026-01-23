import Pin from '../models/pin.model.ts'
import User from '../models/user.model.ts'

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


  const newPin = await Pin.create({
    ...pin,
  })
  console.log("created pin", newPin);


  return res.status(201).json({ message: "Pin created successfully." })
}

// media: {
//     type: String,
//     required: true
//   },
//   width: {
//     type: Number,
//     required: true
//   },
//   height: {
//     type: Number,
//     required: true
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   link: {
//     type: String,
//   },
//   board: {
//     type: Schema.Types.ObjectId,
//     ref: "Board",
//   },
//   tags: {
//     type: [String]
//   },
//   likes: [{
//     type: Schema.Types.ObjectId,
//     ref: "User"
//   }]

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