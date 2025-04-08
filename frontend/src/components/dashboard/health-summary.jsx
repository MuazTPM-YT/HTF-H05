import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Button } from "../ui/Button"
import { Plus, Heart, Activity, Droplets, Dumbbell, AlertCircle, Edit, X, Save, Check } from "lucide-react"
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

  const [editMode, setEditMode] = useState({
    overview: false,
    newMedication: '',
    newMedicationFrequency: 'daily',
    newAllergy: '',
    newAllergySeverity: 'moderate',
    newCondition: '',
    newConditionDate: formatDate(new Date()),
    editingItem: null
  })

  const [tempData, setTempData] = useState({ ...healthData })

  function formatDate(date) {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  function formatDisplayDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  const saveOverviewData = () => {
    setHealthData({ ...tempData })

    // Save to localStorage
    localStorage.setItem('bloodType', tempData.bloodType)
    localStorage.setItem('height', tempData.height)
    localStorage.setItem('weight', tempData.weight)
    localStorage.setItem('bloodPressure', tempData.bloodPressure)
    localStorage.setItem('heartRate', tempData.heartRate)

    setEditMode({ ...editMode, overview: false })

    toast({
      title: "Changes saved",
      description: "Your health data has been updated"
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTempData({
      ...tempData,
      [name]: value
    })
  }

  const handleAddMedication = (e) => {
    e.preventDefault()
    if (editMode.newMedication.trim()) {
      const newMed = {
        name: editMode.newMedication,
        frequency: editMode.newMedicationFrequency
      }
      const updatedMedications = [...healthData.medications, newMed]
      localStorage.setItem('medications', JSON.stringify(updatedMedications))
      setHealthData({
        ...healthData,
        medications: updatedMedications
      })
      setEditMode({
        ...editMode,
        newMedication: '',
        newMedicationFrequency: 'daily'
      })
      toast({
        title: "Medication added",
        description: "Your medication has been added to your profile"
      })
    }
  }

  const handleRemoveMedication = (index) => {
    const updatedMedications = [...healthData.medications]
    updatedMedications.splice(index, 1)
    localStorage.setItem('medications', JSON.stringify(updatedMedications))
    setHealthData({
      ...healthData,
      medications: updatedMedications
    })
    toast({
      title: "Medication removed",
      description: "Your medication has been removed from your profile"
    })
  }

  const handleAddAllergy = (e) => {
    e.preventDefault()
    if (editMode.newAllergy.trim()) {
      const newAllergy = {
        name: editMode.newAllergy,
        severity: editMode.newAllergySeverity
      }
      const updatedAllergies = [...healthData.allergies, newAllergy]
      localStorage.setItem('allergies', JSON.stringify(updatedAllergies))
      setHealthData({
        ...healthData,
        allergies: updatedAllergies
      })
      setEditMode({
        ...editMode,
        newAllergy: '',
        newAllergySeverity: 'moderate'
      })
      toast({
        title: "Allergy added",
        description: "Your allergy has been added to your profile"
      })
    }
  }

  const handleRemoveAllergy = (index) => {
    const updatedAllergies = [...healthData.allergies]
    updatedAllergies.splice(index, 1)
    localStorage.setItem('allergies', JSON.stringify(updatedAllergies))
    setHealthData({
      ...healthData,
      allergies: updatedAllergies
    })
    toast({
      title: "Allergy removed",
      description: "Your allergy has been removed from your profile"
    })
  }

  const handleAddCondition = (e) => {
    e.preventDefault()
    if (editMode.newCondition.trim()) {
      const newCondition = {
        name: editMode.newCondition,
        diagnosedDate: editMode.newConditionDate
      }
      const updatedConditions = [...healthData.chronicConditions, newCondition]
      localStorage.setItem('chronicConditions', JSON.stringify(updatedConditions))
      setHealthData({
        ...healthData,
        chronicConditions: updatedConditions
      })
      setEditMode({
        ...editMode,
        newCondition: '',
        newConditionDate: formatDate(new Date())
      })
      toast({
        title: "Condition added",
        description: "Your chronic condition has been added to your profile"
      })
    }
  }

  const handleRemoveCondition = (index) => {
    const updatedConditions = [...healthData.chronicConditions]
    updatedConditions.splice(index, 1)
    localStorage.setItem('chronicConditions', JSON.stringify(updatedConditions))
    setHealthData({
      ...healthData,
      chronicConditions: updatedConditions
    })
    toast({
      title: "Condition removed",
      description: "Your chronic condition has been removed from your profile"
    })
  }

  const getAllergySeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'text-yellow-500 bg-yellow-50';
      case 'moderate': return 'text-orange-500 bg-orange-50';
      case 'severe': return 'text-red-500 bg-red-50';
      default: return 'text-orange-500 bg-orange-50';
    }
  };

  return (
    <Tabs defaultValue="overview">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="medications">Medications</TabsTrigger>
        <TabsTrigger value="allergies">Allergies</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Personal Health Overview</h3>
          {!editMode.overview ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTempData({ ...healthData })
                setEditMode({ ...editMode, overview: true })
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Overview
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode({ ...editMode, overview: false })}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={saveOverviewData}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {!editMode.overview ? (
          <>
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
          </>
        ) : (
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <select
                  name="bloodType"
                  value={tempData.bloodType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  name="heartRate"
                  value={tempData.heartRate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={tempData.height}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={tempData.weight}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={tempData.bloodPressure}
                  onChange={handleInputChange}
                  placeholder="e.g. 120/80"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 mt-6">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-500">Chronic Conditions</div>
            <form onSubmit={handleAddCondition} className="flex gap-2">
              <input
                type="text"
                placeholder="Condition name"
                value={editMode.newCondition}
                onChange={(e) => setEditMode({ ...editMode, newCondition: e.target.value })}
                className="p-1 text-sm border rounded-md"
              />
              <input
                type="date"
                value={editMode.newConditionDate}
                onChange={(e) => setEditMode({ ...editMode, newConditionDate: e.target.value })}
                className="p-1 text-sm border rounded-md"
              />
              <Button type="submit" size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {healthData.chronicConditions && healthData.chronicConditions.length > 0 ? (
            <div className="rounded-lg border p-3">
              <ul className="space-y-2">
                {healthData.chronicConditions.map((condition, index) => (
                  <li key={index} className="flex items-start justify-between">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{typeof condition === 'string' ? condition : condition.name}</p>
                        <p className="text-xs text-gray-500">
                          Diagnosed: {typeof condition === 'string' ? 'Jan 2018' : formatDisplayDate(condition.diagnosedDate)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveCondition(index)}
                      className="h-6 w-6 p-0 text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-lg border p-4 text-center text-gray-500">
              No chronic conditions recorded
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="medications">
        <div className="py-4">
          <form onSubmit={handleAddMedication} className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add new medication"
                value={editMode.newMedication}
                onChange={(e) => setEditMode({ ...editMode, newMedication: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="w-full sm:w-1/3">
              <select
                value={editMode.newMedicationFrequency}
                onChange={(e) => setEditMode({ ...editMode, newMedicationFrequency: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="daily">Daily</option>
                <option value="twice-daily">Twice Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>
            <Button type="submit" variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </form>

          {healthData.medications && healthData.medications.length > 0 ? (
            <div className="space-y-4">
              {healthData.medications.map((medication, index) => (
                <div key={index} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{typeof medication === 'string' ? medication : medication.name}</p>
                        <p className="text-sm text-gray-500">
                          Take {typeof medication === 'string' ? 'as prescribed' : medication.frequency.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveMedication(index)}
                      className="text-red-500"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No medications recorded</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="allergies">
        <div className="py-4">
          <form onSubmit={handleAddAllergy} className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add new allergy"
                value={editMode.newAllergy}
                onChange={(e) => setEditMode({ ...editMode, newAllergy: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="w-full sm:w-1/3">
              <select
                value={editMode.newAllergySeverity}
                onChange={(e) => setEditMode({ ...editMode, newAllergySeverity: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <Button type="submit" variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </form>

          {healthData.allergies && healthData.allergies.length > 0 ? (
            <div className="space-y-4">
              {healthData.allergies.map((allergy, index) => (
                <div key={index} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{typeof allergy === 'string' ? allergy : allergy.name}</p>
                          {typeof allergy !== 'string' && (
                            <Badge className={`${getAllergySeverityColor(allergy.severity)}`}>
                              {allergy.severity}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Avoid exposure</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveAllergy(index)}
                      className="text-red-500"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No allergies recorded</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default HealthSummary
