import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, User } from 'lucide-react'
import Image from 'next/image';
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
const NamePic:React.FC<Props> = ({formData,handleInputChange}) => {
  return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome! Let&apos;s get started</h2>
              <p className="text-muted-foreground">Tell us a bit about yourself</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className=" mb-2" htmlFor="firstname">First Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="firstname"
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => handleInputChange("firstname", e.target.value)}
                    className="pl-10"
                    placeholder="Enter your first name"
                  />
                </div>
              </div>

              <div>
                <Label className=" mb-2" htmlFor="lastname">Last Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="lastname"
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => handleInputChange("lastname", e.target.value)}
                    className="pl-10"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label className=" mb-2" htmlFor="profilePicture">Profile Picture (Optional)</Label>
                <div className="flex items-end flex-col space-y-4">
                  <div className=" rounded-full flex items-center justify-center bg-muted">
                    {formData.profilePicture ? (
                      <Image
                        src={formData.profilePicture}
                        alt="Profile"
                        width={100}
                        height={100}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <Input
                    id="profilePicture"
                    type="url"
                    value={formData.profilePicture}
                    onChange={(e) => handleInputChange("profilePicture", e.target.value)}
                    placeholder="Profile picture URL"
                  />
                </div>
              </div>
            </div>
          </div>  )
}

export default NamePic