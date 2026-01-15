"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB for images
const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200MB for videos
const ACCEPTED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4"],
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  board: z.string().min(1, "Please select a board"),
  taggedTopics: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof formSchema>

interface UploadedFile {
  file: File
  preview: string
}

export function PinCreationForm() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

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

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setFileError(null)

    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      if (error.code === "file-too-large") {
        setFileError("File is too large. Max size is 20MB for images and 200MB for videos.")
      } else if (error.code === "file-invalid-type") {
        setFileError("Invalid file type. Please upload a .jpg, .png, .gif, .webp, or .mp4 file.")
      }
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const isVideo = file.type.startsWith("video/")
      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_FILE_SIZE

      if (file.size > maxSize) {
        setFileError(`File is too large. Max size is ${isVideo ? "200MB" : "20MB"}.`)
        return
      }

      setUploadedFile({
        file,
        preview: URL.createObjectURL(file),
      })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    multiple: false,
  })

  const removeFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.preview)
      setUploadedFile(null)
    }
  }

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
  }

  const boards = [
    { value: "inspiration", label: "Inspiration" },
    { value: "travel", label: "Travel" },
    { value: "food", label: "Food & Recipes" },
    { value: "fashion", label: "Fashion" },
    { value: "diy", label: "DIY & Crafts" },
    { value: "home", label: "Home Decor" },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Left side - File Upload */}
            <div className="flex w-full flex-col gap-4 lg:w-[400px]">
              <div
                {...getRootProps()}
                className={cn(
                  "relative flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors",
                  isDragActive ? "border-primary bg-primary/5" : "border-transparent bg-[#e9e9e9] hover:bg-[#ddd]",
                  uploadedFile && "border-none p-0",
                )}
              >
                <input {...getInputProps()} />

                {uploadedFile ? (
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    {uploadedFile.file.type.startsWith("video/") ? (
                      <video src={uploadedFile.preview} className="h-full w-full object-cover" controls />
                    ) : (
                      <img
                        src={uploadedFile.preview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile()
                      }}
                      className="absolute right-2 top-2 rounded-full bg-foreground/80 p-1.5 text-background transition-colors hover:bg-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 px-6 text-center">
                    <div className="rounded-full border-2 border-foreground p-2">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium">
                      Choose a <span className="underline">file</span> or drag and drop it here
                    </p>
                    <p className="mt-16 text-xs text-muted-foreground">
                      We recommend using high-quality .jpg files less than 20 MB or .mp4 files less than 200 MB.
                    </p>
                  </div>
                )}
              </div>

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
                        className="min-h-[100px] resize-none rounded-xl border-none bg-[#e9e9e9] placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
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
                      className="h-auto min-w-[120px] flex-1 border-none bg-transparent p-0 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
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
