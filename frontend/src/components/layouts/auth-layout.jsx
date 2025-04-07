import React from "react";
import { Shield } from "lucide-react";

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-primary/10 items-center justify-center p-8 overflow-visible sticky top-0 h-screen">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold">HealthChain</h1>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                Secure, Decentralized Health Records
              </h2>
              <p className="text-muted-foreground">
                Take control of your health data with blockchain-powered security and seamless sharing.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Patient-Controlled Access</h3>
                  <p className="text-sm text-muted-foreground">
                    You decide who can access your health records and for how long.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Blockchain Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data is encrypted and secured with blockchain technology.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Emergency Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide critical information to emergency responders when needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-8">
        <div className="md:hidden flex items-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">HealthChain</h1>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
