import useEditorStore from "@/lib/editorStore";

import { useRef } from "react";
import { Input } from "../ui/input";

const Workspace = () => {
  const { selectedImage, selectedLayer, setTextOptions, allLayers } = useEditorStore()
  const textLayers = allLayers.filter(layer => layer.type === "text");
  const canvasLayer = allLayers.find(layer => layer.type === "canvas");

  const itemRef = useRef(null);
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setTextOptions({
      ...selectedLayer!.textOptions!,
      left: e.clientX - offset.current.x,
      top: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  const handleMouseLeave = () => {
    dragging.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    dragging.current = true;
    offset.current = {
      x: e.clientX - selectedLayer!.textOptions!.left,
      y: e.clientY - selectedLayer!.textOptions!.top,
    };
  };

  return (
    <div className="flex-3 flex justify-center items-center w-full p-2 bg-black/10 min-h-196">
      <div className="rounded-md overflow-hidden w-full md:w-93.75 h-full flex justify-center items-center">
        {/* Canvas background container: respects canvasOptions size and backgroundColor */}
        {canvasLayer ? (
          (() => {
            const { size, backgroundColor } = canvasLayer!.canvasOptions!;
            const isOriginal = size?.name === "original" || !size || (size.width === 0 && size.height === 0);
            const aspectStyle: Record<string, any> = {};
            if (!isOriginal && size && size.width > 0 && size.height > 0) {
              aspectStyle.aspectRatio = `${size.width} / ${size.height}`;
            }
            return (
              <div className="w-full max-w-93.75 flex justify-center items-center" style={{ padding: 8 }}>
                <div
                  className={`w-full rounded-md overflow-hidden flex justify-center items-center relative`}
                  style={{
                    backgroundColor: backgroundColor || "transparent",
                    ...aspectStyle,
                    width: "100%",
                    maxWidth: "100%",
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  ref={containerRef}
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      loading="eager"
                      className="w-full h-full object-contain"
                      style={{ display: "block" }}
                    />

                  ) : null}
                  {textLayers.length > 0 && textLayers.map((layer) => {
                    if (!layer.textOptions) return null;
                    const isSelected = layer.id === selectedLayer?.id;
                    const textOptions = layer.textOptions;

                    const layerStyle = {
                      top: textOptions.top,
                      left: textOptions.left,
                      color: !textOptions.highlight ? textOptions.color : "black",
                      background: textOptions.highlight ? `${textOptions.color}70` : "transparent",
                    };

                    const textStyle = {
                      textAlign: textOptions.alignment as "left" | "center",
                      fontSize: `${textOptions.fontSize}px`,
                    };

                    return (
                      <div
                        ref={itemRef}
                        key={layer.id}
                        className={`absolute w-max max-w-60 flex h-max resize-none z-50 py-1 px-4 ${isSelected ? "w-full border border-dashed border-black bg-white/70 resize-x cursor-col-resize " : ""}`}
                        style={layerStyle}
                        onMouseDown={handleMouseDown}
                      >
                        {isSelected ? (
                          <Input
                            style={textStyle}
                            className="text-inherit! bg-transparent outline-none border-0 p-0 cursor-grab h-full max-w-55"
                            value={textOptions.text || ""}
                            onChange={(e) => setTextOptions({ ...textOptions, text: e.target.value })}
                          />
                        ) : (
                          <p
                            style={textStyle}
                            className="w-full text-inherit! bg-transparent outline-none border-0 p-0 cursor-grab h-full wrap-break-word"
                          >
                            {textOptions.text}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
        ) : (
          <img src={selectedImage} loading="eager" className="w-full max-w-93.75 " />
        )}
      </div>
    </div>
  )
}

export default Workspace