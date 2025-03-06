import Board from "../models/board.model.js";
import Pin from "../models/pin.model.js";

export const getUserBoards = async (req, res) => {
  const { userId } = req.params;

  const boards = await Board.find({ user: userId });

  const boardsWithPinDetails = await Promise.all(
    boards.map(async (board) => {
      const pinCount = await Pin.countDocuments({ board: board._id });
      const firstPin = await Pin.findOne({ board: board._id });

      return {
        ...board.toObject(),
        pinCount,
        firstPin,
      };
    })
  );

  res.status(200).json(boardsWithPinDetails);
};
