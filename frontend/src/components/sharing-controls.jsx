import { useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Share2, Clock, Shield, X, Plus } from "lucide-react";

export function SharingControls() {
  const [sharedUsers, setSharedUsers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Smith",
      email: "dr.smith@hospital.com",
      role: "Doctor",
      access: "Full Access",
      expires: "Apr 15, 2024"
    },
    {
      id: 2,
      name: "Dr. Michael Johnson",
      email: "m.johnson@clinic.com",
      role: "Specialist",
      access: "Limited Access",
      expires: "Mar 30, 2024"
    }
  ]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Add New Share</h3>
            <p className="text-sm text-gray-500">Grant access to your health records</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Healthcare Provider
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="provider-email">Provider Email</Label>
            <Input
              id="provider-email"
              type="email"
              placeholder="doctor@hospital.com"
            />
          </div>
          <div>
            <Label htmlFor="access-level">Access Level</Label>
            <select
              id="access-level"
              className="w-full px-3 py-2 border rounded-md"
            >
              <option>Full Access</option>
              <option>Limited Access</option>
              <option>View Only</option>
            </select>
          </div>
          <div>
            <Label htmlFor="expiry">Access Expiry</Label>
            <Input
              id="expiry"
              type="date"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {sharedUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Share2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {user.role}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.access}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Expires {user.expires}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Edit Access
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 