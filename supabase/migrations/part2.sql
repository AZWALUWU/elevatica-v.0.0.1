 Drop old statistical columns and add new text columns
 ALTER TABLE public.blogs 
 DROP COLUMN IF EXISTS mean,
 DROP COLUMN IF EXISTS median,
 DROP COLUMN IF EXISTS mode,
 DROP COLUMN IF EXISTS variance,
 DROP COLUMN IF EXISTS stdev;

 Add new text columns for trading analysis
 ALTER TABLE public.blogs
 ADD COLUMN supply TEXT,
 ADD COLUMN demmand TEXT,
 ADD COLUMN rate_setup TEXT,
 ADD COLUMN fundamental TEXT,
 ADD COLUMN indikator TEXT;

-- Enable realtime for blogs table
ALTER PUBLICATION supabase_realtime ADD TABLE public.blogs;

-- Create push subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscriptions"
  ON public.push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions"
  ON public.push_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
  ON public.push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_push_subscriptions_updated_at
  BEFORE UPDATE ON public.push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();