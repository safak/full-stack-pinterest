export type TextOptions = {
  text: string;
  fontSize: number;
  color: string;
  top: number;
  left: number;
  alignment: string,
  highlight: boolean,
};

export type CanvasSizeOption = {
  name: string;
  width: number;
  height: number;
};

export type CanvasOptions = {
  orientation: "landscape" | "portrait";
  size: CanvasSizeOption;
  backgroundColor: string;
}

export type Layer = {
  id: number;
  name: string;
  type: "canvas" | "image" | "text";
  textOptions?: TextOptions
  canvasOptions?: CanvasOptions
}

export type EditorState = {
  selectedLayer: Layer
  allLayers: Layer[]
  selectedImage: string,

  addTextLayer: () => void;
  setTextOptions: (newOptions: TextOptions) => void;
  removeTextLayers: () => void;
  setCanvasOptions: (newOptions: CanvasOptions) => void;
  resetCanvasOptions: () => void;
  setSelectedLayer: (newLayer: Layer) => void
  removeLayer: (layerId: number) => void;
  removeSelectedLayer: () => void;
  updateSelectedLayer: (newSelectedLayer: Layer) => void;
  setSelectedImage: (selectedImage: string) => void;
  removeSelectedImage: () => void;
  updateSelectedImage: (newSelectedImage: string) => void;
};