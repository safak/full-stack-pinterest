import { ArrowUpRight, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useNavigate } from "react-router";
import type { CSSProperties } from "react";

import "./galleryItem.css";
import Image from "../image/Image";


export type GalleryItemProps = {
  id: number | string;
  media: string;
  width: number;
  height: number;
}

const GalleryItem = ({ item, className, style }: { item: GalleryItemProps; className?: string; style?: CSSProperties }) => {
  const navigate = useNavigate();

  return (
    <Card style={style} className={`block hover:flex h-max border-0 rounded-lg p-0 relative gallery-item ${className ?? ""}`} >

      <Image item={item} />
      {/* Overlay */}
      <div
        onClick={() => navigate(`/pin/${item.id}`)}
        className={`absolute bg-black/30 rounded-lg top-0 left-0 flex-col justify-between w-full h-full p-4 overlay`} >
        <div className="flex-1 w-full">
          <Button
            onClick={(e) => e.stopPropagation()}
            variant="destructive"
            className="rounded-xl float-right py-6 text-lg"
          >
            Save
          </Button>
        </div>
        <div className="flex-1 flex w-full items-end justify-between gap-2">
          <Button
            onClick={(e) => e.stopPropagation()}
            variant="secondary"
            className="rounded-lg left-right"
          >
            <ArrowUpRight />
            Visit site
          </Button>
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