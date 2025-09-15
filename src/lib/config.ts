// Shared configuration for both frontend and extension
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
  },
  app: {
    name: "Daydream Movies",
    version: "1.0.0"
  }
}
