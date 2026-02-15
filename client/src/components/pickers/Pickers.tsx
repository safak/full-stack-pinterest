import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'

const Pickers = ({ Icon, Picker, stopPropagation = false, pickerOpen, setPickerOpen }: any) => {
  return (
    <DropdownMenu open={pickerOpen} onOpenChange={() => setPickerOpen()}>
      <DropdownMenuTrigger asChild>
        <Button className="hover:bg-transparent p-1!" variant="ghost" onClick={() => setPickerOpen(!pickerOpen)} >
          <Icon className="w-7! h-7!" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='bg-white hover:bg-white!'>
        <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => {
          if (stopPropagation) {
            return e.stopPropagation()
          }
        }} className="p-0">
          {Picker}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Pickers