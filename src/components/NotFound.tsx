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
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse text-amber-500 "
          style={{
            zIndex: -1,
            opacity: Math.random() ,
            scale: Math.random() * 0.5 + 0.5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-${i} 8s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          <Sparkles className=' max-w-14 max-h-14'/>
        </div>
      ))}
      
      {[...Array(Math.floor(Math.random() * 10) + 1)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse text-amber-500 "
          style={{
            zIndex: -1,
            opacity: Math.random() ,
            scale: Math.random() * 0.5 + 0.5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-${i} 8s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
            <div 
            className="rounded-full"
            style={{
              zIndex: 10,
              width: "150px",
              height: "145px",
              scale: Math.random() * 0.5 + 0.5,
              background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, 
              ${[
              'rgb(255, 140, 50)',  // Mars-like
              'rgb(230, 180, 120)',  // Saturn-like
              'rgb(100, 150, 255)',  // Neptune-like
              'rgb(200, 220, 255)',  // Uranus-like
              'rgb(255, 220, 150)',  // Venus-like
              'rgb(130, 150, 255)',  // Mercury-like
              ][i % 6]}, 
              rgba(0, 0, 0, 0.8))`,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(255, 255, 255, 0.2)`
            }}
            >
            {/* Ring for Saturn-like planets */}
            {i % 3 === 0 && (
              <div className="absolute w-[160%] h-[14%] rounded-full bg-gradient-to-r from-transparent via-amber-200/30 to-transparent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12" />
            )}
            </div>
        </div>
      ))}

      <Card style={{
        zIndex:100
      }} className="max-w-md w-full relative border-none shadow-none bg-transparent">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-muted">
            <Ghost className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription className="text-xl">Lost in Space</CardDescription>
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
          50% { transform: translate(${Math.floor(Math.random() * 30)}px, ${Math.floor(Math.random() * -30)}px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.floor(Math.random() * -25)}px, ${Math.floor(Math.random() * 25)}px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.floor(Math.random() * 25)}px, ${Math.floor(Math.random() * 25)}px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.floor(Math.random() * -20)}px, ${Math.floor(Math.random() * -20)}px); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.floor(Math.random() * 20)}px, ${Math.floor(Math.random() * 30)}px); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.floor(Math.random() * -15)}px, ${Math.floor(Math.random() * -25)}px); }
        }
        @keyframes float-6 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.floor(Math.random() * -15)}px, ${Math.floor(Math.random() * -25)}px); }
        }
        @keyframes float-7 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.floor(Math.random() * -15)}px, ${Math.floor(Math.random() * -25)}px); }
        }
        @keyframes float-8 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.floor(Math.random() * -15)}px, ${Math.floor(Math.random() * -25)}px); }
        }
        @keyframes float-9 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.floor(Math.random() * -15)}px, ${Math.floor(Math.random() * -25)}px); }
        }
        @keyframes float-10 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.floor(Math.random() * -15)}px, ${Math.floor(Math.random() * -25)}px); }
        }
      `}</style>
    </div>
  )
}

export default NotFound