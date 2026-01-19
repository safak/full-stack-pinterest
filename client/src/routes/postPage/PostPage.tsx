import Gallery from "@/components/gallery/Gallery"
import Post from "@/components/post/Post"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useGetAllPins } from "@/hooks/queries/pin.queries"
import { ArrowLeft } from "lucide-react"
import { useParams } from "react-router"

const PostPage = () => {
  const { id } = useParams()
  const { data: pinsResponse, status, error, hasNextPage, fetchNextPage } = useGetAllPins();
  
  const allPins = pinsResponse?.pages.flatMap((page) => page.data) || []
  const filteredPins = allPins.filter((pin) => pin._id !== id)


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
      <div className="flex justify-center relative min-h-150 mb-4 pl-10">
        <div className="absolute left-0 w-20 h-20 ">
          <Button className="p-1! rounded-full" variant="ghost" size="xl" >
            <ArrowLeft className="w-10! h-10!" />
          </Button>
        </div>
        <Post postId={id || ""} />
      </div>
      <Gallery data={filteredPins} loadMore={fetchNextPage} hasNextPage={hasNextPage} />
    </div>
  )
}

export default PostPage