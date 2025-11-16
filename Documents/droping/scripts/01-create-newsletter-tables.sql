-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create newsletter issues table
CREATE TABLE IF NOT EXISTS newsletter_issues (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  content TEXT NOT NULL,
  issue_number INTEGER UNIQUE NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create send logs table
CREATE TABLE IF NOT EXISTS send_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id uuid NOT NULL REFERENCES newsletter_issues(id) ON DELETE CASCADE,
  subscriber_id uuid NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'sent',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_is_active ON subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_issues_published_at ON newsletter_issues(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_send_logs_issue_id ON send_logs(issue_id);
CREATE INDEX IF NOT EXISTS idx_send_logs_subscriber_id ON send_logs(subscriber_id);
