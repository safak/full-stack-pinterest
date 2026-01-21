import Board from "../models/board.model.ts"
import Pin from "../models/pin.model.ts"

export const getUserBoards = async (req: any, res: any) => {
  const { userId } = req.params

  const boards = await Board.find({ user: userId })

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
