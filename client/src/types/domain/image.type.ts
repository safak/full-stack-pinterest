import type { CanvasOptions, TextOptions } from "../store/editor.type"

export type ImageType = {
  _id?: string
  user?: string
  media: string
  width?: string
  published: boolean
}

export type CreateImagePayload = Omit<ImageType, "_id">;

export type UpdateImagePayload = {
  media?: string
  width?: string
  textOptions?: TextOptions[]
  canvasOptions?: CanvasOptions
}
