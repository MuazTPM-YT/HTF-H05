import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs"

import {
  FileText,
  Share2,
  AlertTriangle,
  Lock,
  Plus,
  Calendar,
  Clock,
  Activity,
  ChevronRight,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  Droplets,
  Dumbbell,
  User
} from "lucide-react"

import { RecentActivityList } from "./recent-activity-list"
import { UpcomingAppointments } from "./upcoming-appointments"
import HealthSummary from "./health-summary"

const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back to your secure health records</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health Records */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Records</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">+3 added this month</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" className="w-full justify-center" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </CardFooter>
        </Card>

        {/* Active Sharing */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Sharing</CardTitle>
            <Share2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">
              2 healthcare providers, 1 organization
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" className="w-full justify-between" size="sm">
              Manage Sharing
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Security Status */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <Lock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-2">Secure</div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Protected</Badge>
            </div>
            <p className="text-xs text-gray-500">Last verified 2 hours ago</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" className="w-full justify-between" size="sm">
              Security Settings
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Emergency Access */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Emergency Access</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-2">Ready</div>
              <Badge variant="outline" className="border-green-500 text-green-600">
                Enabled
              </Badge>
            </div>
            <p className="text-xs text-gray-500">PIN: **** (Last updated 30 days ago)</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" className="w-full justify-between" size="sm">
              Update Emergency Info
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview">
        <TabsList className="space-x-2 bg-transparent border-b rounded-none p-0 h-10">
          <TabsTrigger
            value="overview"
            className="rounded data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:shadow-none pb-3"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="recent-activity"
            className="rounded data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:shadow-none pb-3"
          >
            Recent Activity
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="rounded data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:shadow-none pb-3"
          >
            Appointments
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-gray-200">
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
                <CardDescription>Your key health metrics and information</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                    <TabsTrigger value="allergies">Allergies</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-500">Blood Type</div>
                        <div className="flex items-center">
                          <Droplets className="h-5 w-5 mr-2 text-red-500" />
                          <span className="text-2xl font-bold">A+</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-500">Height & Weight</div>
                        <div className="flex items-center">
                          <Dumbbell className="h-5 w-5 mr-2 text-blue-500" />
                          <span className="text-lg font-medium">175 cm, 72 kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-500">Vital Signs</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Heart className="h-5 w-5 mr-2 text-red-500" />
                              <span className="font-medium">Blood Pressure</span>
                            </div>
                            <Badge variant="outline" className="text-green-500">Normal</Badge>
                          </div>
                          <div className="mt-2 text-2xl font-bold">120/80</div>
                          <div className="mt-1 text-xs text-gray-500">Last updated: 2 days ago</div>
                        </div>

                        <div className="rounded-lg border p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Activity className="h-5 w-5 mr-2 text-green-500" />
                              <span className="font-medium">Heart Rate</span>
                            </div>
                            <Badge variant="outline" className="text-green-500">Normal</Badge>
                          </div>
                          <div className="mt-2 text-2xl font-bold">72 bpm</div>
                          <div className="mt-1 text-xs text-gray-500">Last updated: 2 days ago</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Other tabs content */}
                  <TabsContent value="medications">
                    {/* Medications content */}
                  </TabsContent>
                  <TabsContent value="allergies">
                    {/* Allergies content */}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="lg:col-span-3 border-gray-200">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Recent alerts and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-1.5 rounded-full bg-blue-100">
                      <Bell className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Appointment Reminder</p>
                      <p className="text-xs text-gray-500">
                        You have an appointment with Dr. Johnson tomorrow at 10:00 AM.
                      </p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-1.5 rounded-full bg-green-100">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Lab Results Available</p>
                      <p className="text-xs text-gray-500">
                        Your recent lab results have been uploaded to your records.
                      </p>
                      <p className="text-xs text-gray-400">Yesterday</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-1.5 rounded-full bg-amber-100">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Sharing Request</p>
                      <p className="text-xs text-gray-500">
                        Central Hospital has requested access to your medical history.
                      </p>
                      <p className="text-xs text-gray-400">2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-1.5 rounded-full bg-red-100">
                      <XCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Access Expired</p>
                      <p className="text-xs text-gray-500">
                        Dr. Chen's access to your records has expired.
                      </p>
                      <p className="text-xs text-gray-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lower Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled healthcare visits</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent><UpcomingAppointments limit={3} /></CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Manage Appointments</Button>
              </CardFooter >
            </Card >

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Recent actions on your health records</CardDescription>
                </div>
                <Clock className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent><RecentActivityList limit={3} /></CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Activity</Button>
              </CardFooter >
            </Card >

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Health Trends</CardTitle>
                  <CardDescription>Tracking your key health metrics</CardDescription>
                </div>
                <Activity className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Health metric placeholders */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Blood Pressure</span>
                    <span className="text-sm text-green-500">Stable</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Weight</span>
                    <span className="text-sm text-amber-500">Slight increase</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Heart Rate</span>
                    <span className="text-sm text-green-500">Normal</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </CardContent >
              <CardFooter>
                <Button variant="outline" className="w-full">View Health Analytics</Button>
              </CardFooter >
            </Card >
          </div >
        </TabsContent >

        {/* Activity Tab */}
        < TabsContent value="recent-activity" >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>A detailed log of recent actions on your health records</CardDescription>
            </CardHeader>
            <CardContent><RecentActivityList limit={10} /></CardContent>
          </Card>
        </ >

        {/* Appointments Tab */}
        < TabsContent value="appointments" >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled healthcare visits</CardDescription>
            </CardHeader>
            <CardContent><UpcomingAppointments limit={10} /></CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Schedule New Appointment
              </Button>
            </CardFooter>
          </Card >
        </TabsContent >
      </Tabs >
    </div >
  )
}

export default DashboardOverview
