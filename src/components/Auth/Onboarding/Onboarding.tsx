"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Lock,
  Phone,
  Building,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import NamePic from "./widgets/NamePic";
import EmailSecurity from "./widgets/EmailSecurity";
import ContactInfo from "./widgets/ContactInfo";
import { toast } from "sonner";
import Logo0 from "@/components/headers/Logo0";
import { RefreshToken } from "@/lib/RefreshToken";
import { redirect } from "next/navigation";


const Onboarding:React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    organizationId: string;
    profilePicture: string;
    isEmailVerified?: boolean;
  }>({
    firstname: auth.user?.firstname || "",
    lastname: auth.user?.lastname || "",
    email: auth.user?.email || "",
    password: "",
    confirmPassword: "",
    phoneNumber: auth.user?.phoneNumber || "",
    organizationId: "1",
    profilePicture: auth.user?.profilePicture || "",
  });
  useEffect(() => {
    if(auth.isAuthenticated){
      setFormData(prev => ({
        ...prev,
        firstname: auth.user?.firstname || "",
        email: auth.user?.email || "",
        profilePicture: auth.user?.profilePicture || "",
        isEmailVerified: true
      }))
    }
    console.log("Auth Data:", auth);
  },[auth])

  const totalSteps = 4;

  const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Account Setup", icon: Lock },
    { id: 3, title: "Contact Details", icon: Phone },
    { id: 4, title: "Organization", icon: Building },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstname.trim() !== "" && formData.lastname.trim() !== "";
      case 2:
        return (
          formData.email.trim() !== "" &&
          formData.password !== "" &&
          formData.confirmPassword !== "" &&
          formData.password === formData.confirmPassword
        );
      case 3:
        return formData.phoneNumber.trim() !== "";
      case 4:
        return true; // Organization is optional
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    console.log("Form submitted:", formData);
    axios.post("/api/register/user", formData)
    .then(async (response) => {
      console.log("Onboarding successful:", response.data);
      if(response.status === 201){
        await RefreshToken(formData.email)
        toast.success("Onboarding completed successfully!",{
          description: "Loading your dashboard...",
          duration: 3000,
        });
        redirect("/u");
      }
    })
    .catch((error) => {
      console.error("Onboarding error:", error);
      toast.error("Onboarding failed. Please try again.", {
        description: error.response?.data?.message || "An error occurred",
        duration: 5000,
      });
    })
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <NamePic
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );

      case 2:
        return (
          <EmailSecurity
            formData={formData}
            handleInputChange={handleInputChange}
            />
        );

      case 3:
        return (
         <ContactInfo
          formData={formData}
          handleInputChange={handleInputChange}
         />
        );
      
      case 4:
        return (
            <Card>
              <CardHeader>
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">
                Welcome, {formData.firstname} {formData.lastname}!
                </h2>
                <p className="text-muted-foreground">You&apos;re all set! Here&apos;s a summary of your information:</p>
                <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {formData.email}</p>
                <p><span className="font-medium">Phone:</span> {formData.phoneNumber}</p>
                </div>
                <p className="text-sm text-blue-500 mt-4">Click &apos;Complete Setup&apos; to finish your registration.</p>
              </div>
              </CardHeader>
            </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <div className=" fixed top-4 left-3">
        <Logo0/>
      </div>
      <Card className="w-full max-w-md rounded-xl bg-transparent border-none shadow-none">

        {/* Progress Steps */}
        <div className="px-6 py-4 border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : isActive
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-300 text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-2 transition-all duration-200 ${
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <CardContent className="px-6 py-8">{renderStepContent()}</CardContent>
        {/* Navigation */}
        <div className="px-6 py-4 border-gray-200 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              variant={"default"}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-200 ${
                isStepValid()
              }`}
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r
               from-[#736bf6] to-[#61d2d4]  hover:from-[#75fafd]
                hover:to-[#736bf6] text-white rounded-lg transition-colors  
                duration-300 shadow-md hover:shadow-lg  hover:scale-105"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Complete Setup</span>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
