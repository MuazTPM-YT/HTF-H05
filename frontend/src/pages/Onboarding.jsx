"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import { useToast } from "../hooks/use-toast";
import { Shield, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";

export function OnboardingFlow() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Personal information
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    // Medical history
    const [allergies, setAllergies] = useState("");
    const [medications, setMedications] = useState("");
    const [conditions, setConditions] = useState("");
    const [surgeries, setSurgeries] = useState("");

    // Emergency contacts
    const [emergencyName, setEmergencyName] = useState("");
    const [emergencyRelationship, setEmergencyRelationship] = useState("");
    const [emergencyPhone, setEmergencyPhone] = useState("");

    // Privacy preferences
    const [dataSharing, setDataSharing] = useState("minimal");
    const [researchConsent, setResearchConsent] = useState(false);
    const [anonymizedSharing, setAnonymizedSharing] = useState(false);

    const nextStep = () => {
        setStep(step + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setStep(step - 1);
        window.scrollTo(0, 0);
    };

    const handleComplete = async () => {
        setIsLoading(true);

        try {
            // Save all data to localStorage
            localStorage.setItem('bloodType', bloodType);
            localStorage.setItem('height', height);
            localStorage.setItem('weight', weight);
            localStorage.setItem('bloodPressure', '120/80'); // Default value
            localStorage.setItem('heartRate', '72'); // Default value

            // Properly stringify arrays before storing
            localStorage.setItem('allergies', allergies ? JSON.stringify(allergies.split(',').map(item => item.trim()).filter(Boolean)) : JSON.stringify([]));
            localStorage.setItem('medications', medications ? JSON.stringify(medications.split(',').map(item => item.trim()).filter(Boolean)) : JSON.stringify([]));
            localStorage.setItem('chronicConditions', conditions ? JSON.stringify(conditions.split(',').map(item => item.trim()).filter(Boolean)) : JSON.stringify([]));
            localStorage.setItem('surgeries', surgeries ? JSON.stringify(surgeries.split(',').map(item => item.trim()).filter(Boolean)) : JSON.stringify([]));

            localStorage.setItem('emergencyContactName', emergencyName);
            localStorage.setItem('emergencyContactRelation', emergencyRelationship);
            localStorage.setItem('emergencyContactPhone', emergencyPhone);

            localStorage.setItem('dataSharing', dataSharing);
            localStorage.setItem('researchConsent', researchConsent);
            localStorage.setItem('anonymizedSharing', anonymizedSharing);

            // Set onboarding completion flag
            localStorage.setItem('onboardingCompleted', 'true');

            // Remove the account created flag since onboarding is complete
            localStorage.removeItem('accountCreated');

            toast({
                title: "Onboarding complete",
                description: "Your health profile has been set up successfully",
            });

            // Redirect to login page after completing onboarding
            navigate('/login');
        } catch (error) {
            toast({
                title: "Error",
                description: "There was a problem setting up your profile",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-3xl py-10">
            <div className="flex items-center justify-center mb-8">
                <Shield className="h-10 w-10 text-primary mr-2" />
                <h1 className="text-3xl font-bold">HealthChain</h1>
            </div>

            <div className="relative mb-10">
                <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                </div>

                <div className="relative flex justify-between">
                    {[1, 2, 3, 4].map((stepNumber) => (
                        <div
                            key={stepNumber}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-center font-medium ${step >= stepNumber
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted bg-background text-muted-foreground"
                                }`}
                        >
                            {step > stepNumber ? <Check className="h-5 w-5" /> : stepNumber}
                        </div>
                    ))}
                </div>
            </div>

            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Let's start with some basic information about you
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={gender} onValueChange={setGender}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="non-binary">Non-binary</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                    <SelectItem value="prefer-not-to-say">
                                        Prefer not to say
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="blood-type">Blood Type</Label>
                            <Select value={bloodType} onValueChange={setBloodType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select blood type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="B-">B-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                    <SelectItem value="AB-">AB-</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                    <SelectItem value="unknown">Unknown</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="height">Height (cm)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    placeholder="175"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    placeholder="70"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" disabled>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <Button onClick={nextStep}>
                            Continue
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Medical History</CardTitle>
                        <CardDescription>
                            This information helps healthcare providers in emergency situations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="allergies">Allergies</Label>
                            <Textarea
                                id="allergies"
                                placeholder="List any allergies and reactions..."
                                value={allergies}
                                onChange={(e) => setAllergies(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="medications">Current Medications</Label>
                            <Textarea
                                id="medications"
                                placeholder="List current medications and dosages..."
                                value={medications}
                                onChange={(e) => setMedications(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="conditions">Chronic Conditions</Label>
                            <Textarea
                                id="conditions"
                                placeholder="List any chronic conditions..."
                                value={conditions}
                                onChange={(e) => setConditions(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="surgeries">Past Surgeries</Label>
                            <Textarea
                                id="surgeries"
                                placeholder="List any past surgeries and dates..."
                                value={surgeries}
                                onChange={(e) => setSurgeries(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <Button onClick={nextStep}>
                            Continue
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Emergency Contacts</CardTitle>
                        <CardDescription>
                            Who should be contacted in case of an emergency?
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="emergency-name">Contact Name</Label>
                            <Input
                                id="emergency-name"
                                placeholder="Full name"
                                value={emergencyName}
                                onChange={(e) => setEmergencyName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emergency-relationship">Relationship</Label>
                            <Select value={emergencyRelationship} onValueChange={setEmergencyRelationship}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="spouse">Spouse/Partner</SelectItem>
                                    <SelectItem value="parent">Parent</SelectItem>
                                    <SelectItem value="child">Child</SelectItem>
                                    <SelectItem value="sibling">Sibling</SelectItem>
                                    <SelectItem value="friend">Friend</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emergency-phone">Phone Number</Label>
                            <Input
                                id="emergency-phone"
                                type="tel"
                                placeholder="Phone number"
                                value={emergencyPhone}
                                onChange={(e) => setEmergencyPhone(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <Button onClick={nextStep}>
                            Continue
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {step === 4 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Privacy Preferences</CardTitle>
                        <CardDescription>
                            Control how your health data is shared and used
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Default Data Sharing Level</Label>
                            <RadioGroup value={dataSharing} onValueChange={setDataSharing}>
                                <div className="flex items-start space-x-2">
                                    <RadioGroupItem value="minimal" id="minimal" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="minimal" className="font-medium">
                                            Minimal Sharing
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Only share critical information in emergencies
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <RadioGroupItem value="selective" id="selective" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="selective" className="font-medium">
                                            Selective Sharing
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Approve each request for data access individually
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <RadioGroupItem value="open" id="open" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="open" className="font-medium">
                                            Open Sharing
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Allow healthcare providers to access your records when needed
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-4">
                            <Label>Additional Permissions</Label>

                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="research"
                                    checked={researchConsent}
                                    onCheckedChange={(checked) => setResearchConsent(checked)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="research" className="font-medium">
                                        Research Consent
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow anonymized data to be used for medical research
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="anonymized"
                                    checked={anonymizedSharing}
                                    onCheckedChange={(checked) => setAnonymizedSharing(checked)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="anonymized" className="font-medium">
                                        Anonymized Data Sharing
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow sharing of anonymized data for healthcare improvements
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <Button onClick={handleComplete} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Completing...
                                </>
                            ) : (
                                "Complete Setup"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
