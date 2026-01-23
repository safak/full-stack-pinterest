export type TextOptions = {
  text: string;
  fontSize: number;
  color: string;
  top: number;
  left: number;
};

export type Layer = {
  id: number;
  name: string;
  type: "canvas" | "image" | "text";
  textOptions?: TextOptions
}

export type EditorState = {
  selectedLayer: Layer
  allLayers: Layer[]
  selectedImage: string,

  addLayer: () => void;
  setTextOptions: (newOptions: TextOptions) => void;
  setSelectedLayer: (newLayer: Layer) => void
  removeLayer: (layerId: number) => void;
  removeSelectedLayer: () => void;
  updateSelectedLayer: (newSelectedLayer: Layer) => void;
  setSelectedImage: (selectedImage: string) => void;
  removeSelectedImage: () => void;
  updateSelectedImage: (newSelectedImage: string) => void;
};