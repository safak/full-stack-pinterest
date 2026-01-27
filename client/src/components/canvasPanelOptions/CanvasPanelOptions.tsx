import { Button } from "@/components/ui/button";
import useEditorStore from "@/lib/editorStore";
import Compact from "@uiw/react-color-compact";
import { ChevronDown, RectangleHorizontal, RectangleVertical } from "lucide-react";
import CustomSwitch from "../customSwitch/CustomSwitch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

import type { CanvasSizeOption } from "@/types";
import { ButtonGroup } from "../ui/button-group";
import { useEffect, useState } from "react";



const landscapeOptions: CanvasSizeOption[] = [
  { name: "2:1", width: 2, height: 1 },
  { name: "16:9", width: 16, height: 9 },
  { name: "3:2", width: 3, height: 2 },
  { name: "4:3", width: 4, height: 3 },
  { name: "5:4", width: 5, height: 4 },
  { name: "1:1", width: 1, height: 1 },
]

const portraitOptions: CanvasSizeOption[] = [
  { name: "1:2", width: 1, height: 2 },
  { name: "9:16", width: 9, height: 16 },
  { name: "2:3", width: 2, height: 3 },
  { name: "3:4", width: 3, height: 4 },
  { name: "4:5", width: 4, height: 5 },
  { name: "1:1", width: 1, height: 1 },
]

const CanvasPanelOptions = () => {
  const [sizes, setSizes] = useState<CanvasSizeOption[]>(landscapeOptions);
  const { selectedLayer, setCanvasOptions } = useEditorStore();
  
  const handleSetCanvasOptions = (option: string, value: any) => {
    setCanvasOptions({ ...selectedLayer.canvasOptions!, [option]: value })
  }

  if (!selectedLayer.canvasOptions) {
    return null
  }

  useEffect(() => {
    if (selectedLayer.canvasOptions!.orientation === "landscape") {
      setSizes(landscapeOptions);
    } else {
      setSizes(portraitOptions);
    }
  }, [selectedLayer.canvasOptions!.orientation])

  return (
    <div>
      <div className="flex flex-col gap-8 font-bold">
        <div className="flex justify-between items-center">
          <CustomSwitch
            leftIcon={<RectangleVertical />}
            rightIcon={<RectangleHorizontal />}
            state={selectedLayer.canvasOptions.orientation === "portrait" ? true : false}
            setState={(value) => { setCanvasOptions({ ...selectedLayer.canvasOptions!, orientation: value ? "portrait" : "landscape" }) }}
          />
        </div>

        <div className="flex flex-col gap-4 justify-between items-start">
          <p>Size</p>
          <ButtonGroup className="flex max-w-60 bg-black/10 rounded-xl p-1">
            <Button
              variant="ghost"
              size="lg"
              className={`flex-1 px-1 rounded-lg! ${selectedLayer.canvasOptions && selectedLayer.canvasOptions.size.name === "original" ? "bg-black/80 text-white" : ""}`}
              onClick={() => setCanvasOptions({ ...selectedLayer.canvasOptions!, size: { name: "original", height: 0, width: 0 } })}
            >
              Original
            </Button>
            {sizes.map((s) => (
              <Button
                key={s.name}
                variant="ghost"
                size="lg"
                className={`flex-1 px-1 rounded-lg! ${selectedLayer.canvasOptions && selectedLayer.canvasOptions.size.name === s.name ? "bg-black/80 text-white" : ""}`}
                onClick={() => setCanvasOptions({ ...selectedLayer.canvasOptions!, size: s })}
              >
                {s.name === "original" ? "Original" : s.name}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <div className="flex flex-col justify-between items-start gap-4">
          <p>Background Colour</p>
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <DropdownMenuTrigger className="flex justify-center  cursor-pointer">
                <div className="flex w-22 h-10 overflow-hidden rounded-4xl p-0.5 bg-black/20">
                  <div className={`flex-3 rounded-4xl rounded-r-none`} style={{ backgroundColor: selectedLayer.canvasOptions?.backgroundColor }}></div>
                  <div className="flex-2 flex justify-center items-center">
                    <ChevronDown className="text-black/50" size={16} />
                  </div>
                </div>
              </DropdownMenuTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Compact
                  color={selectedLayer.canvasOptions?.backgroundColor}
                  onChange={(color) => handleSetCanvasOptions("backgroundColor", color.hex)}
                />
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div >
  )
}

export default CanvasPanelOptions

