import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

import { useGetPin } from "@/hooks/queries/pin.queries"
import { ChevronDown, Ellipsis, Heart, Maximize2, MessageCircle, Search, Share } from "lucide-react"
import { useState } from "react"
import Comments from "../comments/Comments"
import DisplayFullImage from "../displayFullImage/DisplayFullImage"
import Image from "../image/Image"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { useUpdatePin } from "@/hooks/mutations/pin.mutations"
import useAuthStore from "@/lib/authStore"
import { useCreateBoard } from "@/hooks/mutations/board.mutations"


const Post = ({ postId }: { postId: string }) => {
  const { currentUser } = useAuthStore();
  const { data: post, status, error } = useGetPin(postId);
  const { mutate: savePost, status: saveStatus } = useCreateBoard()
  const { mutate, status: updateStatus } = useUpdatePin()
  const [isOpen, setIsOpen] = useState(false);


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

  const handleLikePost = () => {
    // Fix Later
    // if (!currentUser?._id) return;

    // const updatedLikes = post.data.likes || [];
    // const hasLiked = updatedLikes.includes(currentUser._id);
    // const newLikes = hasLiked ? updatedLikes.filter((userId) => userId !== currentUser._id) : [...updatedLikes, currentUser._id];
    // console.log("newLikes", newLikes);


    // mutate({ pinId: postId, payload: { likes: newLikes } });
  }

  const handleSavePost = () => {
    if (!currentUser?._id) return;
    const newBoard = {
      user: currentUser._id,
      title: "My Saved Pins",
      pin: postId,
    };

    savePost(newBoard);
  }



  return (
    <>
      <DisplayFullImage isOpen={isOpen} setIsOpen={setIsOpen} post={post.data} />
      <div className="flex flex-col rounded-2xl border min-w-70 min-h-140 h-max py-2 px-4 relative">
        <div className="flex justify-between gap-2 md:gap-6 overflow-x-auto pb-4 w-full sticky top-20.25 z-10 bg-white border-b">
          <div className="hidden sm:flex items-center gap-2 ">
            <div className="flex items-center">
              <Button variant="ghost" size="xl" className="px-2!" onClick={handleLikePost} disabled={updateStatus === "pending"}>
                <Heart className="w-7! h-7!" />
              </Button>
              <Badge
                className="h-5 min-w-5 bg-transparent! text-md font-semibold rounded-full px-1 font-mono tabular-nums"
                variant="secondary"
              >
                {post.data.likes?.length || 0}
              </Badge>
            </div>

            {/* Scroll down to comments */}
            <a href="#comments-section"> <Button variant="ghost" size="xl" className="px-2!"> <MessageCircle className="w-7! h-7!" /> </Button> </a>
            {/* Share Button */}
            <Button variant="ghost" size="xl" className="px-2!">
              <Share className="w-7! h-7!" />
            </Button>

            {/* More Options */}
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
            <Button variant="destructive" size="xl" onClick={handleSavePost} disabled={saveStatus === "pending"}>
              Save
              {saveStatus === "pending" && <Spinner className="size-5 ml-2" />}
            </Button>
          </div>
        </div>
        <div className="flex justify-center w-full max-w-120 h-max relative mb-4 min-h-100">
          <Image item={{ ...post.data, w: 736 }} />

          <div className="absolute bottom-2 flex justify-between items-end w-full px-4">
            <Badge className="bg-gray-800 h-max py-3 px-6 rounded-xl text-md" >AI modified</Badge>
            <div className="flex flex-col gap-2">
              <Button className="rounded-xl bg-gray-400" variant="secondary" size="xl" onClick={() => setIsOpen(true)}>
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
    </>
  )
}

export default Post