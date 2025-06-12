"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { BellOff, BellRing } from "lucide-react";
import axiosInstance from "@/config/AxiosConfig";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function NotificationRequest() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<
    "granted" | "denied" | "default"
  >("default");
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);

  useEffect(() => {
    setNotificationPermission(Notification.permission);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;
      
      // Check if there's an existing subscription
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
      setServiceWorkerReady(true);

      console.log('Service Worker registered and ready');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      toast.error("Failed to register service worker.");
    }
  }

  const showNotification = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          subscribeUser();
        } else {
          toast.info("Please enable notifications in your browser settings.");
        }
      });
    } else {
      toast.info("This browser does not support notifications.");
    }
  };

  const subscribeUser = async () => {
    if (!serviceWorkerReady) {
      toast.error("Service worker is not ready yet. Please try again.");
      return;
    }

    if ("serviceWorker" in navigator) {
      try {
        // Wait for service worker to be ready
        const registration = await navigator.serviceWorker.ready;
        
        // Double-check that we have an active service worker
        if (!registration.active) {
          throw new Error("No active service worker found");
        }

        await generateSubscribeEndPoint(registration);
      } catch (error) {
        console.error('Subscription error:', error);
        toast.error("Failed to subscribe for notifications.");
      }
    } else {
      toast.error("Service workers are not supported in this browser.");
    }
  };

  const generateSubscribeEndPoint = async (
    registration: ServiceWorkerRegistration
  ) => {
    try {
      const applicationServerKey = urlB64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      );

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      const subscriptionJson = subscription.toJSON();
      
      console.log('=== Subscription Created ===');
      console.log('Subscription endpoint:', subscription.endpoint);
      console.log('Subscription JSON:', subscriptionJson);
      
      setSubscription(subscription); // Update local state immediately

      const response = await axiosInstance.post("/api/notification/subscribe", {
        subscriptionJson: subscriptionJson
      });

      console.log('Subscribe response:', response.data);

      if (response.status === 200) {
        toast.success("Subscribed to notifications successfully.");
      } else {
        throw new Error("Server responded with error");
      }

    } catch (error:unknown) {
      console.error('Subscription generation error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to subscribe for notifications");
      
      // If subscription was created but server call failed, clean up
      if (subscription) {
        try {
          await subscription.unsubscribe();
          setSubscription(null);
        } catch (cleanupError) {
          console.error('Failed to cleanup subscription:', cleanupError);
        }
      }
    }
  };

  const removeNotification = async () => {
    try {
      console.log('=== Starting removeNotification ===');
      console.log('Current subscription:', subscription);
      
      if (!subscription) {
        toast.info("No active subscription found.");
        return;
      }

      if ("serviceWorker" in navigator) {
        // const registration = await navigator.serviceWorker.ready;
        
        if (subscription) {
          const endpoint = subscription.endpoint;
          
          console.log('Removing subscription with endpoint:', endpoint);
          console.log('Endpoint length:', endpoint.length);

          // Remove from server first
          const response = await axiosInstance.post("/api/notification/remove", {
            endpoint,
          });
          
          console.log('Server response status:', response.status);
          console.log('Server response data:', response.data);

          if (response.data.success) {
            // Then unsubscribe from browser
            const unsubscribeResult = await subscription.unsubscribe();
            console.log('Browser unsubscribe result:', unsubscribeResult);

            setSubscription(null);
            toast.success("Notification removed successfully.");
          } else {
            throw new Error(response.data.message || 'Server reported failure');
          }
        }
      } else {
        toast.error("Service workers not supported.");
      }
    } catch (error: unknown) {
      console.error('Remove notification error:', error);
      const err = error as { response?: { data?: { message?: string, error?: string } }, message?: string };
      console.log('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "Failed to remove notification.";
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="">
      {notificationPermission === "granted" && subscription ? (
        <Tooltip>
          <TooltipTrigger>
            <BellRing onClick={removeNotification} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Unsubscribe</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger>
            <BellOff onClick={showNotification} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Subscribe</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}