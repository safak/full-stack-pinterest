import { Button } from "../ui/button";

const CustomSwitch = ({ leftIcon, rightIcon, state, setState }: { leftIcon: React.ReactNode, rightIcon: React.ReactNode, state: boolean, setState: React.Dispatch<React.SetStateAction<boolean>> }) => {

  return (
    <div className='flex justify-center items-center rounded-xl bg-black/10 w-22 h-10 cursor-pointer'>
      <Button className={`${state ? "bg-white shadow-md transition-transform transform translate-x-0" : "bg-transparent"} flex rounded-lg  w-10 h-8  hover:bg-black/10 text-black/80`}
        onClick={() => setState(true)}>
        {leftIcon}
      </Button>
      <Button className={`${!state ? "bg-white shadow-md transition-transform transform translate-x-0" : "bg-transparent"} flex rounded-lg w-10 h-8  hover:bg-black/10 text-black/80`}
        onClick={() => setState(false)}>
        {rightIcon}
      </Button>
    </div>
  )
}

export default CustomSwitch