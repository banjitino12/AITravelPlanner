-- Create travel_plans table
CREATE TABLE IF NOT EXISTS travel_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  travelers INTEGER NOT NULL,
  preferences TEXT[] DEFAULT '{}',
  itinerary JSONB NOT NULL DEFAULT '[]',
  total_cost DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES travel_plans(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('accommodation', 'food', 'transportation', 'activity', 'shopping', 'other')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance (use IF NOT EXISTS to allow re-run)
CREATE INDEX IF NOT EXISTS idx_travel_plans_user_id ON travel_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_plans_created_at ON travel_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_plan_id ON expenses(plan_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);

-- Enable Row Level Security
ALTER TABLE travel_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create profiles table to store user metadata (username, display info)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON profiles(username);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: users can select their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Profiles: users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for travel_plans
DROP POLICY IF EXISTS "Users can view their own plans" ON travel_plans;
CREATE POLICY "Users can view their own plans"
  ON travel_plans FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own plans" ON travel_plans;
CREATE POLICY "Users can insert their own plans"
  ON travel_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own plans" ON travel_plans;
CREATE POLICY "Users can update their own plans"
  ON travel_plans FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own plans" ON travel_plans;
CREATE POLICY "Users can delete their own plans"
  ON travel_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for expenses
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
CREATE POLICY "Users can view their own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own expenses" ON expenses;
CREATE POLICY "Users can insert their own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
CREATE POLICY "Users can update their own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;
CREATE POLICY "Users can delete their own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);
