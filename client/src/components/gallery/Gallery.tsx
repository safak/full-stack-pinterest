import type { Pin } from "@/types";
import GalleryItem from "../galleryItem/GalleryItem"
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from "../ui/spinner";

export const items = [
  {
    id: 1,
    media: "/pins/pin1.jpeg",
    width: 1260,
    height: 1000,
  },
  {
    id: 2,
    media: "/pins/pin2.jpeg",
    width: 1260,
    height: 1400,
  },
  {
    id: 3,
    media: "/pins/pin3.jpeg",
    width: 1260,
    height: 1400,
  },
  {
    id: 4,
    media: "/pins/pin4.jpeg",
    width: 1260,
    height: 1000,
  },
  {
    id: 5,
    media: "/pins/pin5.jpeg",
    width: 1260,
    height: 1243,
  },
  {
    id: 6,
    media: "/pins/pin6.jpeg",
    width: 1260,
    height: 1568,
  },
  {
    id: 7,
    media: "/pins/pin7.jpeg",
    width: 1260,
    height: 1234,
  },
  {
    id: 8,
    media: "/pins/pin8.jpeg",
    width: 1260,
    height: 1400,
  },
  {
    id: 9,
    media: "/pins/pin9.jpeg",
    width: 1260,
    height: 1000,
  },
  {
    id: 10,
    media: "/pins/pin10.jpeg",
    width: 1260,
    height: 1000,
  },
  {
    id: 11,
    media: "/pins/pin11.jpeg",
    width: 1260,
    height: 1000,
  },
  {
    id: 12,
    media: "/pins/pin12.jpeg",
    width: 1260,
    height: 1400,
  },
  {
    id: 13,
    media: "/pins/pin13.jpeg",
    width: 1260,
    height: 1400,
  },
  {
    id: 14,
    media: "/pins/pin14.jpeg",
    width: 1260,
    height: 1600,
  },
  {
    id: 15,
    media: "/pins/pin15.jpeg",
    width: 1260,
    height: 1000,
  },
  {
    id: 16,
    media: "/pins/pin16.jpeg",
    width: 1260,
    height: 1260,
  },
  {
    id: 17,
    media: "/pins/pin17.jpeg",
    width: 1260,
    height: 1000,
  },
  {
    id: 18,
    media: "/pins/pin18.jpeg",
    width: 1260,
    height: 1260,
  },
  {
    id: 19,
    media: "/pins/pin19.jpeg",
    width: 1260,
    height: 1400,
  },
  {
    id: 20,
    media: "/pins/pin20.jpeg",
    width: 1260,
    height: 1260,
  },
  {
    id: 21,
    media: "/pins/pin21.jpeg",
    width: 1260,
    height: 1400,
  },
  {
    id: 22,
    media: "/pins/pin22.jpeg",
    width: 1260,
    height: 1890,
  },
  {
    id: 23,
    media: "/pins/pin23.jpeg",
    width: 1260,
    height: 1260,
  },
  {
    id: 24,
    media: "/pins/pin24.jpeg",
    width: 1260,
    height: 1260,
  },
  {
    id: 25,
    media: "/pins/pin25.jpeg",
    width: 1260,
    height: 1260,
  },
];

const Gallery = ({ data, hasNextPage, loadMore }: any) => {
  return (
    <InfiniteScroll
      dataLength={data.length}
      next={loadMore}
      hasMore={hasNextPage}
      loader={
        <div className="flex justify-center">
          <Spinner />
        </div>
      }
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>{data.length > 0 ? "That's all for now" : "Nothing to show"}</b>
        </p>
      }
    >
      <div className="w-full p-4 mx-auto py-8" >
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5 xl:columns-6 2xl:columns-7 gap-4 space-y-4" >
          {data.map((item: Pin) => (
            <GalleryItem key={item._id} item={item} />
          ))}
        </div>
      </div>
    </InfiniteScroll>
  )
}

export default Gallery