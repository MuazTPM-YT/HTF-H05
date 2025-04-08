import { useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Share2, Clock, Shield, X, Plus, Check, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { useToast } from "../hooks/use-toast";

export function SharingControls() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");

  const [sharedUsers, setSharedUsers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "dr.johnson@hospital.com",
      role: "Cardiologist",
      specialty: "Cardiology",
      organization: "City Hospital",
      access: "Full Access",
      status: "active",
      expires: "30 days",
      sharedDate: "15 May 2023",
      accessAreas: ["Medical History", "Prescriptions", "Lab Results", "Vital Records"]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      email: "m.chen@skinclinic.com",
      role: "Dermatologist",
      specialty: "Dermatology",
      organization: "Skin Care Clinic",
      access: "Limited Access",
      status: "active",
      expires: "15 days",
      sharedDate: "10 April 2023",
      accessAreas: ["Medical History", "Dermatology Records"]
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      email: "e.rodriguez@neuro.com",
      role: "Neurologist",
      specialty: "Neurology",
      organization: "Neurology Associates",
      access: "Full Access",
      status: "active",
      expires: "5 days",
      sharedDate: "22 March 2023",
      accessAreas: ["Medical History", "Prescriptions", "Lab Results", "MRI Scans"]
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      email: "j.wilson@sports.med",
      role: "Orthopedist",
      specialty: "Orthopedics",
      organization: "Sports Medicine Clinic",
      access: "Limited Access",
      status: "pending",
      expires: null,
      sharedDate: "5 June 2023",
      accessAreas: ["X-Rays", "Physical Therapy Notes"]
    },
    {
      id: 5,
      name: "Westside Medical Group",
      email: "admin@westside.med",
      role: "Organization",
      specialty: "General Practice",
      organization: null,
      access: "View Only",
      status: "expired",
      expires: "Expired",
      sharedDate: "18 January 2023",
      accessAreas: ["Medical History", "Prescriptions"]
    }
  ]);

  const handleApprove = (id) => {
    setSharedUsers(sharedUsers.map(user => {
      if (user.id === id) {
        // Update user status to active and set expiration to 30 days
        return {
          ...user,
          status: "active",
          expires: "30 days"
        };
      }
      return user;
    }));

    toast({
      title: "Access approved",
      description: "Healthcare provider has been granted access to your records",
    });
  };

  const handleDeny = (id) => {
    // Remove the denied user from the list
    setSharedUsers(sharedUsers.filter(user => user.id !== id));

    toast({
      title: "Access denied",
      description: "Request has been denied and removed",
    });
  };

  const handleRevoke = (id) => {
    // Remove the user from the list
    setSharedUsers(sharedUsers.filter(user => user.id !== id));

    toast({
      title: "Access revoked",
      description: "Provider's access to your health records has been revoked",
    });
  };

  const handleExtend = (id) => {
    setSharedUsers(sharedUsers.map(user => {
      if (user.id === id) {
        // Extend expiration by 30 more days
        return {
          ...user,
          expires: "30 days"
        };
      }
      return user;
    }));

    toast({
      title: "Access extended",
      description: "Provider's access has been extended by 30 days",
    });
  };

  const handleReEnable = (id) => {
    setSharedUsers(sharedUsers.map(user => {
      if (user.id === id) {
        return {
          ...user,
          status: "active",
          expires: "30 days"
        };
      }
      return user;
    }));

    toast({
      title: "Access re-enabled",
      description: "Provider's access has been re-enabled for 30 days",
    });
  };

  const filteredUsers = sharedUsers.filter(user => {
    if (activeTab === "all") return true;
    return user.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Sharing Controls</h2>
          <p className="text-gray-500">Manage who can access your health records</p>
        </div>
        <Button>
          <Share2 className="w-4 h-4 mr-2" />
          Share Records
        </Button>
      </div>

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

      {/* Tabs for filtering */}
      <div className="flex bg-gray-50/80 rounded-lg p-1 w-full sm:w-auto overflow-x-auto mb-4">
        {['active', 'pending', 'expired', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${activeTab === status
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${user.status === 'active' ? 'bg-green-50' :
                    user.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'
                  }`}>
                  {user.status === 'active' ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : user.status === 'pending' ? (
                    <Clock className="w-6 h-6 text-yellow-600" />
                  ) : (
                    <X className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{user.name}</h3>
                    <Badge className={
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                    }>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{user.role} • {user.specialty}</p>
                  <p className="text-sm text-gray-500">{user.organization || 'Independent'}</p>

                  <div className="flex flex-wrap items-center mt-2 gap-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.access}
                    </span>
                    {user.status !== 'pending' && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {user.status === 'expired' ? 'Expired' : `Expires in: ${user.expires}`}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      Shared: {user.sharedDate}
                    </span>
                  </div>

                  {user.accessAreas && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {user.accessAreas.map((area, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 ml-auto">
                {user.status === 'pending' ? (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApprove(user.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeny(user.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Deny
                    </Button>
                  </>
                ) : user.status === 'active' ? (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleExtend(user.id)}
                    >
                      Extend
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRevoke(user.id)}
                    >
                      Revoke
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReEnable(user.id)}
                  >
                    Re-Enable Access
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 