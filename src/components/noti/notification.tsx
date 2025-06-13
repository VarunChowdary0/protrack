"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/config/AxiosConfig";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Loader2 } from "lucide-react"; // Optional loader icon from lucide-react

function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

interface NotificationRequestProps {
  showControls?: boolean;
}

export default function NotificationRequest({ showControls = true }: NotificationRequestProps) {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
      setServiceWorkerReady(true);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      toast.error("Failed to register service worker.");
    }
  }

  useEffect(() => {
    const allowed = localStorage.getItem("allowedNotifications");
    const permission = Notification.permission;

    if ((allowed === null || allowed === "true") && permission === "default") {
      showNotification();
    } else if ((allowed === null || allowed === "true") && permission === "granted" && serviceWorkerReady && !subscription) {
      subscribeUser();
    }
  }, [serviceWorkerReady]);

  const showNotification = () => {
    setLoading(true);
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        localStorage.setItem("allowedNotifications", "true");
        subscribeUser();
      } else {
        localStorage.setItem("allowedNotifications", "false");
        toast.info("Please enable notifications in your browser settings.");
        setLoading(false);
      }
    });
  };

  const subscribeUser = async () => {
    if (!serviceWorkerReady) {
      toast.error("Service worker is not ready yet. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      if (!registration.active) throw new Error("No active service worker found");
      await generateSubscribeEndPoint(registration);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe for notifications.");
      setLoading(false);
    }
  };

  const generateSubscribeEndPoint = async (registration: ServiceWorkerRegistration) => {
    let newSubscription: PushSubscription | null = null;
    try {
      const applicationServerKey = urlB64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!);
      newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      const subscriptionJson = newSubscription.toJSON();
      setSubscription(newSubscription);

      const response = await axiosInstance.post("/api/notification/subscribe", {
        subscriptionJson,
      });

      if (response.status === 200) {
        toast.success("Subscribed to notifications successfully.");
      } else {
        throw new Error("Server responded with error");
      }
    } catch (error) {
      console.error("Subscription generation error:", error);
      toast.error("Failed to subscribe for notifications.");
      if (newSubscription) {
        try {
          await newSubscription.unsubscribe();
          setSubscription(null);
        } catch (cleanupError) {
          console.error("Failed to cleanup subscription:", cleanupError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const removeNotification = async () => {
    setLoading(true);
    try {
      if (!subscription) {
        toast.info("No active subscription found.");
        setLoading(false);
        return;
      }

      const endpoint = subscription.endpoint;
      const response = await axiosInstance.post("/api/notification/remove", { endpoint });

      if (response.data.success) {
        await subscription.unsubscribe();
        setSubscription(null);
        localStorage.setItem("allowedNotifications", "false");
        toast.success("Notification removed successfully.");
      } else {
        throw new Error(response.data.message || "Server failed to remove subscription");
      }
    } catch (error) {
      console.error("Remove notification error:", error);
      toast.error("Failed to remove notification.");
    } finally {
      setLoading(false);
    }
  };

  if (!showControls) return null;

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="push-notifications">Push Notifications</Label>
      {loading ? (
        <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
      ) : (
        <Switch
          checked={subscription !== null}
          onCheckedChange={(checked) => {
            if (checked) {
              showNotification();
            } else {
              removeNotification();
            }
          }}
          id="push-notifications"
        />
      )}
    </div>
  );
}
