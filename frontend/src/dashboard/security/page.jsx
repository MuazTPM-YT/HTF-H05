import { Suspense } from "react"
import SecuritySettings from "../../components/security-settings"

export default function SecurityPage() {
  return (
    <Suspense fallback={<div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
        <SecuritySettings />
      </div>
    </Suspense>
  )
}
