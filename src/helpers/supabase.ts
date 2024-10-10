export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      battles: {
        Row: {
          battle_id: number
          created_at: string
          fcompetitor_result: number
          first_competitor: number
          scompetitor_result: number
          season_id: number
          second_competitor: number
        }
        Insert: {
          battle_id?: number
          created_at?: string
          fcompetitor_result: number
          first_competitor: number
          scompetitor_result: number
          season_id: number
          second_competitor: number
        }
        Update: {
          battle_id?: number
          created_at?: string
          fcompetitor_result?: number
          first_competitor?: number
          scompetitor_result?: number
          season_id?: number
          second_competitor?: number
        }
        Relationships: [
          {
            foreignKeyName: "battles_first_competitor_fkey"
            columns: ["first_competitor"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["competitor_id"]
          },
          {
            foreignKeyName: "battles_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["season_id"]
          },
          {
            foreignKeyName: "battles_second_competitor_fkey"
            columns: ["second_competitor"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["competitor_id"]
          },
        ]
      }
      competitors: {
        Row: {
          collection: string | null
          competitor_email: string
          competitor_id: number
          competitor_status:
            | Database["public"]["Enums"]["competitor_status"]
            | null
          isAdmin: boolean
          joinned_at: string
          name: string
          tournament_id: number
        }
        Insert: {
          collection?: string | null
          competitor_email?: string
          competitor_id?: number
          competitor_status?:
            | Database["public"]["Enums"]["competitor_status"]
            | null
          isAdmin?: boolean
          joinned_at?: string
          name: string
          tournament_id: number
        }
        Update: {
          collection?: string | null
          competitor_email?: string
          competitor_id?: number
          competitor_status?:
            | Database["public"]["Enums"]["competitor_status"]
            | null
          isAdmin?: boolean
          joinned_at?: string
          name?: string
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "competitors_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["tournament_id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          season_id: number
          season_name: string
          season_status: Database["public"]["Enums"]["season_status"]
          tournament_id: number
        }
        Insert: {
          created_at?: string
          season_id?: number
          season_name?: string
          season_status?: Database["public"]["Enums"]["season_status"]
          tournament_id: number
        }
        Update: {
          created_at?: string
          season_id?: number
          season_name?: string
          season_status?: Database["public"]["Enums"]["season_status"]
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "seasons_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["tournament_id"]
          },
        ]
      }
      tournaments: {
        Row: {
          active: boolean
          created_at: string
          is_public: boolean
          tournament_id: number
          tournament_name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          is_public?: boolean
          tournament_id?: number
          tournament_name?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          is_public?: boolean
          tournament_id?: number
          tournament_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      random_code_tournament: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      competitor_status: "WAPPR" | "APPR"
      season_status: "CURRENT" | "OLD"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
