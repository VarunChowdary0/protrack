import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Phone } from 'lucide-react';
import React from 'react'

interface Props {
    formData:{
        firstname: string;
        lastname: string;
        email: string;
        password: string;
        confirmPassword: string;
        phoneNumber: string;
        organizationId: string;
        profilePicture: string;
      } ;
    handleInputChange: (field: string, value: string) => void;
}
const ContactInfo:React.FC<Props> = ({
    formData,
    handleInputChange,
}) => {
  return (
     <div className="space-y-6">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold  mb-2">Contact Information</h2>
            <p className="text-muted-foreground">How can we reach you?</p>
        </div>

        <div className="space-y-4">
            <div>
            <Label className=" mb-2" htmlFor="phoneNumber">Phone Number *</Label>
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className="pl-10"
                placeholder="Enter your phone number"
                />
            </div>
            </div>

            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5  text-green-600 mt-0.5" />
                <div>
                <h4 className="font-medium text-green-600 ">Verification Required</h4>
                <p className="text-sm text-muted-foreground mt-1">
                    We&apos;ll send verification codes to your email and phone number to ensure
                    account security.
                </p>
                </div>
            </div>
            </div> */}
        </div>
    </div>
  )
}

export default ContactInfo