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

import useEditorStore from "@/lib/editorStore"
import { useForm } from "react-hook-form"
import * as z from "zod"
import ImagePicker from "../imagePicker/ImagePicker"



const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  link: z.url("Please enter a valid URL").optional().or(z.literal("")),
  board: z.string().min(1, "Please select a board"),
  taggedTopics: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof formSchema>

export interface UploadedFile {
  file: File
  preview: string
}

export function PinCreationForm({ isEditing, setIsEditing }: { isEditing: boolean; setIsEditing: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const { setSelectedImage } = useEditorStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      board: "",
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
    if (!uploadedFile) {
      setFileError("Please upload an image or video")
      return
    }

    console.log("Form submitted:", { ...data, file: uploadedFile.file, tags })
    // createPin(data)
  }

  const boards = [
    { value: "inspiration", label: "Inspiration" },
    { value: "travel", label: "Travel" },
    { value: "food", label: "Food & Recipes" },
    { value: "fashion", label: "Fashion" },
    { value: "diy", label: "DIY & Crafts" },
    { value: "home", label: "Home Decor" },
  ]

  useEffect(() => {
    if (uploadedFile) {
      console.log("uploadedFile", uploadedFile);

      setSelectedImage(uploadedFile.preview);
    }
  }, [uploadedFile, setSelectedImage])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Left side - File Upload */}
            <div className="flex w-full flex-col gap-4 lg:w-100">
              <ImagePicker
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
                setFileError={setFileError}
                setIsEditing={setIsEditing}
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
            <div className="flex flex-1 flex-col gap-4">
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl border-none bg-[#e9e9e9] py-6 focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="Choose a board" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {boards.map((board) => (
                          <SelectItem key={board.value} value={board.value}>
                            {board.label}
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
                >
                  Publish
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
