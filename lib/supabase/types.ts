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
          belt: string | null;
          license_number: string | null;
          medical_note: string | null;
          medical_certificate_url: string | null;
          payment_status: "pending" | "paid" | "cancelled";
          payment_method: "carte" | "cheque" | "especes";
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
          belt?: string | null;
          license_number?: string | null;
          medical_note?: string | null;
          medical_certificate_url?: string | null;
          payment_status?: "pending" | "paid" | "cancelled";
          payment_method?: "carte" | "cheque" | "especes";
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
          belt?: string | null;
          license_number?: string | null;
          medical_note?: string | null;
          medical_certificate_url?: string | null;
          payment_status?: "pending" | "paid" | "cancelled";
          payment_method?: "carte" | "cheque" | "especes";
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
