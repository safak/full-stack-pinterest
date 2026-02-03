import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, X } from "lucide-react"
import { useEffect, useState } from "react"

import { useCreateImage } from "@/hooks/mutations/image.mutation"
import { useCreatePin } from "@/hooks/mutations/pin.mutations"
import { useGetBoards } from "@/hooks/queries/board.queries"
import { useGetImages } from "@/hooks/queries/image.queries"
import useEditorStore from "@/lib/editorStore"
import { useForm } from "react-hook-form"
import * as z from "zod"
import AppErrorsModal from "../appErrorsModal/AppErrorsModal"
import ImagePicker from "../imagePicker/ImagePicker"
import { Spinner } from "../ui/spinner"
import PinCreationSidebar from "./PinCreationSidebar"
import { useNavigate } from "react-router"
import useAuthStore from "@/lib/authStore"




const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters"),
  link: z.url("Please enter a valid URL").optional().or(z.literal("")),
  board: z.string().optional(),
  taggedTopics: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof formSchema>

export interface UploadedFile {
  file: File
  preview: string
}

export function PinCreationForm({
  setIsEditing,
  uploadedFile,
  setUploadedFile,
}: {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  uploadedFile: UploadedFile | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>
}) {
  const navigate = useNavigate();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null)
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { setSelectedImage, selectedImage } = useEditorStore();
  const { mutate: createImage, status: createImageStatus } = useCreateImage();
  const { mutate: createPin, status: createPinStatus, error: pinCreationError } = useCreatePin();
  const { data: userImages } = useGetImages();
  const { currentUser } = useAuthStore();
  const { data: userBoards, status: userBoardsStatus } = useGetBoards(currentUser ? { userId: currentUser._id! } : { userId: "" });

  const currentSelectedImage = userImages?.data.find(image => {
    return image.media === selectedImage
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      board: userBoards?.data[0]?._id || "",
      taggedTopics: [],
    },
  })

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const onSubmit = (data: FormData) => {
    if (!currentSelectedImage) {
      return
    }
    if (!uploadedFile) {
      setFileError("Please upload an image or video")
      return
    }
    data.taggedTopics = tags;
    createPin({ ...data, imageId: currentSelectedImage._id! }, {
      onSuccess: (res) => {
        setUploadedFile(null);
        setSelectedImage("");
        form.reset();
        setTags([]);
        navigate("/pin/" + res.data._id);
      },
      onError: (error) => {
        setErrorModalOpen(true);
        console.error("Error creating pin:", error);
      }
    })
  }

  useEffect(() => {
    if (!uploadedFile) return;
    if (uploadedFile.preview !== selectedImage && createImageStatus !== "pending") {
      setSelectedImage(uploadedFile.preview);
      const form = new FormData();
      form.append("media", uploadedFile.file);
      form.append("published", false.toString());
      createImage(form as any, {
        onSuccess: (data: any) => {
          setSelectedImage(data.media);
        },
        onError: (error) => {
          console.error("Error creating image:", error);
        },
      })
    }
  }, [uploadedFile])

  if (userBoardsStatus === "pending") {
    return <div className="w-full mt-12 flex justify-center items-center">
      <Spinner />
    </div>
  }

  if (createPinStatus === "error" && errorModalOpen) {
    return (
      <AppErrorsModal
        open={errorModalOpen}
        setOpen={() => setErrorModalOpen(false)}
        status={pinCreationError.status}
        title={pinCreationError.code ? `Error ${pinCreationError.code}` : "Error"}
        description={pinCreationError.message || "An error occurred while creating the pin."}
      />)
  }

  return (
    <div className="min-h-196 flex bg-background p-6">
      <div className="mx-auto flex-10">
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center gap-6 lg:flex-row lg:gap-8  mx-auto w-full">
            {/* Left side - File Upload */}
            <div className="flex w-full flex-col gap-4 lg:w-100">
              <ImagePicker
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                setFileError={setFileError}
                setIsEditing={setIsEditing}
                requestStatus={createImageStatus}
              />
              {fileError && <p className="text-sm text-destructive">{fileError}</p>}

              <div className="border-t pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full rounded-full bg-[#e9e9e9] py-6 font-semibold hover:bg-[#ddd]"
                >
                  Save from URL
                </Button>
              </div>
            </div>

            {/* Right side - Form Fields */}
            <div className="flex flex-1 flex-col gap-4 w-full lg:max-w-lg">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add a title"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a detailed description"
                        className="min-h-25 resize-none rounded-xl border-none bg-[#e9e9e9] placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add a link"
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
                name="board"

                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">Board</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} required={false}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl border-none bg-[#e9e9e9] py-6 focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="Choose a board" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userBoards?.data.map((board) => (
                          <SelectItem key={board._id} value={board._id!}>
                            {board.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <label className="text-xs text-muted-foreground">Tagged topics ({tags.length})</label>
                <div className="mt-1.5 rounded-xl bg-[#e9e9e9] p-3">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-3 py-1 text-sm"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Search for a tag"
                      className="h-auto min-w-30 flex-1 border-none bg-transparent p-0 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Tag products</label>
                <div className="mt-1.5">
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full bg-[#e9e9e9] px-4 py-2 text-sm font-medium hover:bg-[#ddd]"
                  >
                    Add products
                  </Button>
                </div>
              </div>

              <Collapsible open={isMoreOptionsOpen} onOpenChange={setIsMoreOptionsOpen}>
                <CollapsibleTrigger className="flex items-center gap-1 text-sm font-semibold">
                  More options
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isMoreOptionsOpen && "rotate-180")} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="rounded-xl bg-[#e9e9e9] p-4">
                    <p className="text-sm text-muted-foreground">
                      Additional options will appear here, such as scheduling, commenting settings, and more.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="mt-4 flex justify-end">
                <Button
                  type="submit"
                  variant="destructive"
                  size="xl"
                  className="rounded-fullpx-6 py-5 font-semibold text-white"
                  disabled={createPinStatus === "pending" || createImageStatus === "pending"}
                >
                  Publish
                  {(createPinStatus === "pending") && <Spinner />}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <PinCreationSidebar
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
        setUploadedFile={setUploadedFile}
        createImageStatus={createImageStatus}
      />
    </div>
  )
}