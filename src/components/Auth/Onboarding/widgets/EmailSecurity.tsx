import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, Mail, UserLockIcon } from 'lucide-react';
import React, { useState } from 'react'

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
const EmailSecurity:React.FC<Props> = ({
    formData,
    handleInputChange,
}) => {
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
  return (
              <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Account Security</h2>
              <p className=" text-muted-foreground">Set up your login credentials</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className=" mb-2" htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <Label className=" mb-2" htmlFor="password">Password *</Label>
                <div className="relative">
                  <UserLockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pr-12 pl-10"
                    placeholder="Create a strong password"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label className=" mb-2" htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pr-12 pl-10"
                    placeholder="Re-enter your password"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">Passwords don&apos;t match</p>
                  )}
              </div>
            </div>
          </div>
  )
}

export default EmailSecurity