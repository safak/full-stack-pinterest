import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon } from "lucide-react"

export function AppAlert({ title, description, variant = "default" }: { title?: string, description: string, variant?: "default" | "destructive" }) {
  return (
    <Alert className="max-w-md" variant={variant}>
      <CheckCircle2Icon />
      <AlertTitle>{title || ""}</AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
    </Alert>
  )
}

export default AppAlert
