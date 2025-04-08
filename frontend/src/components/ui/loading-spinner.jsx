import { cn } from "@/lib/utils"

export function LoadingSpinner({ className }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
