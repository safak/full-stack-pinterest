import { ArrowUpRight, Upload } from "lucide-react";
import type { CSSProperties } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import { useCheckPinInteraction } from "@/hooks/queries/pin.queries";
import useAuthStore from "@/lib/authStore";
import type { Pin } from "@/types";
import Image from "../image/Image";
import { Spinner } from "../ui/spinner";
import "./galleryItem.css";
import { useInteractPin } from "@/hooks/mutations/pin.mutations";


const GalleryItem = ({ item, className, style }: { item: Pin; className?: string; style?: CSSProperties }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore()
  const { data: pinInteractions, status } = useCheckPinInteraction(item._id!);
  const { mutate: interactPin, status: interactStatus } = useInteractPin(item._id!);

  const handlePinLiked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    interactPin("save");
  }


  if (status === "pending") {
    return (
      <div className="py-12 w-full h-full flex justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <Card
      style={style}
      className={`block hover:flex hover:items-center h-max border-0 rounded-lg p-0 relative gallery-item hover:min-h-33.75 ${className ?? ""}`}
    >
      <Image item={item} />
      {/* Overlay */}
      <div
        onClick={() => navigate(`/pin/${item._id}`)}
        className={`absolute bg-black/30 rounded-lg top-0 left-0 flex-col justify-between w-full h-full p-4 overlay`} >
        <div className="flex-1 w-full">
          <Button
            onClick={handlePinLiked}
            variant="destructive"
            className="rounded-xl float-right py-6 text-lg"
            disabled={interactStatus === "pending"}
          >
            {pinInteractions?.data.isSaved ? "Saved" : "Save"}
            {interactStatus === "pending" && <Spinner className="ml-2 size-4" />}
          </Button>
        </div>
        <div className="flex-1 flex w-full items-end justify-between gap-2">
          <Link to={item.likes as any || "#"}>
            <Button
              onClick={(e) => e.stopPropagation()}
              variant="secondary"
              className="rounded-lg left-right"
            >
              <ArrowUpRight />
              Visit site
            </Button>
          </Link>
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
  )
}

export default GalleryItem