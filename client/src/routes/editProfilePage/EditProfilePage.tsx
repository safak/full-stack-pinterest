import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"

import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import * as z from "zod"


import AppErrorsModal from "@/components/appErrorsModal/AppErrorsModal"
import AvatarPicker from "@/components/avatarPicker/AvatarPicker"
import type { UploadedFile } from "@/components/pinCreationForm/PinCreationForm"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { useUpdateUser } from "@/hooks/mutations/user.mutations"
import useAuthStore from "@/lib/authStore"
import { EyeIcon, EyeOffIcon } from "lucide-react"

const formSchema = z.object({
  firstName: z.string().min(2, "Name must be at least 2 characters long").max(30, "Name must not be more than 30 characters").optional().or(z.literal("")),
  lastName: z.string().min(2, "Name must be at least 2 characters long").max(30, "Name must not be more than 30 characters").optional().or(z.literal("")),
  password: z.string().min(6, "Your password is too short! You need 8+ characters.").max(50, "Password must not be more than 50 characters").optional().or(z.literal("")),
  img: z.instanceof(File).optional(),
})

const EditProfilePage = () => {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false);
  const [removedPicture, setRemovedPicture] = useState(false);
  const { mutate, status, error } = useUpdateUser()
  const [updateError, setUpdateError] = useState<boolean>(false);


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      img: undefined,
    }
  })

  const onSubmit = (formData: z.infer<typeof formSchema>) => {
    if (!formData.firstName && !formData.lastName && !formData.password && !uploadedFile && !removedPicture) {
      return;
    }

    if (currentUser?._id) {
      const newForm: any = new FormData();
      if (formData.firstName) {
        newForm.append("displayName", `${formData.firstName} ${formData.lastName}`);
      }
      if (formData.password) {
        newForm.append("password", formData.password);
      }
      if (removedPicture) {
        newForm.append("img", null);
      } else if (uploadedFile?.file) {
        newForm.append("media", uploadedFile.file);
      }

      mutate(newForm, {
        onSuccess: () => {
          navigate("/");
        },
        onError: () => {
          setUpdateError(true);
        }
      })
    }
  }

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate])


  useEffect(() => {
    if (uploadedFile) {
      setRemovedPicture(false);
    }
  }, [uploadedFile]);

  if (updateError && status === "error") {
    return (
      <AppErrorsModal
        open={updateError}
        setOpen={() => setUpdateError(false)}
        title={`Error ${error?.code || ""}`}
        description={(error as any).message}
        status={error.status}
      />
    )
  }

  return (
    <div className="mt-4 p-4 mx-auto">
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center items-center gap-6 lg:gap-8  mx-auto w-full">
          {/* Left side - File Upload */}
          <div className="flex w-full lg:max-w-xl justify-between gap-4">
            <div className="flex-7">
              <AvatarPicker
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                setFileError={setFileError}
                removedPicture={removedPicture}
                currentUser={currentUser!}
              />
              {fileError && <p className="text-sm text-destructive">{fileError}</p>}
              <p className="text-start text-sm text-muted-foreground">Change profile picture</p>
            </div>
            <div className="flex-1 h-full flex items-end pt-2 pr-2">
              <Button
                type="button"
                variant="destructive"
                size={"sm"}
                disabled={!uploadedFile && !currentUser?.img}
                onClick={() => {
                  setUploadedFile(null);
                  return setRemovedPicture(true);
                }}
              >
                Remove Image
              </Button>
            </div>

          </div>

          {/* Right side - Form Fields */}
          <div className="flex flex-1 flex-col gap-4 w-full lg:max-w-xl">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First name"
                      className="rounded-xl border-none bg-[#e9e9e9] py-6 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Last name"
                      className="rounded-xl border-none bg-[#e9e9e9] py-6 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
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
                  <FormLabel className="text-xs text-muted-foreground">Password</FormLabel>
                  <FormControl>
                    <InputGroup className="rounded-xl border-none bg-[#e9e9e9] py-6 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0">
                      <InputGroupInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"

                        {...field}
                      />
                      <InputGroupAddon align="inline-end">
                        {showPassword ? (
                          <EyeIcon className="cursor-pointer" onClick={() => setShowPassword(false)} />
                        ) : (
                          <EyeOffIcon className="cursor-pointer" onClick={() => setShowPassword(true)} />
                        )}
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  {/* <EyeIcon /> */}
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                variant="destructive"
                size="xl"
                className="rounded-fullpx-6 py-5 font-semibold text-white"
                disabled={status === "pending"}
              >
                Save
                {(status === "pending") && <Spinner />}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditProfilePage