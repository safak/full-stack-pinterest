import { useUpdateComment } from '@/hooks/mutations/comment.mutations';
import EmojiPicker from 'emoji-picker-react';
import { Smile } from 'lucide-react';
import { useState } from 'react';
import Pickers from '../pickers/Pickers';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';

const EditCommentForm = ({ isEditing, setIsEditing }:
  {
    isEditing: { commentId: string, editing: boolean },
    setIsEditing: React.Dispatch<React.SetStateAction<{
      commentId: string,
      editing: boolean
    }>>
  }) => {

  const [comment, setComment] = useState("");
  const { mutate: updateComment, status } = useUpdateComment();
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  const handleSubmitEditComment = (e: any) => {
    e.preventDefault();
    // submit edited comment
    updateComment({ commentId: isEditing.commentId, payload: { description: comment } }, {
      onSuccess: () => {
        setComment("");
        setIsEditing({ commentId: "", editing: false });
      },
      onError: (error) => {
        console.error("Error updating likes:", error.message);
      }

    });
    setIsEditing({ commentId: "", editing: false });
  }


  const handleSelectEmoji = (emojiData: any) => {
    setComment((prev) => prev + emojiData.emoji);
  }

  return (
    <div id="edit-comments-section" className="flex w-full">
      <form className="flex w-full flex-col gap-2" onSubmit={handleSubmitEditComment}>
        <div className='w-full rounded-4xl border-2 flex justify-start items-center py-1 px-2'>
          <Input
            value={comment}
            placeholder={"reply"}
            className="text-lg! font-medium"
            onChange={(e) => setComment(e.target.value)}
          />

          {/* Emoji picker */}
          <Pickers
            Icon={Smile}
            Picker={
              <EmojiPicker onEmojiClick={handleSelectEmoji} />
            }
            stopPropagation={true}
            pickerOpen={pickerOpen}
            setPickerOpen={setPickerOpen}
          />
        </div>
        <div className="flex w-full justify-end gap-2 items-center">
          <Button variant="secondary" className="rounded-lg bg-gray-200" onClick={() => setIsEditing({ commentId: "", editing: false })}>cancel</Button>
          <Button type="submit" variant="destructive" className="rounded-lg" disabled={status === "pending" || !comment}>
            save
            {status === "pending" ? <Spinner className="size-5 ml-2" /> : null}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditCommentForm