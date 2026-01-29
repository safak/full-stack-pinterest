import { useDeleteImage } from "@/hooks/mutations/image.mutation"
import { useGetImages } from "@/hooks/queries/image.queries"
import useEditorStore from "@/lib/editorStore"
import { Ellipsis } from "lucide-react"
import Image from "../image/Image"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator, SidebarTrigger } from "../ui/sidebar"
import { Spinner } from "../ui/spinner"
import type { UploadedFile } from "./PinCreationForm"

const PinCreationSidebar = ({
  sidebarExpanded,
  setSidebarExpanded,
  setUploadedFile,
  createImageStatus,
}: {
  sidebarExpanded: boolean;
  setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadedFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>
  createImageStatus: string;
}) => {
  const { mutate: deleteImage, status: deleteStatus } = useDeleteImage();
  const { setSelectedImage, selectedImage, resetCanvasOptions, removeTextLayers } = useEditorStore();
  const { data: userImages, status: userImagesStatus } = useGetImages();

  const handleDeleteImage = (imageId: string) => {
    deleteImage(imageId, {
      onSuccess: () => {
        setSelectedImage("");
        setUploadedFile(null);
      }
    });
    return
  }

  return (
    <div className="w-full flex-2 relative">
      <SidebarProvider defaultOpen={true} className='w-full border-2 '>
        <Sidebar variant="sidebar" side="right" collapsible="icon" className="absolute! top-0! right-0! w-full">
          <SidebarHeader>
            <SidebarMenu >
              <SidebarMenuItem className="flex text-center">
                {sidebarExpanded &&
                  <SidebarMenuButton asChild >
                    <h4 className="font-bold text-xl">{`Pin drafts (${userImages?.data.length})`}</h4>
                  </SidebarMenuButton>
                }
                <SidebarTrigger onClick={() => setSidebarExpanded(!sidebarExpanded)} />
              </SidebarMenuItem>
              <div className="w-full flex justify-center items-center my-2">
                <Button
                  className="w-full bg-black/20 text-black hover:bg-black/30"
                  size={"lg"}
                  disabled={!selectedImage || createImageStatus === "pending" || deleteStatus === "pending"}
                  onClick={() => {
                    setSelectedImage("");
                    setUploadedFile(null);
                    resetCanvasOptions();
                    return removeTextLayers();
                  }}
                >
                  Create new
                </Button>
              </div>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col gap-7" >
                  {userImagesStatus === "pending" || deleteStatus === "pending" || createImageStatus === "pending"
                    ? (
                      <div className="flex justify-center w-full">
                        <Spinner />
                      </div>
                    ) : userImagesStatus === "error"
                      ? (
                        <div className="w-fulltext-red-500">
                          Error loading images
                        </div>
                      ) : (
                        userImages?.data.map((image) => (
                          <SidebarMenuItem key={image.media}  >
                            <SidebarMenuButton className="relative" asChild>
                              <div
                                className={`flex rounded-2xl min-h-16 w-full p-2 justify-between gap-2 items-center cursor-pointer  ${selectedImage === image.media ? "bg-black/10 border border-black" : ""}`}
                                onClick={() => {
                                  setSelectedImage(image.media);
                                  return setUploadedFile({ preview: image.media, file: new File([], "") });
                                }}
                              >
                                <div className="w-full flex items-center justify-between! gap-2">
                                  <Image item={{ media: image.media, className: "rounded-md max-w-12 h-12 max-h-12" }} />
                                  <p className="text-sm">Select image</p>
                                  <DropdownMenu >
                                    <DropdownMenuTrigger asChild>
                                      <SidebarMenuButton className="max-w-8 flex justify-center" size={"sm"}>
                                        <Ellipsis size={8} className="cursor-pointer" />
                                      </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                      <DropdownMenuItem onClick={() => handleDeleteImage(image._id!)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>

                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))

                      )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator className="mx-0" />
        </Sidebar>
      </SidebarProvider>
    </div >
  )
}

export default PinCreationSidebar