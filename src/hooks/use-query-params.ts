import { useSearchParams } from "react-router"

export function useQueryParam(key: string) {
  const [params] = useSearchParams()
  return params.get(key)
}
