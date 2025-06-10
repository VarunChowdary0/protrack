"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Ghost, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

const NotFound = () => {
  const router = useRouter()

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Stars */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse text-muted-foreground/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-${i} 8s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          <Sparkles className="h-4 w-4" />
        </div>
      ))}

      <Card className="max-w-md w-full relative backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-muted">
            <Ghost className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription className="text-xl">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
        </CardContent>
      </Card>

      {/* CSS for floating animations */}
      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, 15px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 15px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -10px); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, 20px); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10px, -15px); }
        }
      `}</style>
    </div>
  )
}

export default NotFound