// Database types - can be generated later with supabase gen types
// For now, using a generic type
export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
  }
}

