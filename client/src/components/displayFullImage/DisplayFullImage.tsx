import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import type { PostType } from "@/types";
import Image from "../image/Image";

const DisplayFullImage = ({ isOpen, setIsOpen, post }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; post: PostType }) => {

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)} >
      <DialogContent className="max-w-full max-h-full p-0 border-0" showCloseButton={false}>
        <div className="w-full">
          <Image
            item={{ ...post, w: post.width, h: post.height }} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DisplayFullImage