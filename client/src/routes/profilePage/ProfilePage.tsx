import Gallery from "@/components/gallery/Gallery"
import ProfileHeader from "@/components/profileHeader/ProfileHeader"
import SavedCollection from "@/components/savedCollection/SavedCollection"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const ProfilePage = () => {

  const [selectedCollection, setSelectedCollection] = useState("created")

  return (
    <div className="flex flex-col">
      <ProfileHeader
        avatarUrl=""
        name="★ ° Zar ★ °"
        username="zrrbooks"
        followers="2.6k"
        following="10"
        monthlyViews="2.1m"
        bio="✧ dm for photo credit or removal ✧"
      />
      <div>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button onClick={() => setSelectedCollection("created")} variant="ghost" className={`hover:bg-transparent! text-md font-semibold ${selectedCollection === "created" && "underline underline-offset-8 decoration-2"}`} >
            Created
          </Button>
          <Button onClick={() => setSelectedCollection("saved")} variant="ghost" className={`hover:bg-transparent! text-md font-semibold ${selectedCollection === "saved" && "underline underline-offset-8 decoration-2"}`} >
            Saved
          </Button>
        </div>
        {selectedCollection === "created" ? (<Gallery />) : (<SavedCollection />)}
      </div>
    </div>
  )
}

export default ProfilePage