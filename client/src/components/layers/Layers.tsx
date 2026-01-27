import { ASSETS } from "@/assets";
import useEditorStore from "@/lib/editorStore";
import type { Layer } from "@/types";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

const Layers = () => {
  const navigate = useNavigate();
  const { selectedImage, selectedLayer, allLayers, setSelectedLayer: setLayer, addLayer, removeLayer } = useEditorStore();
  const { TEXT_IMG } = ASSETS

  useEffect(() => {
    if (!selectedImage) {
      navigate("/create")
    }
  }, [selectedImage, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between min-h-196 w-full p-2">
      <div className="my-4 flex flex-col w-full gap-4">
        <div className="flex flex-col gap-2 mb-4">
          <h4 className="font-semibold text-md">Layers
            <span className="text-black/80 ml-2">{allLayers.length} of 10
            </span>
          </h4>
          <p className="text-sm">Select a layer to edit</p>
        </div>
        <div className="flex flex-col gap-2">
          {allLayers.map((layer: Layer) => (

            <div
              key={layer.id}
              className={`flex rounded-2xl min-h-16 w-full p-2 justify-between gap-2 items-center cursor-pointer ${selectedLayer.id === layer.id ? "bg-black/5 border border-black" : ""}`}
              onClick={() => {
                return setLayer(layer)
              }}
            >
              <div className="flex items-center gap-2">
                {layer.type !== "canvas" ?
                  <img src={layer.type === "text" ? TEXT_IMG : selectedImage} loading="eager" className="rounded-md max-w-12 h-12 max-h-12" />
                  :
                  <div className="rounded-md border-gray-400 border-2 w-20 h-20  max-w-12 max-h-12 bg-blue-500"></div>
                }
                <p className="text-sm">{layer.name}</p>
              </div>

              {layer.type === "text" &&
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLayer(layer.id)
                    setLayer({ id: 2, name: "Canvas", type: "canvas" });
                    return
                  }}
                >
                  <Trash2 />
                </Button>
              }
            </div>

          ))}

        </div>
      </div>

      <Button
        size="xl"
        className="mt-4 w-full bg-black/10 hover:bg-black/20 text-black text-lg font-semibold"
        onClick={() => addLayer()} disabled={allLayers.length >= 10
        }>
        Add text Layer
      </Button>

    </div>
  )
}

export default Layers