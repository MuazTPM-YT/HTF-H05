import { useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Shield, Key, Lock, Smartphone } from "lucide-react";

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const securityItems = [
    {
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      icon: Shield,
      action: () => setTwoFactorEnabled(!twoFactorEnabled),
      status: twoFactorEnabled ? "Enabled" : "Disabled",
      color: twoFactorEnabled ? "text-green-600" : "text-gray-600"
    },
    {
      title: "Security Keys",
      description: "Manage your security keys for authentication",
      icon: Key,
      action: () => console.log("Manage security keys"),
      status: "2 Active Keys",
      color: "text-blue-600"
    },
    {
      title: "Password Settings",
      description: "Update your password and security preferences",
      icon: Lock,
      action: () => console.log("Change password"),
      status: "Last changed 30 days ago",
      color: "text-gray-600"
    },
    {
      title: "Device Management",
      description: "View and manage your connected devices",
      icon: Smartphone,
      action: () => console.log("Manage devices"),
      status: "3 Active Devices",
      color: "text-blue-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {securityItems.map((item, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <item.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className={`text-sm mt-1 font-medium ${item.color}`}>
                    {item.status}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={item.action}
              >
                Manage
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recovery Options</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="recovery-email">Recovery Email</Label>
            <Input
              id="recovery-email"
              type="email"
              placeholder="backup@example.com"
              className="max-w-md"
            />
          </div>
          <div>
            <Label htmlFor="recovery-phone">Recovery Phone Number</Label>
            <Input
              id="recovery-phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="max-w-md"
            />
          </div>
          <Button>Update Recovery Options</Button>
        </div>
      </Card>
    </div>
  );
} 