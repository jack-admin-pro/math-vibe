export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          avatar_color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          avatar_color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar_color?: string;
          created_at?: string;
        };
      };
      game_results: {
        Row: {
          id: string;
          profile_id: string;
          mode: 'practice' | 'time_attack' | 'survival';
          score: number;
          total_questions: number;
          duration_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          mode: 'practice' | 'time_attack' | 'survival';
          score: number;
          total_questions: number;
          duration_seconds: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          mode?: 'practice' | 'time_attack' | 'survival';
          score?: number;
          total_questions?: number;
          duration_seconds?: number;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type GameResult = Database['public']['Tables']['game_results']['Row'];
export type GameMode = 'practice' | 'time_attack' | 'survival';

