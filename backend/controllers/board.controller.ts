import Board from "../models/board.model.ts"
import Pin from "../models/pin.model.ts"

export const getUserBoards = async (req: any, res: any) => {
  const userId = req.userId

  const boards = await Board.find({ user: userId })
  console.log("boards", boards);

  const boardsWithPinsDetails = await Promise.all(boards.map(async (board) => {
    const pinsCount = await Pin.countDocuments({ board: board._id })
    const firstPin = await Pin.findOne({ board: board._id })

    return {
      ...board.toObject(),
      pinsCount,
      firstPin
    }

  }))
  return res.status(200).json({ message: "User boards fetched successfully", data: boardsWithPinsDetails })
}

export const createBoard = async (req: any, res: any) => {
  const { title, user, pin } = req.body
  if (!title || !user || !pin) {
    return res.status(400).json({ message: "Title, User and Pin are required to create a board" })
  }

  const existingBoard = await Board.findOne({ pin, user })
  if (existingBoard) {
    return res.status(409).json({ message: "Board for this pin already exists for this user" })
  }
  const newBoard = new Board({
    title,
    user,
    pin
  })
  await newBoard.save()
  return res.status(201).json({ message: "Board created successfully", data: newBoard })
}
