import Gallery from "@/components/gallery/Gallery"
import ProfileHeader from "@/components/profileHeader/ProfileHeader"
import SavedBoard from "@/components/savedBoard/SavedBoard"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useGetAllPins } from "@/hooks/queries/pin.queries"
import { useGetUser } from "@/hooks/queries/user.queries"
import { useState } from "react"
import { useParams } from "react-router"

const ProfilePage = () => {
  const { id } = useParams()
  const [selectedCollection, setSelectedCollection] = useState("created")

  const { data: userData, status: statusUser, error: errorUser, } = useGetUser(id || "");

  const { data: pinsResponse, status, error, hasNextPage, fetchNextPage } = useGetAllPins({ userId: userData?.data?._id || "" });

  const allPins = pinsResponse?.pages.flatMap((page) => page.data) || []

  if (statusUser === "pending") {
    return (
      <div className="flex justify-center mt-60">
        <Spinner className="size-12" />
      </div>
    )
  }

  if (statusUser === "error") {
    return <div>{errorUser.message}</div>
  }


  return (
    <div className="flex flex-col">
      <ProfileHeader
        avatarUrl={userData.data?.img || ""}
        name={userData.data?.displayName || ""}
        username={userData.data?.username || ""}
        followers={userData.data?.followers || 0}
        following={userData.data?.following || 0}
        isFollowing={userData.data?.isFollowing || false}
        monthlyViews=""
        bio=""
      />
      {status === "pending" ? (
        <div className="w-full flex mt-6 justify-center">
          <Spinner />
        </div>
      ) : status === "error" ? (
        <div>{error.message}</div>
      ) : (
        <div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button onClick={() => setSelectedCollection("created")} variant="ghost" className={`hover:bg-transparent! text-md font-semibold ${selectedCollection === "created" && "underline underline-offset-8 decoration-2"}`} >
              Created
            </Button>
            <Button onClick={() => setSelectedCollection("saved")} variant="ghost" className={`hover:bg-transparent! text-md font-semibold ${selectedCollection === "saved" && "underline underline-offset-8 decoration-2"}`} >
              Saved
            </Button>
          </div>
          {selectedCollection === "created" ?
            (<Gallery data={allPins} loadMore={fetchNextPage} hasNextPage={hasNextPage} />)
            : (<SavedBoard userId={id || ""} />)}
        </div>
      )}
    </div>
  )
}

export default ProfilePage