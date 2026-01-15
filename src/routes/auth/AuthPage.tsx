import Login from "@/components/login/Login"
import Signup from "@/components/signup/Signup"
import { useQueryParam } from "@/hooks/use-query-params"
import { useEffect, useState } from "react"

type LoginCreds = {
  email: string
  password: string
}

type SignupCreds = {
  email: string
  password: string
  dob: string
}

export type LoginCallback = (creds: LoginCreds) => void

export type SignupCallback = (creds: SignupCreds) => void

export type ChangeModalCallback = (type: "login" | "signup") => void

const AuthPage = () => {
  const authType = useQueryParam("type")

  const [authenticationType, setAuthenticationType] = useState("login")

  const handleLogin: LoginCallback = (creds) => {
    console.log("creds", creds);
  }

  const handleSignup: SignupCallback = (creds) => {
    console.log("creds", creds);
  }

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
        <Login onLogin={handleLogin} changeModal={handleChangeModal} />
      ) : (
        <Signup onSignup={handleSignup} changeModal={handleChangeModal} />
      )}
    </div>
  )
}

export default AuthPage