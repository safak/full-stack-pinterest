import { cn, getImageUrl } from "@/lib/utils"
import { Pencil, Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"
import type { UploadedFile } from "../pinCreationForm/PinCreationForm"
import { Button } from "../ui/button"

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB for images
const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200MB for videos
const ACCEPTED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4"],
}

const ImagePicker = ({
  uploadedFile,
  setUploadedFile,
  setFileError,
  setIsEditing,
  showEditButton = true,
  requestStatus,
}: {
  uploadedFile: UploadedFile | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>;
  setFileError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  showEditButton?: boolean;
  requestStatus?: string;
}) => {

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    setFileError(null)

    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      if (error.code === "file-too-large") {
        setFileError("File is too large. Max size is 20MB for images and 100MB for videos.")
      } else if (error.code === "file-invalid-type") {
        setFileError("Invalid file type. Please upload a .jpg, .png, .gif, .webp, or .mp4 file.")
      }
      return
    }
    if (!uploadedFile?.preview) {

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const isVideo = file.type.startsWith("video/")
        const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_FILE_SIZE

        if (file.size > maxSize) {
          setFileError(`File is too large. Max size is ${isVideo ? "100MB" : "20MB"}.`)
          return
        }

        setUploadedFile({
          file,
          preview: URL.createObjectURL(file),
        })
      }
    }

  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        `relative flex ${showEditButton && "min-h-100"}  cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors`,
        isDragActive
          ? "border-primary bg-primary/5"
          : `border-transparent ${showEditButton && "bg-[#e9e9e9]"} hover:bg-[#ddd]`,
        uploadedFile && "border-none p-0",
      )}
    >
      <input {...getInputProps()} disabled={requestStatus ? requestStatus === "pending" : false} />

      {uploadedFile ? (
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          {uploadedFile.file.type.startsWith("video/") ? (
            <video src={uploadedFile.preview} className="h-full w-full object-cover" controls />
          ) : (
            <img
              src={getImageUrl(uploadedFile.preview)}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          )}
          {showEditButton && (
            <Button
              disabled={requestStatus ? requestStatus === "pending" : false}
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
                return
              }}
              className="absolute right-2 top-2 rounded-full! bg-white/80 transition-colors hover:bg-white"
              variant="default"
              size={"icon-lg"}
            >
              <Pencil className="text-black" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <div className="rounded-full border-2 border-foreground p-2">
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium">
            Choose a <span className="underline">file</span> or drag and drop it here
          </p>
          <p className="mt-16 text-xs text-muted-foreground">
            We recommend using high-quality .jpg files less than 20 MB or .mp4 files less than 200 MB.
          </p>
        </div>
      )
      }
    </div >
  )
}

export default ImagePicker