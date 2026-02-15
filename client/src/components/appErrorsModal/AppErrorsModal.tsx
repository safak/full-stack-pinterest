import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from '../ui/button';

const AppErrorsModal = ({
  open,
  setOpen,
  status,
  title,
  description
}: {
  open: boolean,
  setOpen: (open: boolean) => void,
  status?: number,
  title?: string,
  description?: string
}) => {

  if (!title && !description) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || ""}</DialogTitle>
          <DialogDescription className="mt-4 flex flex-col">
            {description || ""}
            {status && <span className="mt-2 text-sm text-gray-500">Status Code: {status}</span>}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}

export default AppErrorsModal