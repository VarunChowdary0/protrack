import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from 'lucide-react'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'


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
          <Card className=" border-none shadow-none">
            <CardHeader className="flex items-center flex-col space-y-4">
              <div className=" rounded-full flex items-center justify-center bg-muted">
                  <Avatar className="h-20 w-20">
                      <AvatarImage 
                          src={formData?.profilePicture || ''} 
                          alt={`${formData?.firstname} ${formData?.lastname}`}
                      />
                      <AvatarFallback>
                          {formData?.firstname?.[0]?.toUpperCase()}{formData?.lastname?.[0]?.toUpperCase()}
                      </AvatarFallback>
                  </Avatar>
              </div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Welcome! Let&apos;s get started</h2>
                <p className="text-muted-foreground">Tell us a bit about yourself</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>  )
}

export default NamePic