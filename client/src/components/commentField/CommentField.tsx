import { useCreateComment } from '@/hooks/mutations/comment.mutations';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Sticker } from 'lucide-react';
import { useState } from 'react';
import Pickers from '../pickers/Pickers';
import StickerPicker from '../stickerPicker/StickerPicker';
import { Input } from '../ui/input';

const CommentField = ({ postId, userId }: { postId: string, userId: string }) => {
  const [comment, setComment] = useState("");
  const { mutate: createComment } = useCreateComment();
  const [type, setType] = useState<string>('');
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [stickerPickerOpen, setStickerPickerOpen] = useState<boolean>(false);


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

  const handleSelectEmoji = (emojiData: any) => {
    setComment((prev) => prev + emojiData.emoji);
  }

  const handleSelectSticker = (stickerData: any) => {
    console.log("stickerData", stickerData);
    // extract best-available sticker url
    const url = stickerData?.images?.fixed_width?.url || stickerData?.images?.original?.url || stickerData?.images?.downsized?.url || stickerData?.url || ""
    if (!url) return

    setStickerPickerOpen(false);

    const newComment = {
      pin: postId,
      user: userId,
      description: `sticker::${url}`,
    }

    createComment(newComment, {
      onSuccess: () => {
        // no-op - nothing to clear for sticker
      }
    })
  }
  return (
    <div className="w-full h-full min-w-50 rounded-4xl border-2 flex justify-start items-center py-1 px-2">
      <form onSubmit={handleSubmit} className="flex flex-1">
        <Input
          value={comment}
          placeholder="Add a comment to start conversation"
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

        {/* Sticker picker */}
        <Pickers
          Icon={Sticker}
          Picker={
            <StickerPicker onSelect={handleSelectSticker} type={type} setType={setType} />
          }
          pickerOpen={stickerPickerOpen}
          setPickerOpen={setStickerPickerOpen}
        />
      </form>

      {/* <Button className="hover:bg-transparent p-1!" variant="ghost">
        <Image className="w-7! h-7!" />
      </Button> */}
    </div >
  )
}

export default CommentField