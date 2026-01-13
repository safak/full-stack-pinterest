
const AppLogo = ({ showFull = true }) => {
  return (
    <a href="/" >
      {showFull ?
        <p className="font-semibold ml-2 text-2xl text-center w-full">
          <span className="font-extrabold text-3xl text-red-500">i</span>
          {showFull ? "nterest" : ""}
        </p>
        :
        <span className="font-extrabold text-3xl text-red-500">i</span>
      }
    </a>
  )
}

export default AppLogo