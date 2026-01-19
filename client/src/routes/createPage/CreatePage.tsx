import { PinCreationForm } from "@/components/pinCreationForm/PinCreationForm"
import { useGetAllPins } from "@/hooks/queries/pin.queries"
import { useGetAllUsers } from "@/hooks/queries/user.queries"

const CreatePage = () => {
  const { data, isLoading, isError } = useGetAllPins()
  const users = useGetAllUsers()
  console.log("getPin", data);
  console.log("getPin", users);
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Something went wrong!</div>
  }
  return (
    <div><PinCreationForm /></div>
  )
}

export default CreatePage