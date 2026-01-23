import useEditorStore from "@/lib/editorStore";
import { BookA, ChevronDown, TextAlignCenter, TextAlignStart } from "lucide-react";
import { useState } from "react";
import CustomSwitch from "../customSwitch/CustomSwitch";
import Compact from "@uiw/react-color-compact";
import Image from "../image/Image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";

const LAYERS = {
  canvas: "Orientation",
  image: "Image",
  text: "Font"
}

const Options = () => {
  const { selectedLayer, setTextOptions } = useEditorStore();
  const [allignment, setAlignment] = useState<boolean>(true);
  const [highlight, setHighlight] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#ff0000");
  return (
    <div className="flex-1 flex flex-col min-h-196 w-full border-2 border-red-600 p-4 gap-4">
      <h4 className="text-black font-bold text-md">{LAYERS[selectedLayer.type]}</h4>
      <div>
        <Image />
        <div className="flex flex-col gap-8 font-bold">
          <div className="w-full flex justify-between items-center">
            <p className="flex-1">Font size</p>
            <Input
              className="flex-3 font-normal max-w-22 border-2 rounded-4xl"
              value={selectedLayer.textOptions?.fontSize || 36}
              onChange={(e: any) => {
                if (e.target.value < 0 || e.target.value > 200) return;
                return setTextOptions({ ...selectedLayer.textOptions!, fontSize: Number(e.target.value) })
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p>Alignment</p>
            {/* <Switch /> */}
            <CustomSwitch
              leftIcon={<TextAlignStart />}
              rightIcon={<TextAlignCenter />}
              state={allignment}
              setState={setAlignment}
            />
          </div>
          <div className="flex justify-between items-center">
            <p>Colour</p>
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <DropdownMenuTrigger className="flex justify-center  cursor-pointer">
                  <div className="flex w-22 h-10 overflow-hidden rounded-4xl p-0.5 bg-black/20">
                    <div className={`flex-3 rounded-4xl rounded-r-none`} style={{ backgroundColor: selectedColor }}></div>
                    <div className="flex-2 flex justify-center items-center">
                      <ChevronDown className="text-black/50" size={16} />
                    </div>
                  </div>
                </DropdownMenuTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Compact className="" color={selectedColor} onChange={(color) => {
                    console.log("color.hex", color.hex);

                    return setSelectedColor(color.hex)
                  }} />
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-between items-center">
            <p>Highlight</p>
            <CustomSwitch
              leftIcon={<BookA className="text-black/50" />}
              rightIcon={<BookA className="text-white bg-black/50" />}
              state={highlight}
              setState={setHighlight}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Options
