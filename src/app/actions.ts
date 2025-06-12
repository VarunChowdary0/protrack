'use server'

import webpush from 'web-push'

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const privateKey = process.env.VAPID_PRIVATE_KEY

if (!publicKey || !privateKey) {
  throw new Error('Missing VAPID keys')
}

webpush.setVapidDetails(
  'mailto:saivarunchowdarypoludasy4248@gmail.com',
  publicKey,
  privateKey
)

// Memory-only for demo
let subscription: PushSubscription | null = null

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) throw new Error('No subscription available')

  try {
    await webpush.sendNotification(subscription as unknown as webpush.PushSubscription, JSON.stringify({
      title: 'Test Notification',
      body: message,
      icon: '/icon.png',
    }))
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}
