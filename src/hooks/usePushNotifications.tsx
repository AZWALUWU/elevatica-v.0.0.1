import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('Push notifications enabled!');
        await subscribeToPush();
        return true;
      } else {
        toast.error('Push notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
      return false;
    }
  };

  const subscribeToPush = async () => {
    if (!isSupported || permission !== 'granted') return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Placeholder VAPID public key - replace with your Firebase Cloud Messaging key
      // To get FCM key: https://console.firebase.google.com/project/_/settings/cloudmessaging/
      const vapidPublicKey = import.meta.env.VITE_FIREBASE_VAPID_PUBLIC_KEY;
      
      // For now, just show a toast that FCM needs to be configured
      toast.info('Push notifications ready! Configure Firebase Cloud Messaging to enable.', {
        description: 'Add your VAPID key in src/hooks/usePushNotifications.tsx'
      });
      
      // Uncomment when you have a real VAPID key:
      // const subscription = await registration.pushManager.subscribe({
      //   userVisibleOnly: true,
      //   applicationServerKey: vapidPublicKey
      // });
      // setSubscription(subscription);
      
      // Send subscription to your backend:
      // await fetch('/api/push-subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscription)
      // });
      
      return null;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      toast.error('Failed to subscribe to push notifications');
      return null;
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      toast.success('Unsubscribed from push notifications');
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Failed to unsubscribe');
    }
  };

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    unsubscribe
  };
};
