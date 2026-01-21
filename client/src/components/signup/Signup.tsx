import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRegisterUser } from "@/hooks/mutations/auth.mutations"
import useAuthStore from "@/lib/auth-store"
import type { ChangeModalCallback } from "@/routes/auth/AuthPage"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import AppLogo from "../AppLogo"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Spinner } from "../ui/spinner"

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must not be more than 20 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Your password is too short! You need 8+ characters.").max(50, "Password must not be more than 50 characters"),
  dob: z
    .string()
    .refine(
      (val) => !Number.isNaN(Date.parse(val)),
      "Oops! Please use a valid age to sign up."
    )
})

type FormData = z.infer<typeof formSchema>

const Signup = ({ changeModal }: { changeModal: ChangeModalCallback }) => {
  const [message, setMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const { setCurrentUser } = useAuthStore();

  const { mutate, status } = useRegisterUser();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      dob: ""
    },
    mode: "onChange",
  })

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: (res) => {
        setCurrentUser(res.data)
        form.reset();
        setMessage({ type: "success", message: "Your account has been created successfully." });
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      },
      onError: (error) => {
        setMessage({ type: "error", message: error.message });
      }
    });
  }

  return (
    <>
      <Dialog defaultOpen open={true}>
        <Form {...form}>
          <DialogContent className="sm:max-w-106.25 flex justify-center [&>button]:hidden">
            <form onSubmit={form.handleSubmit(onSubmit)} className="sm:max-w-70">
              <DialogHeader className="flex items-center justify-center mb-6">
                <AppLogo showFull={false} />
                <DialogTitle className="text-center font-bold text-3xl">Grow your business</DialogTitle>
                <DialogDescription className="text-center text-black text-sm">Get a free business account to unlock ads, analytics and other helpful tools.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 mb-4">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-md ">Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="enter your username"
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
                  <span className="text-xs text-gray-500 mb-4">Use 8 or more letters, numbers and symbols
                  </span>
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-md">Birthdate</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="mm/dd/yyyy"
                            type="date"
                            className="rounded-xl border-2 py-6 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className={`flex w-full text-center ${message ? (message.type === "error" ? "text-red-500" : "text-green-500") : ""} `}>
                <span>{message && message.message}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 mb-2">
                <Button
                  type="submit"
                  variant="destructive"
                  size="default"
                  className="rounded-xl px-6 py-0! font-semibold text-white w-full"
                  disabled={status === "pending"}
                >
                  Create account
                  <Spinner className={`size-5 ml-2 ${status !== "pending" ? "hidden" : ""}`} />
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  size="default"
                  className="rounded-xl px-6 py-0! font-semibold bg-gray-200 w-full"
                  onClick={() => changeModal("login")}
                >
                  Log into existing account
                </Button>
              </div>
              <div className="text-xs text-center font-medium flex flex-col justify-center items-center gap-2 ">
                <p className="text-gray-500 mb-4">By continuing, you agree to Pinterest's <span className="underline cursor-pointer"> Business Terms of Service</span>  and acknowledge you've read our <span className="underline cursor-pointer">Privacy Policy</span> .<span className="underline cursor-pointer">Notice at collection.</span>
                </p>
              </div>
            </form>
          </DialogContent>
        </Form>
      </Dialog>
    </>
  )
}

export default Signup

