"use client"

import React from 'react'
import { 
  FileText, 
  Eye, 
  Lock, 
  Share2, 
  Download,
  User,
  AlertCircle
} from 'lucide-react'
import { Badge } from "../ui/badge"

// Mock data for demonstration
const mockActivities = [
  {
    id: "1",
    type: "view",
    description: "Dr. Sarah Johnson viewed your medical history",
    timestamp: "2023-10-15T14:30:00",
    actor: "Dr. Sarah Johnson",
    status: "authorized",
  },
  {
    id: "2",
    type: "login",
    description: "You logged in from a new device",
    timestamp: "2023-10-14T09:15:00",
    actor: "You",
    status: "authorized",
  },
  {
    id: "3",
    type: "upload",
    description: "Central Hospital uploaded new lab results",
    timestamp: "2023-10-10T16:45:00",
    actor: "Central Hospital",
    status: "authorized",
  },
  {
    id: "4",
    type: "share",
    description: "You granted access to Dr. Michael Chen",
    timestamp: "2023-10-08T11:20:00",
    actor: "You",
    status: "authorized",
  },
  {
    id: "5",
    type: "download",
    description: "You downloaded your vaccination records",
    timestamp: "2023-10-05T13:45:00",
    actor: "You",
    status: "authorized",
  },
  {
    id: "6",
    type: "edit",
    description: "You updated your emergency contact information",
    timestamp: "2023-10-03T10:30:00",
    actor: "You",
    status: "authorized",
  },
  {
    id: "7",
    type: "login_attempt",
    description: "Failed login attempt from unknown device",
    timestamp: "2023-10-01T22:15:00",
    actor: "Unknown",
    status: "blocked",
  },
  {
    id: "8",
    type: "view",
    description: "Emergency access by paramedic using PIN",
    timestamp: "2023-09-28T08:20:00",
    actor: "Emergency Services",
    status: "emergency",
  },
]

export const RecentActivityList = ({ limit = 5 }) => {
  // Dummy data for recent activities
  const activities = [
    {
      id: 1,
      type: 'view',
      icon: Eye,
      title: 'Blood Test Results viewed',
      actor: 'You',
      date: 'Today, 2:30 PM',
      color: 'text-blue-500',
      bg: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'share',
      icon: Share2,
      title: 'X-Ray Report shared',
      actor: 'You',
      with: 'Dr. Johnson',
      date: 'Today, 11:15 AM',
      color: 'text-purple-500',
      bg: 'bg-purple-100'
    },
    {
      id: 3,
      type: 'upload',
      icon: FileText,
      title: 'New Vaccination Record added',
      actor: 'Dr. Smith',
      date: 'Yesterday, 4:20 PM',
      color: 'text-green-500',
      bg: 'bg-green-100'
    },
    {
      id: 4,
      type: 'access',
      icon: Lock,
      title: 'Emergency Information accessed',
      actor: 'Central Hospital',
      date: '2 days ago, 8:45 AM',
      color: 'text-amber-500',
      bg: 'bg-amber-100'
    },
    {
      id: 5,
      type: 'download',
      icon: Download,
      title: 'Medical History downloaded',
      actor: 'You',
      date: '3 days ago, 1:30 PM',
      color: 'text-indigo-500',
      bg: 'bg-indigo-100'
    },
    {
      id: 6,
      type: 'permission',
      icon: User,
      title: 'Access permission changed',
      actor: 'You',
      for: 'Dr. Williams',
      date: '4 days ago, 9:20 AM',
      color: 'text-gray-500',
      bg: 'bg-gray-100'
    },
    {
      id: 7,
      type: 'alert',
      icon: AlertCircle,
      title: 'Sharing request received',
      actor: 'Medical Research Lab',
      date: '5 days ago, 3:45 PM',
      status: 'pending',
      color: 'text-red-500',
      bg: 'bg-red-100'
    }
  ]

  const limitedActivities = activities.slice(0, limit)

  const getActivityIcon = (type) => {
    switch (type) {
      case "view":
        return <Eye className="h-4 w-4" />
      case "login":
        return <Lock className="h-4 w-4" />
      case "upload":
        return <FileText className="h-4 w-4" />
      case "download":
        return <Download className="h-4 w-4" />
      case "share":
        return <Share2 className="h-4 w-4" />
      case "edit":
        return <FileText className="h-4 w-4" />
      case "login_attempt":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "authorized":
        return (
          <Badge
            variant="outline"
            className="text-green-500 border-green-200 bg-green-50 dark:bg-green-950/50 dark:border-green-800"
          >
            Authorized
          </Badge>
        )
      case "blocked":
        return (
          <Badge
            variant="outline"
            className="text-red-500 border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800"
          >
            Blocked
          </Badge>
        )
      case "emergency":
        return (
          <Badge
            variant="outline"
            className="text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/50 dark:border-amber-800"
          >
            Emergency
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {limitedActivities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className={`flex-shrink-0 p-1.5 rounded-full ${activity.bg}`}>
            <activity.icon className={`h-4 w-4 ${activity.color}`} />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-xs text-gray-500">
              {activity.actor}
              {activity.with && <span> with {activity.with}</span>}
              {activity.for && <span> for {activity.for}</span>}
            </p>
            <p className="text-xs text-gray-400">{activity.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentActivityList
