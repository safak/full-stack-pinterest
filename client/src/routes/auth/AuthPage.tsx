import Login from "@/components/login/Login"
import Signup from "@/components/signup/Signup"
import { useQueryParam } from "@/hooks/use-query-params"
import { useEffect, useState } from "react"

export type ChangeModalCallback = (type: "login" | "signup") => void

const AuthPage = () => {
  const authType = useQueryParam("type")
  const [authenticationType, setAuthenticationType] = useState("login")

  const handleChangeModal: ChangeModalCallback = (type) => {
    setAuthenticationType(type)
  }

  useEffect(() => {
    if (authType && authType === "signup") {
      setAuthenticationType('signup')
    }
  }, [authType])

  return (
    <div>
      {authenticationType === "login" ? (
        <Login changeModal={handleChangeModal} />
      ) : (
        <Signup changeModal={handleChangeModal} />
      )}
    </div>
  )
}

export default AuthPage