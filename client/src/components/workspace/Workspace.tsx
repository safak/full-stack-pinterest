import React, { useRef } from "react";
import useEditorStore from "@/lib/editorStore";

import { Input } from "../ui/input";

const Workspace = () => {
  const { selectedImage, selectedLayer, setTextOptions, allLayers } = useEditorStore()
  const textLayers = allLayers.filter(layer => layer.type === "text");

  // const dragRef = useRef<{
  //   dragging: boolean;
  //   startX: number;
  //   startY: number;
  //   startTop: number;
  //   startLeft: number;
  // } | null>(null);

  // const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
  //   if (!selectedLayer.textOptions) return;
  //   if (e.target !== e.currentTarget) return;
  //   (e.currentTarget as Element).setPointerCapture(e.pointerId);
  //   dragRef.current = {
  //     dragging: true,
  //     startX: e.clientX,
  //     startY: e.clientY,
  //     startTop: selectedLayer.textOptions.top,
  //     startLeft: selectedLayer.textOptions.left,
  //   };
  // };

  // const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
  //   const state = dragRef.current;
  //   if (!state || !state.dragging || !selectedLayer.textOptions) return;
  //   const dx = e.clientX - state.startX;
  //   const dy = e.clientY - state.startY;
  //   const newTop = Math.max(0, state.startTop + dy);
  //   const newLeft = Math.max(0, state.startLeft + dx);
  //   setTextOptions({ ...selectedLayer.textOptions!, top: newTop, left: newLeft });
  // };

  // const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
  //   const state = dragRef.current;
  //   if (!state) return;
  //   state.dragging = false;
  //   try { (e.currentTarget as Element).releasePointerCapture(e.pointerId); } catch { }
  //   dragRef.current = null;
  // };

  return (
    <div className="flex-3 flex justify-center items-center w-full p-2 bg-black/10 min-h-196">
      <div className="rounded-md overflow-hidden w-full md:w-93.75 h-full relative flex justify-center items-center">
        <img src={selectedImage} loading="eager" className="w-full max-w-93.75 " />
        {selectedLayer.textOptions?.text && (
          <div
            className={`absolute flex h-max border border-dashed border-red-500 resize-none bg-white/70 z-50 p-4`}
            style={{
              top: selectedLayer.textOptions.top,
              left: selectedLayer.textOptions.left,
            }}

          >
            <Input
              // onPointerDown={onPointerDown}
              // onPointerMove={onPointerMove}
              // onPointerUp={onPointerUp}
              style={{ color: selectedLayer.textOptions.color, fontSize: `${selectedLayer.textOptions.fontSize}px` }}
              className="text-inherit! bg-transparent outline-none border-0 p-0 cursor-grab"
              value={selectedLayer.textOptions.text}
              onChange={(e) => setTextOptions({ ...selectedLayer.textOptions!, text: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Workspace