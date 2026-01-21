import EmojiPicker from 'emoji-picker-react';
import { Image, Smile, Sticker } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { useState } from 'react';
import { useCreateComment } from '@/hooks/mutations/comment.mutations';

const CommentField = ({ postId, userId }: { postId: string, userId: string }) => {
  const [comment, setComment] = useState("");
  const { mutate: createComment } = useCreateComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedComment = comment.trim();
    if (trimmedComment) {
      const newComment = {
        pin: postId,
        user: userId,
        description: trimmedComment,
      };

      createComment(newComment, {
        onSuccess: () => {
          setComment("");
        }
      });
    }
  }
  return (
    <div className="w-full h-full min-w-50 rounded-4xl border-2 flex justify-start items-center py-1 px-2">
      <form onSubmit={handleSubmit} className="flex-1">
        <Input
          value={comment}
          placeholder="Add a comment to start conversation"
          className="text-lg! font-medium"
          onChange={(e) => setComment(e.target.value)}
        />
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="hover:bg-transparent p-1!" variant="ghost" >
            <Smile className="w-7! h-7!" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className='bg-white hover:bg-white!'>
          <DropdownMenuItem className='bg-white hover:bg-white!'>
            <EmojiPicker className='border-none!' />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button className="hover:bg-transparent p-1!" variant="ghost">
        <Sticker className="w-7! h-7!" />
      </Button>
      <Button className="hover:bg-transparent p-1!" variant="ghost">
        <Image className="w-7! h-7!" />
      </Button>
    </div >
  )
}

export default CommentField