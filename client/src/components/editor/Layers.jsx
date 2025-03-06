import useEditorStore from "../../utils/editorStore";
import Image from "../image/image";

const Layers = () => {
  const { selectedLayer, setSelectedLayer, addText, canvasOptions } =
    useEditorStore();

  const handleSelectedLayer = (layer) => {
    setSelectedLayer(layer);

    if (layer === "text") {
      addText();
    }
  };
  return (
    <div className="layers">
      <div className="layersTitle">
        <h3>Layers</h3>
        <p>Select a layer to edit</p>
      </div>
      <div
        onClick={() => handleSelectedLayer("text")}
        className={`layer ${selectedLayer === "text" ? "selected" : ""}`}
      >
        <div className="layerImage">
          <Image path="/general/text.png" alt="" w={48} h={48} />
        </div>
        <span>Add Text</span>
      </div>
      <div
        onClick={() => handleSelectedLayer("canvas")}
        className={`layer ${selectedLayer === "canvas" ? "selected" : ""}`}
      >
        <div
          className="layerImage"
          style={{ backgroundColor: canvasOptions.backgroundColor }}
        ></div>
        <span>Canvas</span>
      </div>
    </div>
  );
};

export default Layers;
