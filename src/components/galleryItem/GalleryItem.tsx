import { Card } from "../ui/card"

type GalleryItemProps = {
  media: string;
  width: number;
  height: number;
}

const GalleryItem = (props: GalleryItemProps) => {
  const { media, width, height } = props;
  return (
    <div>
      <Card className="flex border-0 rounded-lg p-0" style={{ gridRowEnd: `span ${Math.ceil(height / 100)}` }}>
        <img className="w-full rounded-lg object-cover" src={media} alt="N/A" />
      </Card>
    </div>
  )
}

export default GalleryItem