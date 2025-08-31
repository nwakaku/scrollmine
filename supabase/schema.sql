-- Enhanced ScrollMine Database Schema

-- Create saved_items table (main table for storing captured content)
CREATE TABLE public.saved_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    snippet TEXT,
    content TEXT, -- Store actual page content for AI processing
    tags TEXT[] DEFAULT '{}',
    type TEXT DEFAULT 'article',
    is_favorite BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0, -- Track how many times used for content generation
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated_contents table (for storing generated social media content)
CREATE TABLE public.generated_contents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    item_ids UUID[] NOT NULL,
    draft_text TEXT NOT NULL,
    platform TEXT CHECK (platform IN ('twitter', 'linkedin', 'instagram', 'general')) NOT NULL,
    is_final BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_saved_items_user_id ON public.saved_items(user_id);
CREATE INDEX idx_saved_items_created_at ON public.saved_items(created_at DESC);
CREATE INDEX idx_saved_items_is_favorite ON public.saved_items(is_favorite);
CREATE INDEX idx_saved_items_usage_count ON public.saved_items(usage_count DESC);
CREATE INDEX idx_saved_items_last_used_at ON public.saved_items(last_used_at DESC);
CREATE INDEX idx_generated_contents_user_id ON public.generated_contents(user_id);
CREATE INDEX idx_generated_contents_created_at ON public.generated_contents(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_contents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved_items table
CREATE POLICY "Users can view own saved items" ON public.saved_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved items" ON public.saved_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved items" ON public.saved_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved items" ON public.saved_items
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for generated_contents table
CREATE POLICY "Users can view own generated content" ON public.generated_contents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated content" ON public.generated_contents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generated content" ON public.generated_contents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generated content" ON public.generated_contents
    FOR DELETE USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_saved_items_updated_at 
    BEFORE UPDATE ON public.saved_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
