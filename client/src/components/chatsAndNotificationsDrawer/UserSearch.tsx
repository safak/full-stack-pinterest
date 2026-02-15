import { useDebounce } from "@/hooks/use-debounce"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox"
import { useGetAllUsers } from "@/hooks/queries/user.queries"
import useAuthStore from "@/lib/authStore"
import type { User } from "@/types"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

type UserSearchProps = {
  onUserSelect: (user: User) => void
  placeholder?: string
}

export function UserSearch({ onUserSelect, placeholder = "Search users..." }: UserSearchProps) {
  const [query, setQuery] = useState("")
  const { currentUser } = useAuthStore()

  const [users, setUsers] = useState<User[]>([])

  // debounce local query and pass debounced value into the hook
  const debouncedQuery = useDebounce(query, 300)

  // use the existing hook with the debounced query
  const { data: usersData, status } = useGetAllUsers({ query: debouncedQuery })
  const filteredUsers = usersData?.data.filter(user => user._id !== currentUser?._id) ?? []
  // sync local users state from hook response and loading state
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setUsers([])
      return
    }

    const resolved = filteredUsers ?? []
    const list = Array.isArray(resolved) && resolved.length > 0
      ? resolved
      : Array.isArray(resolved)
        ? resolved
        : []

    setUsers(list as User[])

  }, [debouncedQuery, filteredUsers, status])

  const handleUserSelect = (user: User) => {
    onUserSelect(user)
    setQuery("")
    setUsers([])
  }

  return (
    <Combobox
      items={users}
      onInputValueChange={(value) => setQuery(value ?? "")}
    >
      <ComboboxInput
        placeholder={placeholder}
        className="w-full border-0 shadow-none"
      />
      <ComboboxContent>
        <ComboboxEmpty>No users found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(user) => (
              <ComboboxItem
                className="cursor-pointer! z-50! border-2 border-red-500"
                key={user._id}
                value={user._id}
                onClick={() => handleUserSelect(user)}
              >
                <Avatar className="mr-2 h-6 w-6">
                  {user?.img && (
                    <AvatarImage src={user.img} alt={user.username} />
                  )}
                  <AvatarFallback>
                    {user.displayName?.[0]?.toUpperCase?.() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.displayName}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  @{user.username}
                </span>
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default UserSearch;