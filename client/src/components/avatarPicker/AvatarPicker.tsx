import { ASSETS } from "@/assets"
import { cn, getImageUrl } from "@/lib/utils"
import type { PostUser } from "@/types"
import { useDropzone } from "react-dropzone"
import type { UploadedFile } from "../pinCreationForm/PinCreationForm"

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB for images

const ACCEPTED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
}

const { NO_AVATAR } = ASSETS

const AvatarPicker = ({
  uploadedFile,
  setUploadedFile,
  setFileError,
  removedPicture,
  currentUser
}: {
  uploadedFile: UploadedFile | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>;
  setFileError: React.Dispatch<React.SetStateAction<string | null>>;
  removedPicture: boolean;
  currentUser?: PostUser;
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

      if (acceptedFiles.length > 0 && !acceptedFiles[0].type.startsWith("video/")) {
        const file = acceptedFiles[0]

        if (file.size > MAX_FILE_SIZE) {
          setFileError("File is too large. Max size is 20MB.")
          return
        }

        setUploadedFile({
          file,
          preview: URL.createObjectURL(file),
        })
      }
    }

  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        `flex cursor-pointer flex-col items-center justify-center rounded-full h-25 w-25 border-2 border-dashed border-black/40 overflow-hidden`,
      )}
    >
      <input {...getInputProps()} />

      {uploadedFile ? (
        <div className="h-full w-full overflow-hidden rounded-full">
          {(
            <img
              src={getImageUrl(uploadedFile.preview)}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      ) : removedPicture ? (
        <img
          src={NO_AVATAR}
          alt="No Avatar"
          className="h-full w-full object-fit"
        />
      ) : (
        <img
          src={currentUser?.img ? currentUser?.img : NO_AVATAR}
          alt="No Avatar"
          className="h-full w-full object-fit"
        />
      )
      }
    </div >
  )
}

export default AvatarPicker