import { Suspense } from "react"
import { SharingControls } from "../../components/sharing-controls"

export default function SharingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sharing Controls</h1>
        <p className="text-gray-500">
          Manage who has access to your health records
        </p>
      </div>

      <Suspense fallback={<div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>}>
        <SharingControls />
      </Suspense>
    </div>
  )
}
