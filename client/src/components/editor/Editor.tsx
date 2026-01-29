
import Options from "./options/Options"
import Workspace from "./Workspace"
import Layers from "./Layers"


const Editor = () => {
  return (
    <div className="flex flex-col">

      <div className="flex justify-center items-center h-full w-full px-2">

        {/* Left */}
        <Layers />

        {/* Center */}
        <Workspace />

        {/* Right */}
        <Options />

      </div>
    </div >
  )
}

export default Editor