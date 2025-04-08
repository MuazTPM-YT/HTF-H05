import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Button } from "../ui/Button"
import { Plus, Heart, Activity, Droplets, Dumbbell, AlertCircle } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

const HealthSummary = () => {
  const { toast } = useToast()
  const [healthData, setHealthData] = useState({
    bloodType: localStorage.getItem('bloodType') || 'A+',
    height: localStorage.getItem('height') || '175',
    weight: localStorage.getItem('weight') || '72',
    bloodPressure: localStorage.getItem('bloodPressure') || '120/80',
    heartRate: localStorage.getItem('heartRate') || '72',
    chronicConditions: JSON.parse(localStorage.getItem('chronicConditions') || '[]'),
    medications: JSON.parse(localStorage.getItem('medications') || '[]'),
    allergies: JSON.parse(localStorage.getItem('allergies') || '[]')
  })

  const handleAddMedication = () => {
    const medication = prompt('Enter new medication:')
    if (medication) {
      const updatedMedications = [...healthData.medications, medication]
      localStorage.setItem('medications', JSON.stringify(updatedMedications))
      setHealthData({
        ...healthData,
        medications: updatedMedications
      })
      toast({
        title: "Medication added",
        description: "Your medication has been added to your profile"
      })
    }
  }

  const handleAddAllergy = () => {
    const allergy = prompt('Enter new allergy:')
    if (allergy) {
      const updatedAllergies = [...healthData.allergies, allergy]
      localStorage.setItem('allergies', JSON.stringify(updatedAllergies))
      setHealthData({
        ...healthData,
        allergies: updatedAllergies
      })
      toast({
        title: "Allergy added",
        description: "Your allergy has been added to your profile"
      })
    }
  }

  return (
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
              <span className="text-2xl font-bold">{healthData.bloodType}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Height & Weight</div>
            <div className="flex items-center">
              <Dumbbell className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-lg font-medium">{healthData.height} cm, {healthData.weight} kg</span>
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
              <div className="mt-2 text-2xl font-bold">{healthData.bloodPressure}</div>
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
              <div className="mt-2 text-2xl font-bold">{healthData.heartRate} bpm</div>
              <div className="mt-1 text-xs text-gray-500">Last updated: 2 days ago</div>
            </div>
          </div>
        </div>

        {healthData.chronicConditions && healthData.chronicConditions.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Chronic Conditions</div>
            <div className="rounded-lg border p-3">
              <ul className="space-y-2">
                {healthData.chronicConditions.map((condition, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{condition}</p>
                      <p className="text-xs text-gray-500">Diagnosed: Jan 2018</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </TabsContent>

      {/* Medications Tab */}
      <TabsContent value="medications">
        <div className="py-4">
          {healthData.medications && healthData.medications.length > 0 ? (
            <div className="space-y-4">
              {healthData.medications.map((medication, index) => (
                <div key={index} className="rounded-lg border p-3">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{medication}</p>
                      <p className="text-sm text-gray-500">Take as prescribed</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No medications recorded</p>
              <Button
                className="mt-4"
                variant="outline"
                size="sm"
                onClick={handleAddMedication}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Medication
              </Button>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Allergies Tab */}
      <TabsContent value="allergies">
        <div className="py-4">
          {healthData.allergies && healthData.allergies.length > 0 ? (
            <div className="space-y-4">
              {healthData.allergies.map((allergy, index) => (
                <div key={index} className="rounded-lg border p-3">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{allergy}</p>
                      <p className="text-sm text-gray-500">Avoid exposure</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No allergies recorded</p>
              <Button
                className="mt-4"
                variant="outline"
                size="sm"
                onClick={handleAddAllergy}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Allergy
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default HealthSummary
