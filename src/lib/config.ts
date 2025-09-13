// Shared configuration for both frontend and extension
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://vyxwxkexvveglzsxlwyc.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5eHd4a2V4dnZlZ2x6c3hsd3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTEzMTQsImV4cCI6MjA3MjE4NzMxNH0.M1BkwS_2PoH4wGwLQtpCKcvMyvqgpIrkn3H3R1j6lxs"
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyArypaJ4XUwK3OPei40wPOz2pEY8FGg1jY"
  },
  app: {
    name: "Daydream Movies",
    version: "1.0.0"
  }
}
