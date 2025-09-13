import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { localStorageUtils } from '@/lib/localStorage'
import { toast } from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  migrateLocalData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    
    // After successful signup, migrate local data if user is immediately signed in
    if (user) {
      await migrateLocalData()
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const migrateLocalData = async () => {
    if (!user) return
    
    try {
      const localItems = localStorageUtils.getSavedItems()
      const localContent = localStorageUtils.getGeneratedContent()
      
      if (localItems.length === 0 && localContent.length === 0) {
        return // No data to migrate
      }

      toast.loading('Migrating your local data...', { id: 'migration' })
      
      await localStorageUtils.migrateToSupabase(supabase, user.id)
      
      toast.success('Your local data has been migrated successfully!', { id: 'migration' })
    } catch (error) {
      console.error('Migration error:', error)
      toast.error('Failed to migrate local data. Your data is still safe in your browser.', { id: 'migration' })
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    migrateLocalData,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
