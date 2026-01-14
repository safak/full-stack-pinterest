import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import CommentField from "../commentField/CommentField";
import { Separator } from "../ui/separator";

export type Comment = {
  id: string;
  username: string;
  text: string;
  time: string;
};

const comments: Comment[] = [
  {
    id: "1",
    username: "hatice an",
    text: "I use it",
    time: "4 mo",
  },
  {
    id: "1",
    username: "hatice an",
    text: "I use it",
    time: "4 mo",
  },
  {
    id: "1",
    username: "hatice an",
    text: "I use it",
    time: "4 mo",
  },
];

export default function Comments() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="flex items-center gap-2 w-full mb-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="text-xs">
            {"John Doe".charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <p className="text-sm font-semibold mr-1">
            {"John Doe"}
          </p>
        </div>
      </div>
      <Separator />
      <div className="w-full max-w-xl rounded-2xl bg-white p-4 ">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">1 comment</p>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {comment.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold mr-1">
                    {comment.username}
                  </span>
                  {comment.text}
                </p>

                <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{comment.time}</span>
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
      <CommentField />
    </div>

  );
}
