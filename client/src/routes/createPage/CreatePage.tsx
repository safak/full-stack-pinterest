import AppErrorsModal from "@/components/appErrorsModal/AppErrorsModal";
import Editor from "@/components/editor/Editor";
import { PinCreationForm, type UploadedFile } from "@/components/pinCreationForm/PinCreationForm";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateImage } from "@/hooks/mutations/image.mutation";
import { useGetImages } from "@/hooks/queries/image.queries";
import useAuthStore from "@/lib/authStore";
import useEditorStore from "@/lib/editorStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const CreatePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const { currentUser } = useAuthStore();
  const { data: userImages, status: userImagesStatus, error: userImagesError } = useGetImages();
  const { selectedImage, allLayers, setSelectedImage } = useEditorStore();
  const navigate = useNavigate();
  const { mutate: updateImageMutate, status: updateImageStatus, error: updateImageError } = useUpdateImage();

  const currentSelectedImage = userImages?.data.find(image => {
    return image.media === selectedImage
  });

  const textOptions = allLayers
    .filter(layer => layer.type === "text")
    .map(layer => layer.textOptions!);

  useEffect(() => {
    if (!currentUser?._id) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  const handleEditAndPublish = () => {
    if (isEditing && currentSelectedImage && uploadedFile) {
      if (currentSelectedImage._id && uploadedFile) {
        updateImageMutate({
          imageId: currentSelectedImage._id,
          payload: {
            media: uploadedFile.preview,
            canvasOptions: allLayers.find(layer => layer.type === "canvas")?.canvasOptions,
            textOptions: textOptions,
          }
        }, {
          onSuccess: (response) => {
            setSelectedImage(response.data.media!);
            setUploadedFile({ file: new File([], ""), preview: response.data.media! });

          },
          onError: (error) => {
            console.error("Error updating image:", error);
          },
          onSettled: () => {
            setIsEditing(false);
          }
        })
      }
    }
  }

  if (userImagesStatus === "pending") {
    return <div className="w-full mt-12 flex justify-center items-center">
      <Spinner />
    </div>
  }

  if (userImagesStatus === "error") {
    return <AppErrorsModal open={true} setOpen={() => { navigate("/") }} title={`Error ${userImagesError.code || ""}`} description={userImagesError.message} />
  }

  if (updateImageStatus === "error") {
    return <AppErrorsModal open={true} setOpen={() => { navigate("/") }} title={`Error ${updateImageError.code || ""}`} description={updateImageError.message} />
  }

  return (
    <div>
      {/* Top */}
      <div className="flex border-b-3 w-full h-20 justify-between items-center px-4">
        <h1 className="font-bold text-xl">{isEditing ? "Design your Pin" : "Create Pin"}</h1>
        <Button
          variant="destructive"
          size="xl"
          className="flex items-center gap-2"
          disabled={updateImageStatus === "pending"}
          onClick={handleEditAndPublish}>
          {isEditing ? "Done" : "Publish"}
          {/* {updateImageStatus === "pending" || createPinStatus === "pending" && <Spinner />} */}
          {updateImageStatus === "pending" && <Spinner />}
        </Button>
      </div>
      {isEditing ? (
        <Editor />
      ) : (
        <PinCreationForm setIsEditing={setIsEditing} uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />
      )}
    </div>
  )
}

export default CreatePage

