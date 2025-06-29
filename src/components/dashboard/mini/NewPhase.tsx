"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axiosInstance from "@/config/AxiosConfig"
import { Loader2 } from "lucide-react"

const NewPhase: React.FC = () => {
  const { project_id } = useParams()
  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
    console.log(success)
  const validateDates = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      setError("End date cannot be before start date");
      return false;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      setError("Start date cannot be in the past");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDates()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post('/api/project/add/phase', {
        projectId: project_id,
        title: name.trim(),
        description: description.trim(),
        startDate,
        endDate,
      });

      console.log(response);
      toast.success("Phase added successfully!");
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push(`/projects/${project_id}/timeline`);
      }, 1000);
    } catch (err) {
    //   const errorMessage = err.response?.data?.error || err.message || "Failed to add phase";
    //   toast.error(errorMessage);
    //   setError(errorMessage);
    console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-card">
      <h2 className="text-xl font-semibold mb-4">Add New Phase</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Phase Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter phase name"
            className="mt-1"
            required 
          />
          <p className="text-sm text-muted-foreground mt-1">
            Give your phase a clear and descriptive name
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the goals and objectives of this phase"
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Optional: Add details about what this phase will accomplish
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start">Start Date</Label>
            <Input 
              type="date" 
              id="start" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1"
              required 
            />
          </div>
          <div>
            <Label htmlFor="end">End Date</Label>
            <Input 
              type="date" 
              id="end" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="mt-1"
              required 
            />
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={loading || !name || !startDate || !endDate} 
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Phase...
              </>
            ) : (
              'Create Phase'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewPhase
