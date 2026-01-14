import { items } from "@/components/gallery/Gallery"
import GalleryItem from "@/components/galleryItem/GalleryItem"
import Post from "@/components/post/Post"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useParams } from "react-router"

const PostPage = () => {
  const params = useParams()
  const { id } = params
  console.log("params", params);

  const currentPost = items.find((item) => String(item.id) == id)

  return (

    <div className="w-full p-4 mx-auto py-8" >
      <div className="flex justify-center relative min-h-150 mb-4 pl-10">
        <div className="absolute left-0 w-20 h-20 ">
          <Button className="p-1! rounded-full" variant="ghost" size="xl" >
            <ArrowLeft className="w-10! h-10!" />
          </Button>
        </div>
        <Post post={currentPost} />
      </div>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5 xl:columns-6 2xl:columns-7 gap-4 space-y-4">
        {items.map((item) => {
          if (String(item.id) == id) return null
          return (
            <GalleryItem key={item.id} item={item} />
          )
        })}
      </div>
    </div>
  )
}

export default PostPage