import type { CanvasOptions, EditorState, Layer, TextOptions } from "@/types";
import { create } from "zustand";

const defaultCanvasOptions: CanvasOptions = {
  orientation: "landscape",
  size: { name: "original", width: 0, height: 0 },
  backgroundColor: "#ffffff"
};

const useEditorStore = create<EditorState>(
  (set) => ({
    selectedLayer: { id: 2, name: "Canvas", type: "canvas", canvasOptions: defaultCanvasOptions },
    allLayers: [{ id: 1, name: "Image", type: "image" }, { id: 2, name: "Canvas", type: "canvas", canvasOptions: defaultCanvasOptions }],
    selectedImage: "",

    setSelectedLayer: (newLayer: Layer) => set({ selectedLayer: newLayer }),

    setTextOptions: (newOptions: TextOptions) => set((state: EditorState) => {
      const updatedLayers = state.allLayers.map(layer => {
        if (layer.id === state.selectedLayer.id && layer.type === "text") {
          return { ...layer, textOptions: newOptions };
        }
        return layer;
      });
      return {
        allLayers: updatedLayers,
        selectedLayer: {
          ...state.selectedLayer,
          textOptions: newOptions
        }
      };
    }),

    setCanvasOptions: (newOptions: CanvasOptions) => set((state: EditorState) => {
      const updatedLayers = state.allLayers.map(layer => {
        if (layer.id === state.selectedLayer.id && layer.type === "canvas") {
          return { ...layer, canvasOptions: newOptions };
        }
        return layer;
      });
      return {
        allLayers: updatedLayers,
        selectedLayer: {
          ...state.selectedLayer,
          canvasOptions: newOptions
        }
      };
    }),

    addLayer: () => set((state: EditorState) => {
      if (state.allLayers.length >= 10) return {};
      const newLayer: Layer = {
        id: state.allLayers.length + 1,
        name: `Add text`,
        type: "text",
        textOptions: {
          text: "Add text",
          fontSize: 48,
          color: "#000",
          top: 50,
          left: 50,
          alignment: "left",
          highlight: false,
        }
      };
      return { allLayers: [newLayer, ...state.allLayers,] };
    }),

    removeLayer: (layerId: number) => set((state: EditorState) => {
      const updatedLayers = state.allLayers.filter(layer => layer.id !== layerId);
      return { allLayers: updatedLayers };
    }),

    removeSelectedLayer: () => set({ selectedLayer: { id: 2, name: "Canvas", type: "canvas", canvasOptions: defaultCanvasOptions } }),

    updateSelectedLayer: (newSelectedLayer) => set({ selectedLayer: newSelectedLayer }),

    //  For Image
    setSelectedImage: (selectedImage: string) => set({ selectedImage }),

    removeSelectedImage: () => set({ selectedImage: "" }),

    updateSelectedImage: (newSelectedImage) => set({ selectedImage: newSelectedImage }),
  })
);

export default useEditorStore;