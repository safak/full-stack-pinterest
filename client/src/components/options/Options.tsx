import useEditorStore from "@/lib/editorStore";
import { useState } from "react";
import ImagePicker from "../imagePicker/ImagePicker";
import TextOptionsPanel from "../textOptionsPanel/TextOptionsPanel";
import CanvasPanelOptions from "../canvasPanelOptions/CanvasPanelOptions";


const LAYERS = {
  canvas: "Orientation",
  image: "Image",
  text: "Text"
}

const Options = () => {
  const { selectedLayer, selectedImage, setSelectedImage } = useEditorStore();
  const [fileError, setFileError] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col min-h-196 w-full p-4 gap-4">
      <h4 className="text-black font-bold text-md">{LAYERS[selectedLayer.type]}</h4>
      {selectedLayer.type === "text" ? (
        // Text Options
        <TextOptionsPanel />
      ) : selectedLayer.type === "image" ? (
        // Image Options
        <div className="flex relative justify-center items-center">
          <div className="flex relative justify-center items-center">
            <ImagePicker
              uploadedFile={selectedImage ? { file: new File([], ""), preview: selectedImage } : null}
              setUploadedFile={(setFile) => {
                if (setFile && typeof setFile === "object") {
                  setSelectedImage(setFile.preview);
                }
              }}
              setFileError={setFileError}
              setIsEditing={() => { }}
              showEditButton={false}
            />
          </div>
          {fileError && <div className="text-red-500">{fileError}</div>}
        </div>
      ) : (
        // Canvas Options
        <div><CanvasPanelOptions /></div>
      )}
    </div>
  )
}

export default Options