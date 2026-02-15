import { useGetSavedPins } from '@/hooks/queries/pin.queries'
import BoardItem from '../boardItem/BoardItem'
import { Spinner } from '../ui/spinner'

const SavedBoard = ({ userId = "" }: { userId: string }) => {
  const { data: savedPins, status, error } = useGetSavedPins(userId)

  if (status === "pending") {
    return (
      <div className="flex justify-center mt-60">
        <Spinner className="size-12" />
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="w-full flex mt-6 justify-center">
        <p className='font-semibold!'>
          {error.message}
        </p>
      </div>
    )
  }

  if (!savedPins || savedPins.data.length === 0) {
    return (
      <div className="w-full flex mt-6 justify-center">
        <p className='font-semibold!'>
          No saved posts yet.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full p-4 mx-auto py-8" >
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5 xl:columns-6 2xl:columns-7 gap-4 space-y-4">
        {savedPins.data.map((pin) => {
          return (
            <BoardItem key={pin._id} item={pin} userId={userId}/>
          )
        })}
      </div>
    </div>
  )
}

export default SavedBoard