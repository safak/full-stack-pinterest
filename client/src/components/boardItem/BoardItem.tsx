import { ChevronDown, Trash, Upload } from "lucide-react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import { useInteractPin } from "@/hooks/mutations/pin.mutations";
import useAuthStore from "@/lib/authStore";
import type { Pin } from "@/types";
import Image from "../image/Image";
import "./BoardItem.css";

const BoardItem = ({ item, className, style }: { item: Pin; className?: string; style?: CSSProperties }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { mutate: interactPin, status } = useInteractPin(item._id!);

  const handleRemovePin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    interactPin("save");
  }

  return (
    <div>
      <Card style={style} className={`block hover:flex h-max border-0 rounded-lg p-0 relative shadow-none collection-item ${className ?? ""}`} >
        <Image item={item} />
        {/* Overlay */}
        <div
          onClick={() => navigate(`/pin/${item._id}`)}
          className={`absolute bg-black/30 rounded-lg top-0 left-0 flex-col justify-between w-full h-full p-4 overlay`} >
          <div className="flex-1 w-full flex items-start justify-between gap-2 ">
            <Button
              onClick={(e) => e.stopPropagation()}
              variant="ghost"
              className="rounded-lg text-white hover:bg-white/30 hover:text-white"
            >
              Profile
              <ChevronDown />
            </Button>
            {currentUser && <Button
              onClick={handleRemovePin}
              variant="destructive"
              className="rounded-full float-right py-2 text-xs"
              size={"icon-sm"}
              disabled={status === "pending"}
            >
              <Trash size={6} />
            </Button>}
          </div>
          <div className="flex-1 w-full flex justify-end items-end">
            <Button
              onClick={(e) => e.stopPropagation()}
              variant="secondary"
              className="rounded-lg"
            >
              <Upload size={9} />
            </Button>
          </div>
        </div>
      </Card >
      {/* <div className="w-full flex justify-end">
        <Button variant="ghost" size={"icon"} className="py-0!">
          <Ellipsis className="w-5! h-5!" />
        </Button>
      </div> */}
    </div>
  )
}

export default BoardItem