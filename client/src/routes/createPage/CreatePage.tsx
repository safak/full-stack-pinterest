import Editor from "@/components/editor/Editor";
import { PinCreationForm } from "@/components/pinCreationForm/PinCreationForm";
import { Button } from "@/components/ui/button";
import { useGetAllPins } from "@/hooks/queries/pin.queries";
import { useGetAllUsers } from "@/hooks/queries/user.queries";
import useAuthStore from "@/lib/authStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const CreatePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?._id) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  const { data, isLoading, isError } = useGetAllPins()
  const users = useGetAllUsers()

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Something went wrong!</div>
  }
  return (
    <div>
      {/* Top */}
      <div className="flex border-b-3 w-full h-20 justify-between items-center px-4">
        <h1 className="font-bold text-xl">{isEditing ? "Design your Pin" : "Create Pin"}</h1>
        <Button variant="destructive" size="xl" className="flex items-center gap-2">
          {isEditing ? "Done" : "Publish"}
        </Button>
      </div>
      {isEditing ? (
        <Editor />
      ) : (
        <PinCreationForm isEditing={isEditing} setIsEditing={setIsEditing} />
      )}
    </div>
  )
}

export default CreatePage

