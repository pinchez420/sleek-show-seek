export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]


export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {


      events: {
        Row: {
          id: string
          title: string
          date: string
          venue: string
          price: string
          category: string
          image: string
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          date: string
          venue: string
          price: string
          category: string
          image: string
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          date?: string
          venue?: string
          price?: string
          category?: string
          image?: string
          created_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string
          event_id: string
          quantity: number
          amount_cents: number
          currency: string

          status: "pending" | "paid" | "processing" | "cancelled" | "refunded" | "failed"

          payment_method: "card" | "apple_pay" | "google_pay" | "paypal" | "mpesa"
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }


        Insert: {
          id?: string
          user_id: string
          event_id: string
          quantity?: number
          amount_cents: number
          currency?: string
          status?: "pending" | "paid" | "processing" | "cancelled" | "refunded" | "failed"
          payment_method?: "card" | "apple_pay" | "google_pay" | "paypal" | "mpesa"
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          quantity?: number
          amount_cents?: number
          currency?: string
          status?: "pending" | "paid" | "processing" | "cancelled" | "refunded" | "failed"
          payment_method?: "card" | "apple_pay" | "google_pay" | "paypal" | "mpesa"
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          event_id: string
          quantity: number
          unit_price_cents: number
          total_price_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          event_id: string
          quantity?: number
          unit_price_cents: number
          total_price_cents: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          event_id?: string
          quantity?: number
          unit_price_cents?: number
          total_price_cents?: number
          created_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          order_id: string
          stripe_payment_intent_id: string | null
          stripe_charge_id: string | null
          amount_cents: number
          currency: string
          status: "requires_payment_method" | "requires_confirmation" | "processing" | "succeeded" | "failed" | "cancelled"
          payment_method_type: string | null
          payment_method_details: Json | null
          created_at: string
          completed_at: string | null
          failed_at: string | null
          failure_reason: string | null
        }
        Insert: {
          id?: string
          order_id: string
          stripe_payment_intent_id?: string | null
          stripe_charge_id?: string | null
          amount_cents: number
          currency?: string
          status?: "requires_payment_method" | "requires_confirmation" | "processing" | "succeeded" | "failed" | "cancelled"
          payment_method_type?: string | null
          payment_method_details?: Json | null
          created_at?: string
          completed_at?: string | null
          failed_at?: string | null
          failure_reason?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          stripe_payment_intent_id?: string | null
          stripe_charge_id?: string | null
          amount_cents?: number
          currency?: string
          status?: "requires_payment_method" | "requires_confirmation" | "processing" | "succeeded" | "failed" | "cancelled"
          payment_method_type?: string | null
          payment_method_details?: Json | null
          created_at?: string
          completed_at?: string | null
          failed_at?: string | null
          failure_reason?: string | null
        }
        Relationships: []
      }
      receipts: {
        Row: {
          id: string
          order_id: string
          receipt_number: string
          pdf_url: string | null
          html_content: string | null
          sent_to_email: boolean
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          receipt_number?: string
          pdf_url?: string | null
          html_content?: string | null
          sent_to_email?: boolean
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          receipt_number?: string
          pdf_url?: string | null
          html_content?: string | null
          sent_to_email?: boolean
          sent_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          id: string
          order_id: string
          payment_id: string
          stripe_refund_id: string | null
          amount_cents: number
          currency: string
          status: "pending" | "succeeded" | "failed" | "cancelled"
          reason: "requested_by_customer" | "duplicate" | "fraudulent" | null
          requested_by: string | null
          processed_by: string | null
          requested_at: string
          processed_at: string | null
          failure_reason: string | null
        }
        Insert: {
          id?: string
          order_id: string
          payment_id: string
          stripe_refund_id?: string | null
          amount_cents: number
          currency?: string
          status?: "pending" | "succeeded" | "failed" | "cancelled"
          reason?: "requested_by_customer" | "duplicate" | "fraudulent" | null
          requested_by?: string | null
          processed_by?: string | null
          requested_at?: string
          processed_at?: string | null
          failure_reason?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          payment_id?: string
          stripe_refund_id?: string | null
          amount_cents?: number
          currency?: string
          status?: "pending" | "succeeded" | "failed" | "cancelled"
          reason?: "requested_by_customer" | "duplicate" | "fraudulent" | null
          requested_by?: string | null
          processed_by?: string | null
          requested_at?: string
          processed_at?: string | null
          failure_reason?: string | null
        }
        Relationships: []
      }

      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          id: string
          ticket_number: string
          qr_code_data: string
          event_id: string
          event_name: string
          user_id: string
          order_id: string
          status: string
          created_at: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          id?: string
          ticket_number: string
          qr_code_data: string
          event_id: string
          event_name: string
          user_id: string
          order_id: string
          status?: string
          created_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          id?: string
          ticket_number?: string
          qr_code_data?: string
          event_id?: string
          event_name?: string
          user_id?: string
          order_id?: string
          status?: string
          created_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
