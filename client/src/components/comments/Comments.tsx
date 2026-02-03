import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeleteComment, useUpdateComment } from "@/hooks/mutations/comment.mutations";
import { useGetComments } from "@/hooks/queries/comment.queries";
import useAuthStore from "@/lib/authStore";
import type { PostType } from "@/types";
import { ChevronDown, ChevronUp, Ellipsis, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { format } from "timeago.js";
import CommentField from "../commentField/CommentField";
import EditCommentForm from "../editCommentForm/EditCommentForm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";

export default function Comments({ post }: { post: PostType }) {
  const { data: comments, status, error } = useGetComments(post._id)
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: updateComment } = useUpdateComment()
  const { currentUser } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentsToShow, setCommentsToShow] = useState(1);
  const [isEditing, setIsEditing] = useState<{ commentId: string, editing: boolean }>({ commentId: "", editing: false });

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

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId, {
      onSuccess: () => {
        console.log("Comment deleted successfully");
      },
      onError: (error) => {
        console.error("Error deleting comment:", error.message);
      }
    });

  }

  const handleExpandComments = () => {
    setCommentsToShow(isExpanded ? 1 : comments?.data.length);
    setIsExpanded(!isExpanded);
  }

  const handleLikeComment = (commentId: string) => {
    if (!currentUser?._id) return;
    const commentLikes = comments.data.find(comment => comment._id === commentId)?.likes || [];
    const hasLiked = commentLikes.includes(currentUser._id);
    const updatedLikes = hasLiked
      ? commentLikes.filter((userId) => userId !== currentUser._id)
      : [...commentLikes, currentUser._id];

    updateComment({ commentId, payload: { likes: updatedLikes } }, {
      onSuccess: () => {
      },
      onError: (error) => {
        console.error("Error updating likes:", error.message);
      }

    });
  }

  return (
    <>
      <div id="comments-section" className="flex flex-col justify-center items-center w-full">
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
        {post.description && (
          <div className="flex-1 flex justify-start w-full mb-4">
            <p className="text-sm text-black/80 font-semibold mr-1 capitalize">
              {post.description}
            </p>
          </div>
        )}
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

                {isEditing.editing && currentUser?._id && isEditing.commentId === comment._id && currentUser._id === comment.user._id ? (
                  <EditCommentForm isEditing={isEditing} setIsEditing={setIsEditing} />
                ) : (
                  <>
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
                      <p className="capitalize">
                        {typeof comment.description === 'string' && comment.description.startsWith('sticker::') ? (
                          <img src={comment.description.replace('sticker::', '')} alt="sticker" className="max-w-xs rounded-lg" />
                        ) : (
                          comment.description
                        )}
                      </p>

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

                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Button
                          variant={"ghost"}
                          size="icon"
                          className="h-8 w-8 hover:bg-transparent p-0!"
                          onClick={() => handleLikeComment(comment?._id || "")}
                        >
                          <Heart className={`h-4 w-4 ${comment.likes && comment.likes.includes(currentUser?._id || "") ? "text-red-500 fill-red-500" : ""}`} />
                        </Button>
                        {comment?.likes && comment.likes?.length > 0 && (
                          <span className="text-xs font-semibold">{comment?.likes.length}</span>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="px-2! py-0!">
                            <Ellipsis className="w-4! h-4!" />
                          </Button>
                        </DropdownMenuTrigger>
                        {comment.user._id === currentUser?._id ? (
                          // For own comments
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsEditing({ commentId: comment._id ?? "", editing: true })}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteComment(comment._id ?? "")}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        ) : (
                          // For others' comments
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsEditing({ commentId: comment._id ?? "", editing: true })}>
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        )}
                      </DropdownMenu>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        {currentUser?._id && <CommentField postId={post._id} userId={currentUser._id} />}
      </div>
    </>
  );
}
