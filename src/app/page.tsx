'use client'
 
import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from './actions'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
 
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  const [message, setMessage] = useState('')
 
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])
 
  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }
 
  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
  }
 
  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }
 
  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message)
      setMessage('')
    }
  }
 
  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>
  }
 
  return (
    <Card>
      <CardHeader>Push Notifications</CardHeader>
        {subscription ? (

            <CardContent>
                <p>You are subscribed to push notifications.</p>
                <div className=' flex gap-4'>
                    <Button onClick={unsubscribeFromPush}>Unsubscribe</Button>
                    <Input
                        type="text"
                        placeholder="Enter notification message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button onClick={sendTestNotification}>Send Test</Button>
                </div>
            </CardContent>
        ) : (
            <CardContent>
            <p>You are not subscribed to push notifications.</p>
            <Button onClick={subscribeToPush}>Subscribe</Button>
            </CardContent>
        )}
    </Card>
  )
}

// function InstallPrompt() {
//   const [isIOS, setIsIOS] = useState(false)
//   const [isStandalone, setIsStandalone] = useState(false)
 
//   useEffect(() => {
//     setIsIOS(
//       /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
//     )
 
//     setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
//   }, [])
 
//   if (isStandalone) {
//     return null // Don't show install button if already installed
//   }
 
//   return (
//     <div>
//       <h3>Install App</h3>
//       <button>Add to Home Screen</button>
//       {isIOS && (
//         <p>
//           To install this app on your iOS device, tap the share button
//           <span role="img" aria-label="share icon">
//             {' '}
//             ⎋{' '}
//           </span>
//           and then &quot;Add to Home Screen&quot;
//           <span role="img" aria-label="plus icon">
//             {' '}
//             ➕{' '}
//           </span>.
//         </p>
//       )}
//     </div>
//   )
// }
 
export default function Page() {
  return (
    <div className=' flex flex-col items-center justify-center min-h-screen p-4'>
      <PushNotificationManager />
      {/* <InstallPrompt /> */}
    </div>
  )
}