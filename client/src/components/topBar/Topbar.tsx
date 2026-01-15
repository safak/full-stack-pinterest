import { ChevronDown, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Input } from "../ui/input"

const Topbar = () => {
  return (
    <div className={`w-full flex justify-center h-max items-center p-4 gap-4 sticky top-0 z-10 bg-background border-b`}>
      <div className="w-full h-full min-w-50 rounded-lg border-2 flex justify-start items-center py-1 px-2 bg-gray-200">
        <Search className="text-gray-500" />
        <Input
          placeholder="Search"
          className="text-md font-medium"
        />
      </div>
      <div className="w-max flex gap-1 items-center">
        <a href="/user">
          <Avatar >
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <ChevronDown className="ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <a className="flex gap-2" href="/users/1">
                Profile
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Topbar