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
          address: string;
          postal_code: string;
          city: string;
          phone_alt: string | null;
          social_security_number: string;
          is_self_registration: boolean | null;
          guardian_first_name: string | null;
          guardian_last_name: string | null;
          guardian_address: string | null;
          guardian_postal_code: string | null;
          guardian_city: string | null;
          guardian_phone: string | null;
          guardian_email: string | null;
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
          emergency_contact?: string;
          category: string;
          belt?: string | null;
          license_number?: string | null;
          medical_note?: string | null;
          medical_certificate_url?: string | null;
          address?: string;
          postal_code?: string;
          city?: string;
          phone_alt?: string | null;
          social_security_number?: string;
          is_self_registration?: boolean | null;
          guardian_first_name?: string | null;
          guardian_last_name?: string | null;
          guardian_address?: string | null;
          guardian_postal_code?: string | null;
          guardian_city?: string | null;
          guardian_phone?: string | null;
          guardian_email?: string | null;
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
          address?: string;
          postal_code?: string;
          city?: string;
          phone_alt?: string | null;
          social_security_number?: string;
          is_self_registration?: boolean | null;
          guardian_first_name?: string | null;
          guardian_last_name?: string | null;
          guardian_address?: string | null;
          guardian_postal_code?: string | null;
          guardian_city?: string | null;
          guardian_phone?: string | null;
          guardian_email?: string | null;
          payment_status?: "pending" | "paid" | "cancelled";
          payment_method?: "carte" | "cheque" | "especes";
          stripe_session_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      professors: {
        Row: {
          id: string;
          name: string;
          grade: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          grade: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          grade?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      schedule_slots: {
        Row: {
          id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          category_label: string;
          professor_name: string;
          level: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          category_label: string;
          professor_name: string;
          level?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          category_label?: string;
          professor_name?: string;
          level?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          file_path: string;
          file_name: string;
          file_size: number;
          mime_type: string | null;
          display_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          file_path: string;
          file_name: string;
          file_size?: number;
          mime_type?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          file_path?: string;
          file_name?: string;
          file_size?: number;
          mime_type?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      gallery_images: {
        Row: {
          id: string;
          title: string | null;
          caption: string | null;
          file_path: string;
          file_name: string;
          file_size: number;
          mime_type: string | null;
          display_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          caption?: string | null;
          file_path: string;
          file_name: string;
          file_size?: number;
          mime_type?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          caption?: string | null;
          file_path?: string;
          file_name?: string;
          file_size?: number;
          mime_type?: string | null;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      news: {
        Row: {
          id: string;
          title: string;
          excerpt: string;
          content: string | null;
          published: boolean;
          published_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          excerpt: string;
          content?: string | null;
          published?: boolean;
          published_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          excerpt?: string;
          content?: string | null;
          published?: boolean;
          published_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          age_range: string | null;
          subject: string;
          message: string;
          newsletter: boolean;
          status: "new" | "handled";
          created_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          age_range?: string | null;
          subject: string;
          message: string;
          newsletter?: boolean;
          status?: "new" | "handled";
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          age_range?: string | null;
          subject?: string;
          message?: string;
          newsletter?: boolean;
          status?: "new" | "handled";
          created_at?: string;
        };
        Relationships: [];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
