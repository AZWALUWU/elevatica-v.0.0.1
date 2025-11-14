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
      
      // Register service worker
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
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
      
      const vapidPublicKey = 'BOI7b3ziw3gxxzo_IACqGQeGU6Sz4Rqy8AlZ43aGblXOUf5ApkbS_XBnMr3upU-fi9fCTsf0QU0BrcjOJ-ATfk8';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });
      
      setSubscription(subscription);
      
      // Send subscription to backend
      const { supabase } = await import('@/integrations/supabase/client');
      const subscriptionData = subscription.toJSON();
      
      const { error } = await supabase.from('push_subscriptions').insert({
        endpoint: subscriptionData.endpoint!,
        p256dh: subscriptionData.keys!.p256dh,
        auth: subscriptionData.keys!.auth,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
      
      if (error) {
        console.error('Error saving subscription:', error);
        toast.error('Failed to save push notification subscription');
        return null;
      }
      
      toast.success('Push notifications enabled successfully!');
      return subscription;
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
