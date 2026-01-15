import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { ChangeModalCallback, LoginCallback } from "@/routes/auth/AuthPage"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import AppLogo from "../AppLogo"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

const formSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(50, "Password must not be more than 50 characters"),
})

type FormData = z.infer<typeof formSchema>




const Login = ({ onLogin, changeModal }: { onLogin: LoginCallback, changeModal: ChangeModalCallback }) => {

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data)
    onLogin(data)
  }

  return (
    <Dialog defaultOpen open={true} >
      <Form {...form}>
        <DialogContent className="sm:max-w-106.25 flex justify-center [&>button]:hidden">
          <form onSubmit={form.handleSubmit(onSubmit)} className="sm:max-w-70">
            <DialogHeader className="flex items-center justify-center mb-6">
              <AppLogo showFull={false} />
              <DialogTitle className="text-center font-bold text-3xl">Log in to Interest</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md ">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="enter your email"
                          className="rounded-xl border-2 py-6 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="enter your password"
                          type="password"
                          className="rounded-xl border-2 py-6 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button variant="link" className="text-blue-800 pl-0! pt-0!">Forgot your password?</Button>
                </div>
              </div>
            </div>
            <div className="flex justify-center mb-2">
              <Button
                type="submit"
                variant="destructive"
                size="default"
                className="rounded-xl px-6 py-0! font-semibold text-white w-full"
              >
                Login
              </Button>
            </div>
            <div className="text-xs text-center font-medium flex flex-col justify-center items-center gap-2 ">
              <span>Facebook login is no longer available</span>
              <span className="font-bold">Update login method</span>
              <p className="text-gray-500 mb-4">By continuing, you agree to Pinterest's <span className="underline cursor-pointer">Terms of Service</span>  and acknowledge you've read our <span className="underline cursor-pointer">Privacy Policy</span> .<span className="underline cursor-pointer">Notice at collection.</span>
              </p>
              <Button variant="link" className="text-blue-800 underline" onClick={() => changeModal("signup")}>Create new account</Button>
            </div>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  )
}

export default Login

