import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Activity, Pill, AlertTriangle, Heart, Droplets, Dumbbell } from "lucide-react";

const HealthSummary = () => {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="medications">Medications</TabsTrigger>
        <TabsTrigger value="allergies">Allergies</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Blood Type</div>
            <div className="flex items-center">
              <Droplets className="h-5 w-5 mr-2 text-red-500" />
              <span className="text-2xl font-bold">A+</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Height & Weight</div>
            <div className="flex items-center">
              <Dumbbell className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-lg font-medium">175 cm, 72 kg</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Vital Signs</div>
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
              <div className="mt-1 text-xs text-muted-foreground">Last updated: 2 days ago</div>
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
              <div className="mt-1 text-xs text-muted-foreground">Last updated: 2 days ago</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Chronic Conditions</div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              <span className="font-medium">Asthma (Mild)</span>
            </div>
            <div className="mt-2 text-sm">
              <p>Diagnosed: Jan 2018</p>
              <p>Managed with: Albuterol inhaler as needed</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="medications" className="pt-4">
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Pill className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-medium">Lisinopril</span>
              </div>
              <Badge>Active</Badge>
            </div>
            <div className="mt-2 grid gap-1">
              <p className="text-sm">10mg, Once daily</p>
              <p className="text-sm text-muted-foreground">For blood pressure management</p>
              <p className="text-xs text-muted-foreground">Prescribed by: Dr. Sarah Johnson</p>
              <p className="text-xs text-muted-foreground">Started: March 2023</p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Pill className="h-5 w-5 mr-2 text-green-500" />
                <span className="font-medium">Albuterol Inhaler</span>
              </div>
              <Badge>As Needed</Badge>
            </div>
            <div className="mt-2 grid gap-1">
              <p className="text-sm">2 puffs as needed for shortness of breath</p>
              <p className="text-sm text-muted-foreground">For asthma symptoms</p>
              <p className="text-xs text-muted-foreground">Prescribed by: Dr. Emily Rodriguez</p>
              <p className="text-xs text-muted-foreground">Started: January 2018</p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Pill className="h-5 w-5 mr-2 text-purple-500" />
                <span className="font-medium">Vitamin D Supplement</span>
              </div>
              <Badge>Active</Badge>
            </div>
            <div className="mt-2 grid gap-1">
              <p className="text-sm">1000 IU, Once daily</p>
              <p className="text-sm text-muted-foreground">For vitamin D deficiency</p>
              <p className="text-xs text-muted-foreground">Prescribed by: Dr. Emily Rodriguez</p>
              <p className="text-xs text-muted-foreground">Started: September 2022</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="allergies" className="pt-4">
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              <span className="font-medium">Penicillin</span>
            </div>
            <div className="mt-2 grid gap-1">
              <p className="text-sm">
                Severity: <Badge variant="destructive">Severe</Badge>
              </p>
              <p className="text-sm">Reaction: Hives, difficulty breathing, swelling</p>
              <p className="text-xs text-muted-foreground">Diagnosed: 2010</p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              <span className="font-medium">Shellfish</span>
            </div>
            <div className="mt-2 grid gap-1">
              <p className="text-sm">
                Severity: <Badge variant="warning">Moderate</Badge>
              </p>
              <p className="text-sm">Reaction: Nausea, vomiting, skin rash</p>
              <p className="text-xs text-muted-foreground">Diagnosed: 2015</p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              <span className="font-medium">Pollen</span>
            </div>
            <div className="mt-2 grid gap-1">
              <p className="text-sm">
                Severity: <Badge variant="outline">Mild</Badge>
              </p>
              <p className="text-sm">Reaction: Sneezing, itchy eyes, congestion</p>
              <p className="text-xs text-muted-foreground">Diagnosed: 2008</p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export { HealthSummary }
export default HealthSummary
