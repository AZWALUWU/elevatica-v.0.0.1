import { createClient } from '@supabase/supabase-js';
import * as webpush from 'web-push';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

// ...existing code...
declare const Deno: any;
// ...existing code...

// VAPID keys configuration
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY');
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || '';

webpush.setVapidDetails(
  'mailto:support@elevatica.vercel.app',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { title, body, blogId } = await req.json();

    console.log('Sending push notification:', { title, body, blogId });

    // Get all push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found');
      return new Response(
        JSON.stringify({ message: 'No subscriptions to send to' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${subscriptions.length} subscriptions`);

    // Send notification to each subscription
        const results = await Promise.allSettled<{ success: boolean; endpoint: string; error?: string }>(
          subscriptions.map(async (sub: PushSubscription) => {
            try {
              const payload = JSON.stringify({
                title,
                body,
                icon: '/logo-192.png',
                badge: '/logo-192.png',
                data: {
                  url: `${Deno.env.get('SUPABASE_URL')?.replace('https://kweawtrlxpyszvhptcax.supabase.co', 'https://lovable.dev/projects/YOUR_PROJECT_ID')}/blog/${blogId}`
                }
              });
    
              const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                  p256dh: sub.p256dh,
                  auth: sub.auth
                }
              };
    
              await webpush.sendNotification(pushSubscription, payload);
              console.log('Notification sent to:', sub.endpoint);
              
              return { success: true, endpoint: sub.endpoint };
            } catch (error) {
              console.error('Error sending to subscription:', error);
              
              const err = error as { statusCode?: number; message?: string };
              
              // If subscription is invalid (410 Gone or 404 Not Found), delete it
              if (err.statusCode === 410 || err.statusCode === 404) {
                await supabase
                  .from('push_subscriptions')
                  .delete()
                  .eq('endpoint', sub.endpoint);
                console.log('Deleted invalid subscription:', sub.endpoint);
              }
              
              return { success: false, endpoint: sub.endpoint, error: err.message || 'Unknown error' };
            }
          })
        );
    
        const successful = results.filter((r): r is PromiseFulfilledResult<{ success: boolean; endpoint: string; error?: string }> => r.status === 'fulfilled').length;
    console.log(`Sent ${successful} notifications successfully`);

    return new Response(
      JSON.stringify({
        message: 'Notifications sent',
        total: subscriptions.length,
        successful
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-push-notification:', error);
    const err = error as { message?: string };
    return new Response(
      JSON.stringify({ error: err.message || 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});