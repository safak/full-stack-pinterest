import EmojiPicker from 'emoji-picker-react';
import { SendHorizontal, Smile, Sticker } from 'lucide-react';
import { useState } from 'react';
import Pickers from '../pickers/Pickers';
import StickerPicker from '../stickerPicker/StickerPicker';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const InputField = ({
  postId,
  userId,
  handleSubmit,
  input,
  setInput,
  inputType,
  addRequest,
  inputPlaceholder,
}: {
  postId?: string,
  userId: string,
  handleSubmit: any,
  input: string,
  setInput: React.Dispatch<React.SetStateAction<string>>
  inputType: string
  addRequest: any
  inputPlaceholder?: string,
}) => {
  const [type, setType] = useState<string>('');
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [stickerPickerOpen, setStickerPickerOpen] = useState<boolean>(false);

  const handleSelectEmoji = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji);
  }

  const handleSelectSticker = (stickerData: any) => {
    // extract best-available sticker url
    const url = stickerData?.images?.fixed_width?.url || stickerData?.images?.original?.url || stickerData?.images?.downsized?.url || stickerData?.url || ""
    if (!url) return

    setStickerPickerOpen(false);
    let newInput

    if (inputType === "comment" && postId) {
      newInput = {
        pin: postId,
        user: userId,
        description: `sticker::${url}`,
      }
      addRequest(newInput)
    } else if (inputType === "chat") {
      addRequest(`sticker::${url}`)
    }

  }
  return (
    <div className="w-full h-full min-w-50 rounded-4xl border-2 flex justify-start items-center py-1 px-2">
      <form onSubmit={handleSubmit} className="flex flex-1">
        <Input
          value={input}
          placeholder={inputPlaceholder || "Add a comment to start conversation"}
          className="text-lg! font-medium"
          onChange={(e) => setInput(e.target.value)}
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
        {input !== "" && (
          <Button type="submit" className="hover:bg-transparent p-1!" variant="ghost">
            <SendHorizontal className='w-6! h-6!' />
          </Button>
        )}
      </form>

      {/* <Button className="hover:bg-transparent p-1!" variant="ghost">
        <Image className="w-7! h-7!" />
      </Button> */}
    </div >
  )
}

export default InputField