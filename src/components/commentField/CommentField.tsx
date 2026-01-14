import EmojiPicker from 'emoji-picker-react';
import { Image, Smile, Sticker } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Input } from '../ui/input';

const CommentField = () => {
  return (
    <div className="w-full h-full min-w-50 rounded-4xl border-2 flex justify-start items-center py-1 px-2">
      <Input
        placeholder="Add a comment to start conversation"
        className="text-lg! font-medium"
      />
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
    </div>
  )
}

export default CommentField