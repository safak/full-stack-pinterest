import { useGetBoards } from '@/hooks/queries/board.queries'
import type { Board } from '@/types'
import BoardItem from '../boardItem/BoardItem'
import { Spinner } from '../ui/spinner'

const SavedBoard = ({ userId = "" }: { userId: string }) => {
  const { data: board, status, error } = useGetBoards({ userId })
  console.log("board", board);


  if (status === "pending") {
    return (
      <div className="flex justify-center mt-60">
        <Spinner className="size-12" />
      </div>
    )
  }

  if (status === "error") {
    return <div>{error.message}</div>
  }

  return (
    <div className="w-full p-4 mx-auto py-8" >
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5 xl:columns-6 2xl:columns-7 gap-4 space-y-4">
        {board.data.map((board: Board) => {
          if (!board?.firstPin) return null;
          return (
            <BoardItem key={board._id} item={board?.firstPin} />
          )
        })}
      </div>
    </div>
  )
}

export default SavedBoard