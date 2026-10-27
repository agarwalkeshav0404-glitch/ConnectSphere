/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Future Supabase Architecture, Migration Scripts, and Integration Guide.
 * Documents complete relational schema, Row-Level Security (RLS) policies,
 * transaction-safe concurrency triggers, and environment configuration.
 */

export const SUPABASE_SETUP_GUIDE = {
  overview: `ConnectSphere uses a clean service/repository layer pattern.
Currently running in Local Demo Mode using persistent browser storage (IndexedDB/localStorage)
with complete seed data and real CRUD operations.

To promote ConnectSphere to a real multi-user production service with Supabase,
execute the migrations below and provide standard environment variables.`,

  environmentVariables: `
# Required client variables in .env:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key-here
# Note: NEVER expose SUPABASE_SERVICE_ROLE_KEY to browser client code!
`,

  databaseMigrationSql: `-- ConnectSphere Relational Schema Migration (PostgreSQL / Supabase)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Public User Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL CHECK (char_length(full_name) >= 2),
  avatar_url TEXT,
  city TEXT NOT NULL,
  locality TEXT,
  bio TEXT CHECK (char_length(bio) <= 300),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Private User Information (Restricted to Profile Owner)
CREATE TABLE public.private_user_info (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  date_of_birth DATE NOT NULL CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years'),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Master Interests Taxonomy Table
CREATE TABLE public.interests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL
);

-- 5. User-Interest Junction Table
CREATE TABLE public.user_interests (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest_id INT REFERENCES public.interests(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);

-- 6. Activities Table
CREATE TABLE public.activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 100),
  category TEXT NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) >= 15),
  date DATE NOT NULL CHECK (date >= CURRENT_DATE),
  start_time TIME NOT NULL,
  city TEXT NOT NULL,
  location TEXT NOT NULL,
  participant_limit INT NOT NULL CHECK (participant_limit > 0),
  cost_mode TEXT NOT NULL CHECK (cost_mode IN ('free', 'per_person', 'total_shared')),
  cost_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (cost_amount >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'full', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Activity Required Interests Junction
CREATE TABLE public.activity_interests (
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  interest_name TEXT NOT NULL,
  PRIMARY KEY (activity_id, interest_name)
);

-- 8. Activity Approved Participants Junction Table
CREATE TABLE public.activity_participants (
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (activity_id, user_id)
);

-- 9. Activity Join Requests
CREATE TABLE public.activity_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT CHECK (char_length(message) <= 300),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_active_activity_request UNIQUE (activity_id, requester_id, status)
);

-- 10. Friend Requests & Connections
CREATE TABLE public.friend_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT no_self_friend_request CHECK (sender_id <> receiver_id)
);

-- 11. User Blocks
CREATE TABLE public.user_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_block UNIQUE (blocker_id, blocked_id),
  CONSTRAINT no_self_block CHECK (blocker_id <> blocked_id)
);

-- 12. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_user_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read public profiles; only owner can update
CREATE POLICY "Public profiles are readable by authenticated users"
  ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own public profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Private User Info: STRICTLY owner only
CREATE POLICY "Private information visible only to the account owner"
  ON public.private_user_info FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Private information updatable only by the account owner"
  ON public.private_user_info FOR UPDATE USING (auth.uid() = user_id);

-- Activities: Readable by everyone; Creators can update/cancel their own activities
CREATE POLICY "Activities are viewable by all authenticated users"
  ON public.activities FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create activities"
  ON public.activities FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own activities"
  ON public.activities FOR UPDATE USING (auth.uid() = creator_id);

-- 13. TRANSACTION-SAFE CAPACITY CHECK (Pessimistic Row Lock against Race Conditions)
CREATE OR REPLACE FUNCTION public.approve_activity_request(
  p_request_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_activity_id UUID;
  v_requester_id UUID;
  v_creator_id UUID;
  v_limit INT;
  v_current_count INT;
BEGIN
  -- 1. Fetch request details
  SELECT activity_id, requester_id INTO v_activity_id, v_requester_id
  FROM public.activity_requests
  WHERE id = p_request_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending request not found';
  END IF;

  -- 2. Acquire EXCLUSIVE ROW LOCK on activity to prevent race conditions
  SELECT creator_id, participant_limit INTO v_creator_id, v_limit
  FROM public.activities
  WHERE id = v_activity_id
  FOR UPDATE;

  -- Verify host permission
  IF auth.uid() <> v_creator_id THEN
    RAISE EXCEPTION 'Only the activity host may approve requests';
  END IF;

  -- Count current participants
  SELECT COUNT(*) INTO v_current_count
  FROM public.activity_participants
  WHERE activity_id = v_activity_id;

  IF v_current_count >= v_limit THEN
    RAISE EXCEPTION 'Activity has already reached maximum participant capacity';
  END IF;

  -- 3. Atomic state updates within same transaction
  INSERT INTO public.activity_participants (activity_id, user_id)
  VALUES (v_activity_id, v_requester_id)
  ON CONFLICT DO NOTHING;

  UPDATE public.activity_requests
  SET status = 'approved', updated_at = NOW()
  WHERE id = p_request_id;

  -- Check if activity now full
  IF (v_current_count + 1) >= v_limit THEN
    UPDATE public.activities SET status = 'full' WHERE id = v_activity_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'activity_id', v_activity_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`,
};
