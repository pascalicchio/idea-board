-- Project Board Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT '#8B5CF6',
  icon VARCHAR(10) DEFAULT '📁',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default projects
INSERT INTO projects (slug, name, color, icon) VALUES
  ('trendwatcher', 'TrendWatcher', '#8B5CF6', '📈'),
  ('hackerstack', 'HackerStack', '#00C9FF', '🛠️'),
  ('autonomous', 'Autonomous Agent', '#EC4899', '🤖'),
  ('calm', 'Calm Under Pressure', '#22C55E', '👕'),
  ('general', 'General', '#71717A', '📝')
ON CONFLICT (slug) DO NOTHING;

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'todo', 'in-progress', 'done')),
  priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  position INTEGER NOT NULL DEFAULT 0,
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  voter_ip VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(card_id, voter_ip)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  author VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_project ON cards(project_id);
CREATE INDEX IF NOT EXISTS idx_votes_card ON votes(card_id);
CREATE INDEX IF NOT EXISTS idx_comments_card ON comments(card_id);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies for public read/write (board is collaborative)
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can read cards" ON cards FOR SELECT USING (true);
CREATE POLICY "Public can read votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Public can read comments" ON comments FOR SELECT USING (true);

CREATE POLICY "Public can insert cards" ON cards FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR true);
CREATE POLICY "Public can update cards" ON cards FOR UPDATE USING (auth.role() = 'authenticated' OR true);
CREATE POLICY "Public can delete cards" ON cards FOR DELETE USING (auth.role() = 'authenticated' OR true);

CREATE POLICY "Public can insert votes" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert comments" ON comments FOR INSERT WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed with example cards
INSERT INTO cards (title, description, project_id, status, priority, position)
SELECT 
  e.title,
  e.description,
  p.id,
  e.status,
  e.priority,
  e.position
FROM (VALUES
  ('Add Amazon Movers API', 'Integrate real Amazon product data', 'in-progress', 'high', 0),
  ('Create 20 blog posts for HackerStack', 'Content calendar for SEO', 'todo', 'medium', 1),
  ('Reach 1000 Bluesky followers', 'Growth milestone for autonomous agent', 'todo', 'high', 2),
  ('Set up Stripe payments', 'Enable paid subscriptions', 'idea', 'high', 3),
  ('Design product mockups', 'T-shirt designs for Calm Under Pressure', 'idea', 'medium', 4),
  ('Fix subscription display bug', 'Frontend caching issue in dashboard', 'done', 'high', 5),
  ('Schedule 35 posts/week', 'Social media automation crontab', 'done', 'high', 6)
) AS e(title, description, status, priority, position)
CROSS JOIN projects p
WHERE p.slug = 'trendwatcher'
ON CONFLICT DO NOTHING;
