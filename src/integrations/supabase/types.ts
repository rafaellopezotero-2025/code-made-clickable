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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      parties: {
        Row: {
          active: boolean
          code: string
          created_at: string
          cuit: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          role: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          cuit?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          cuit?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      price_list_lines: {
        Row: {
          id: string
          price_list_id: string
          product_id: string
          unit_price: number
        }
        Insert: {
          id?: string
          price_list_id: string
          product_id: string
          unit_price?: number
        }
        Update: {
          id?: string
          price_list_id?: string
          product_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "price_list_lines_price_list_id_fkey"
            columns: ["price_list_id"]
            isOneToOne: false
            referencedRelation: "price_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_list_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_lists: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string | null
          discount: number
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string | null
          discount?: number
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string | null
          discount?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          base_price: number
          code: string
          cost: number
          created_at: string
          description: string | null
          id: string
          name: string
          reorder_point: number
          stock: number
          tax_id: string | null
          type: string
        }
        Insert: {
          active?: boolean
          base_price?: number
          code: string
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          reorder_point?: number
          stock?: number
          tax_id?: string | null
          type?: string
        }
        Update: {
          active?: boolean
          base_price?: number
          code?: string
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          reorder_point?: number
          stock?: number
          tax_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_tax_id_fkey"
            columns: ["tax_id"]
            isOneToOne: false
            referencedRelation: "taxes"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_lines: {
        Row: {
          id: string
          line_total: number
          product_id: string
          purchase_id: string
          quantity: number
          unit_cost: number
        }
        Insert: {
          id?: string
          line_total?: number
          product_id: string
          purchase_id: string
          quantity?: number
          unit_cost?: number
        }
        Update: {
          id?: string
          line_total?: number
          product_id?: string
          purchase_id?: string
          quantity?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_lines_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          date: string
          id: string
          party_id: string
          state: string
          subtotal: number
          total: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          party_id: string
          state?: string
          subtotal?: number
          total?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          party_id?: string
          state?: string
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchases_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_lines: {
        Row: {
          id: string
          line_total: number
          product_id: string
          quantity: number
          sale_id: string
          unit_price: number
        }
        Insert: {
          id?: string
          line_total?: number
          product_id: string
          quantity?: number
          sale_id: string
          unit_price?: number
        }
        Update: {
          id?: string
          line_total?: number
          product_id?: string
          quantity?: number
          sale_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_lines_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          date: string
          id: string
          party_id: string
          price_list_id: string | null
          state: string
          subtotal: number
          total: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          party_id: string
          price_list_id?: string | null
          state?: string
          subtotal?: number
          total?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          party_id?: string
          price_list_id?: string | null
          state?: string
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_price_list_id_fkey"
            columns: ["price_list_id"]
            isOneToOne: false
            referencedRelation: "price_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      taxes: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          rate: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          rate?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          rate?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_stock_movement: {
        Args: { p_delta: number; p_product_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "administrador" | "caja" | "consultas"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["administrador", "caja", "consultas"],
    },
  },
} as const
