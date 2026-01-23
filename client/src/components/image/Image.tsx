import { Image as IkImage } from '@imagekit/react';

const ikUrlEndpoint = import.meta.env.VITE_IK_IMAGEKIT_URL;

type ImageItem = {
  media: string;
  loading?: "lazy" | "eager";
  alt?: string;
  w?: number
  h?: number
  className?: string;
}

type Props = {
  item?: ImageItem;
}

const Image = ({ item = { media: '', loading: "lazy", alt: "N/A", w: 372, className: "" } }: Props) => {
  return (
    <IkImage
      className={`w-full rounded-lg object-cover! ${item.className}`}
      urlEndpoint={ikUrlEndpoint}
      src={item.media}
      transformation={[
        { width: item.w },
      ]}
      loading={"lazy"}
      alt={item.alt}
    />
  )
}

export default Image
