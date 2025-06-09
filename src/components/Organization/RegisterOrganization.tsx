"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Building2, ImageIcon, Link2, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Organization } from '@/types/organizationType'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from 'axios'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  logo: z.string().url().optional(),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
})

const RegisterOrganization: React.FC = () => {
const auth = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: "",
      slug: "",
    },
  })

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name') {
        form.setValue('slug', generateSlug(value.name || ''))
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const organizationData: Partial<Organization> = {
        ...values,
        ownerId: auth.user?.id,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        membersCount: 1, // Starting with owner
      }
    axios.post("/api/register/org", organizationData )
    .then(() => {
        toast.success("Organization created successfully!")
        router.push(`/org/${values.slug}`)
        }
    )
    .catch((error) => {
        console.error("Error creating organization:", error)
        toast.error("Failed to create organization. Please try again.")
      }
    )
  }

  // const slugValue = form.watch('slug')

  return (
    <div className="container max-w-3xl mx-auto py-8 space-y-6">
      <Card className="border-none gap-8 !bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Organization</CardTitle>
          <CardDescription>
            Set up your organization profile to start managing projects and team collaboration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={'destructive'} className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Organization details cannot be changed without contacting support. Please review carefully before submitting.
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8" placeholder="Enter organization name" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization URL(SLUG)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Link2 className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          className="pl-8" 
                          placeholder="organization-url" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase()
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9-]/g, '')
                            field.onChange(value)
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ImageIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          className="pl-8" 
                          placeholder="https://example.com/logo.png" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your organization..." 
                        className="min-h-[100px] resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Organization'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterOrganization