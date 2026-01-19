import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

import { ChevronDown, Ellipsis, Heart, Maximize2, MessageCircle, Search, Share } from "lucide-react"
import Comments from "../comments/Comments"
import Image from "../image/Image"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { useGetPin } from "@/hooks/queries/pin.queries"
import { Spinner } from "../ui/spinner"


const Post = ({ postId }: { postId: string }) => {
  const { data: post, status, error } = useGetPin(postId);


  if (!postId) {
    return (
      <div className="flex justify-center text-center text-xl">
        <p>No post found!</p>
      </div>
    )
  }

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
    <div className="flex flex-col rounded-2xl border min-w-70 min-h-140 h-max py-2 px-4 relative">
      <div className="flex justify-between gap-2 md:gap-6 overflow-x-auto pb-4 w-full sticky top-20.25 z-10 bg-white border-b">
        <div className="hidden sm:flex items-center gap-2 ">
          <div className="flex items-center">
            <Button variant="ghost" size="xl" className="px-2!">
              <Heart className="w-7! h-7!" />
            </Button>
            <Badge
              className="h-5 min-w-5 bg-transparent! text-md font-semibold rounded-full px-1 font-mono tabular-nums"
              variant="secondary"
            >
              99
            </Badge>
          </div>
          <Button variant="ghost" size="xl" className="px-2!">
            <MessageCircle className="w-7! h-7!" />
          </Button>
          <Button variant="ghost" size="xl" className="px-2!">
            <Share className="w-7! h-7!" />
          </Button>
          <Button variant="ghost" size="xl" className="px-2!">
            <Ellipsis className="w-7! h-7!" />
          </Button>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="xl">
                Profile
                <ChevronDown className="ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <a className="flex gap-2" href="/users/1">
                  Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="destructive" size="xl">
            Save
          </Button>
        </div>
      </div>
      <div className="flex justify-center w-full max-w-120 h-max relative mb-4 min-h-100">
        <Image item={{ ...post.data, w: 736 }} />

        <div className="absolute bottom-2 flex justify-between items-end w-full px-4">
          <Badge className="bg-gray-800 h-max py-3 px-6 rounded-xl text-md" >AI modified</Badge>
          <div className="flex flex-col gap-2">
            <Button className="rounded-xl bg-gray-400" variant="secondary" size="xl">
              <Maximize2 />
            </Button>
            <Button className="rounded-xl bg-gray-400" variant="secondary" size="xl">
              <Search />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-2 md:gap-6 overflow-x-auto">
        <Comments post={post.data} />
      </div>
    </div>
  )
}

export default Post