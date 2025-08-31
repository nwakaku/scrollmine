import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface SavedItem {
  id: string
  user_id: string
  url: string
  title: string
  snippet?: string
  content?: string
  type: 'article' | 'tweet' | 'video' | 'other'
  tags: string[]
  notes?: string
  is_favorite: boolean
  usage_count: number
  last_used_at?: string
  created_at: string
  updated_at: string
}

export interface GeneratedContent {
  id: string
  user_id: string
  item_ids: string[]
  draft_text: string
  platform: 'twitter' | 'linkedin' | 'instagram' | 'general'
  is_final: boolean
  created_at: string
  updated_at: string
}
