import Board from "../models/board.model.ts"

export const getBoards = async (req: any, res: any) => {
  const boards = await Board.find()
  return res.status(200).json({ message: "Boards fetched successfully", data: boards })
}
