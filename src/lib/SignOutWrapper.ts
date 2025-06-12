// create a wrapper component for sign out , to clear the service worker and redirect to the sign in page

import axiosInstance from "@/config/AxiosConfig";
import { signOut } from "next-auth/react";

const SignOutWrapper = async (
    {
        callbackUrl,
        redirect
    }:{
        callbackUrl?: string,
        redirect?: boolean
    }
) => {
    try {

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      console.log('=== Starting removeNotification ===');
      console.log('Current subscription:', subscription);
    


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

            // setSubscription(null);
            // toast.success("Notification removed successfully.");
          } else {
            throw new Error(response.data.message || 'Server reported failure');
          }
        }
      }
    } catch (error: unknown) {
      console.error('Remove notification error:', error);
      const err = error as { response?: { data?: { message?: string, error?: string } }, message?: string };
      console.log('Error response:', err.response?.data);
    }
    finally {
        signOut({
            callbackUrl: callbackUrl || "/login",
            redirect: redirect || true
        });
    }
}

export default SignOutWrapper;