import React from "react"
import { Calendar, Clock, MapPin, Video, Phone, MoreHorizontal } from "lucide-react"
import { Button } from "../ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Badge } from "../ui/badge"

export const UpcomingAppointments = ({ limit = 5 }) => {
  // Dummy data for upcoming appointments
  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      type: 'Check-up',
      date: 'Tomorrow',
      time: '10:00 AM',
      location: 'Heart Care Center',
      isVirtual: false,
      status: 'confirmed'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      type: 'Consultation',
      date: 'June 15, 2023',
      time: '2:30 PM',
      location: 'Video Call',
      isVirtual: true,
      status: 'confirmed'
    },
    {
      id: 3,
      doctor: 'Dr. Emily Rodriguez',
      specialty: 'Neurologist',
      type: 'Follow-up',
      date: 'June 22, 2023',
      time: '9:15 AM',
      location: 'Neurology Associates',
      isVirtual: false,
      status: 'pending'
    },
    {
      id: 4,
      doctor: 'Dr. James Wilson',
      specialty: 'Orthopedist',
      type: 'Physical Therapy',
      date: 'June 30, 2023',
      time: '11:45 AM',
      location: 'Sports Medicine Clinic',
      isVirtual: false,
      status: 'confirmed'
    },
    {
      id: 5,
      doctor: 'Dr. Lisa Wong',
      specialty: 'Psychiatrist',
      type: 'Therapy Session',
      date: 'July 5, 2023',
      time: '4:00 PM',
      location: 'Video Call',
      isVirtual: true,
      status: 'confirmed'
    }
  ]

  const limitedAppointments = appointments.slice(0, limit)

  const getAppointmentTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-blue-500" />
      case "phone":
        return <Phone className="h-4 w-4 text-green-500" />
      case "in-person":
      default:
        return <MapPin className="h-4 w-4 text-red-500" />
    }
  }

  const getAppointmentTypeBadge = (type) => {
    switch (type) {
      case "video":
        return (
          <Badge
            variant="outline"
            className="text-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-800"
          >
            Video Call
          </Badge>
        )
      case "phone":
        return (
          <Badge
            variant="outline"
            className="text-green-500 border-green-200 bg-green-50 dark:bg-green-950/50 dark:border-green-800"
          >
            Phone Call
          </Badge>
        )
      case "in-person":
      default:
        return (
          <Badge
            variant="outline"
            className="text-red-500 border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800"
          >
            In Person
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      {limitedAppointments.map(appointment => (
        <div key={appointment.id} className="border-b pb-3 last:border-b-0 last:pb-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium text-sm">{appointment.doctor}</h4>
            <Badge 
              variant={appointment.status === 'confirmed' ? 'default' : 'outline'}
              className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'text-amber-800'}
            >
              {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mb-2">{appointment.specialty} • {appointment.type}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center text-xs">
              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center text-xs">
              <Clock className="h-3 w-3 mr-1 text-gray-400" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center text-xs col-span-2">
              {appointment.isVirtual ? (
                <Video className="h-3 w-3 mr-1 text-gray-400" />
              ) : (
                <MapPin className="h-3 w-3 mr-1 text-gray-400" />
              )}
              <span>{appointment.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UpcomingAppointments
