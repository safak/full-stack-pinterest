import type { EditorState, Layer, TextOptions } from "@/types";
import { create } from "zustand";

const useEditorStore = create<EditorState>(
  (set) => ({
    selectedLayer: { id: 2, name: "Canvas", type: "canvas" },
    allLayers: [{ id: 1, name: "Image", type: "image" }, { id: 2, name: "Canvas", type: "canvas" }],
    selectedImage: "",

    setSelectedLayer: (newLayer: Layer) => set({ selectedLayer: newLayer }),

    setTextOptions: (newOptions: TextOptions) => set((state: EditorState) => {
      const updatedLayers = state.allLayers.map(layer => {
        if (layer.id === state.selectedLayer.id) {
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
    }
    ),

    addLayer: () => set((state: EditorState) => {
      if (state.allLayers.length >= 10) return {};
      const newLayer: Layer = {
        id: state.allLayers.length + 1,
        name: `Add text`,
        type: "text",
        textOptions: {
          text: "Add text",
          fontSize: 48,
          color: "#000000",
          top: 50,
          left: 50
        }
      };
      return { allLayers: [newLayer, ...state.allLayers,] };
    }),

    removeLayer: (layerId: number) => set((state: EditorState) => {
      const updatedLayers = state.allLayers.filter(layer => layer.id !== layerId);
      return { allLayers: updatedLayers };
    }),

    removeSelectedLayer: () => set({ selectedLayer: { id: 2, name: "Canvas", type: "canvas" } }),

    updateSelectedLayer: (newSelectedLayer) => set({ selectedLayer: newSelectedLayer }),

    //  For Image
    setSelectedImage: (selectedImage: string) => set({ selectedImage }),

    removeSelectedImage: () => set({ selectedImage: "" }),

    updateSelectedImage: (newSelectedImage) => set({ selectedImage: newSelectedImage }),
  })
);

export default useEditorStore;