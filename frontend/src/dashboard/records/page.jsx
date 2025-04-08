import { Suspense } from "react"
import { HealthRecordsList } from "../../components/health-records-list"

export default function RecordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Records</h1>
        <p className="text-gray-500">
          View and manage your complete health history
        </p>
      </div>

      <Suspense fallback={<div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>}>
        <HealthRecordsList />
      </Suspense>
    </div>
  )
}
