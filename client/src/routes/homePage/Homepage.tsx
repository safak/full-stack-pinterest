import Gallery from "@/components/gallery/Gallery";
import { Spinner } from "@/components/ui/spinner";
import { useGetAllPins } from "@/hooks/queries/pin.queries";
import { useEffect } from "react";
import { useSearchParams } from "react-router";


function HomePage() {
  const [searchParams] = useSearchParams()
  const search = searchParams.get("search") || ""

  const { data: pinsResponse, refetch, status, error, hasNextPage, fetchNextPage } = useGetAllPins({ search });
  const allPins = pinsResponse?.pages.flatMap((page) => page.data) || []

  useEffect(() => {
    refetch()
  }, [search])

  if (status === "pending") {
    return (
      <div className="flex justify-center mt-60">
        <Spinner className="size-12" />
      </div>
    )
  }

  if (status === "error") {
    return <div>{error.message}</div>
  }

  return (
      <Gallery data={allPins} loadMore={fetchNextPage} hasNextPage={hasNextPage} />
  )
}

export default HomePage
