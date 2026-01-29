
import useEditorStore from "@/lib/editorStore";
import Compact from "@uiw/react-color-compact";
import { BookA, ChevronDown, TextAlignCenter, TextAlignStart } from "lucide-react";
import CustomSwitch from "../../customSwitch/CustomSwitch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Input } from "../../ui/input";


const TextOptionsPanel = () => {

  const { selectedLayer, setTextOptions } = useEditorStore();
  const handleSetTextOptions = (option: string, value: any) => {
    setTextOptions({ ...selectedLayer.textOptions!, [option]: value })
  }

  return (
    <div>
      <div className="flex flex-col gap-8 font-bold">
        <div className="w-full flex justify-between items-center">
          <p className="flex-1">Font size</p>
          <Input
            type="number"
            className="flex-3 font-normal max-w-22 border-2 rounded-4xl"
            value={selectedLayer.textOptions?.fontSize || 36}
            onChange={(e: any) => {
              if (e.target.value < 0 || e.target.value > 200) return;
              return handleSetTextOptions("fontSize", Number(e.target.value))
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <p>Alignment</p>
          {/* <Switch /> */}
          <CustomSwitch
            leftIcon={<TextAlignStart />}
            rightIcon={<TextAlignCenter />}
            state={selectedLayer.textOptions?.alignment === "left" ? true : false}
            setState={() => handleSetTextOptions("alignment", selectedLayer.textOptions?.alignment === "left" ? "center" : "left")}
          />
        </div>
        <div className="flex justify-between items-center">
          <p>Colour</p>
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <DropdownMenuTrigger className="flex justify-center  cursor-pointer">
                <div className="flex w-22 h-10 overflow-hidden rounded-4xl p-0.5 bg-black/20">
                  <div className={`flex-3 rounded-4xl rounded-r-none`} style={{ backgroundColor: selectedLayer.textOptions?.color }}></div>
                  <div className="flex-2 flex justify-center items-center">
                    <ChevronDown className="text-black/50" size={16} />
                  </div>
                </div>
              </DropdownMenuTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Compact
                  color={selectedLayer.textOptions?.color}
                  onChange={(color) => handleSetTextOptions("color", color.hex)}
                />
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-between items-center">
          <p>Highlight</p>
          <CustomSwitch
            leftIcon={<BookA className="text-black/50" />}
            rightIcon={<BookA className="text-white bg-black/50" />}
            state={selectedLayer.textOptions?.highlight || false}
            setState={(value) => handleSetTextOptions("highlight", value)}
          />
        </div>
      </div>
    </div>
  )
}

export default TextOptionsPanel