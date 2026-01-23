import { useLogoutUser } from "@/hooks/mutations/auth.mutations"
import { ChevronDown, Search } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import AppAlert from "../appAlert/AppAlert"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import useAuthStore from "@/lib/authStore"

const Topbar = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [error, setError] = useState(null);
  const { mutateAsync } = useLogoutUser();
  const { currentUser, removeCurrentUser } = useAuthStore();

  const handleSubmit = (e: any) => {
    e.preventDefault()
    navigate(search && '/?search=' + search)
  }

  const handleLogout = async () => {
    try {
      await mutateAsync();
      removeCurrentUser();
    } catch (err: any) {
      setError(err);
      setTimeout(() => setError(null), 3000);
    }
  }

  return (
    <>
      {error && <AppAlert variant="destructive" description={error || "An error occurred during logout."} />}
      <div className={`w-full flex justify-center h-max items-center p-4 gap-4 sticky top-0 z-10 bg-background border-b`}>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full h-full min-w-50 rounded-lg border-2 flex justify-start items-center py-1 px-2 bg-gray-200">
            <Search onClick={handleSubmit} className="text-gray-500" />
            <Input
              placeholder="Search"
              value={search}
              className="text-md font-medium"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
        <div className="w-max flex gap-1 items-center">
          <Link to={`/user/${currentUser?._id}`}>
            <Avatar >
              <AvatarImage src={currentUser?.img || "https://github.com/shadcn.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <ChevronDown className="ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link className="flex gap-2" to={`/user/${currentUser?._id}`}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}

export default Topbar