import { Suspense } from "react"
import DashboardOverview from "../components/dashboard/dashboard-overview"

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>}>
      <DashboardOverview />
    </Suspense>
  )
}

