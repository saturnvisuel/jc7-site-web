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
      registrations: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          birth_date: string;
          email: string;
          phone: string;
          emergency_contact: string;
          category: string;
          medical_note: string | null;
          payment_status: "pending" | "paid" | "cancelled";
          stripe_session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          birth_date: string;
          email: string;
          phone: string;
          emergency_contact: string;
          category: string;
          medical_note?: string | null;
          payment_status?: "pending" | "paid" | "cancelled";
          stripe_session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          birth_date?: string;
          email?: string;
          phone?: string;
          emergency_contact?: string;
          category?: string;
          medical_note?: string | null;
          payment_status?: "pending" | "paid" | "cancelled";
          stripe_session_id?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
