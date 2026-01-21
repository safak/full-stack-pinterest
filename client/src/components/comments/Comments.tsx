import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import CommentField from "../commentField/CommentField";
import { Separator } from "../ui/separator";
import type { PostType } from "@/types";
import { Link } from "react-router";
import { useGetComments } from "@/hooks/queries/comment.queries";
import { Spinner } from "../ui/spinner";
import { format } from "timeago.js"
import useAuthStore from "@/lib/auth-store";
import { useState } from "react";

export default function Comments({ post }: { post: PostType }) {
  const { data: comments, status, error } = useGetComments(post._id)
  const { currentUser } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentsToShow, setCommentsToShow] = useState(1);

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

  const handleExpandComments = () => {
    setCommentsToShow(isExpanded ? 1 : comments?.data.length);
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Link className="flex w-full" to={"/user/" + post?.user?._id}>
        <div className="flex items-center gap-2 w-full mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post?.user?.img ?? ""} />
            <AvatarFallback className="text-xs">
              {post.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="text-sm font-semibold mr-1 capitalize">
              {post.user.displayName || post.user.username}
            </p>
          </div>
        </div>
      </Link>
      <Separator />
      <div className={`w-full max-w-xl rounded-2xl bg-white p-4`}>
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">{comments.data.length || 0} Comments</p>
          <Button variant="ghost" size="sm" className="h-auto px-0 text-xs" onClick={handleExpandComments}>
            {isExpanded ? <ChevronUp className="ml-auto" /> : <ChevronDown className="ml-auto" />}
          </Button>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {comments.data.slice(0, commentsToShow).map((comment) => (
            <div key={comment._id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.img || ""} />
                <AvatarFallback className="text-xs">
                  {comment.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-sm">
                <p>
                  <span className="font-semibold mr-1">
                    {comment.user.displayName || comment.user.username}
                  </span>
                </p>
                <p className="capitalize">{comment.description}</p>

                <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{format(comment?.createdAt || "")}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 text-xs"
                  >
                    Reply
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      {currentUser?._id && <CommentField postId={post._id} userId={currentUser._id} />}
    </div>

  );
}
