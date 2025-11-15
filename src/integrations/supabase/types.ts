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
      ai_class_content: {
        Row: {
          class_number: number
          course_id: string
          created_at: string | null
          description: string
          handout_content: string
          id: string
          resources: Json | null
          summary: string
          title: string
          updated_at: string | null
        }
        Insert: {
          class_number: number
          course_id: string
          created_at?: string | null
          description: string
          handout_content: string
          id?: string
          resources?: Json | null
          summary: string
          title: string
          updated_at?: string | null
        }
        Update: {
          class_number?: number
          course_id?: string
          created_at?: string | null
          description?: string
          handout_content?: string
          id?: string
          resources?: Json | null
          summary?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_class_content_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          course_name: string
          created_at: string | null
          faculty_id: string
          id: string
          issued_at: string | null
        }
        Insert: {
          certificate_number: string
          course_id: string
          course_name: string
          created_at?: string | null
          faculty_id: string
          id?: string
          issued_at?: string | null
        }
        Update: {
          certificate_number?: string
          course_id?: string
          course_name?: string
          created_at?: string | null
          faculty_id?: string
          id?: string
          issued_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          course_id: string
          created_at: string
          enrollment_date: string
          faculty_id: string
          id: string
          status: string
        }
        Insert: {
          course_id: string
          created_at?: string
          enrollment_date?: string
          faculty_id: string
          id?: string
          status?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          enrollment_date?: string
          faculty_id?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_ids"
            referencedColumns: ["faculty_id"]
          },
        ]
      }
      course_progress: {
        Row: {
          classes_completed: number | null
          completed_at: string | null
          course_id: string
          created_at: string
          faculty_id: string
          id: string
          last_accessed: string
          progress_percentage: number
          updated_at: string
        }
        Insert: {
          classes_completed?: number | null
          completed_at?: string | null
          course_id: string
          created_at?: string
          faculty_id: string
          id?: string
          last_accessed?: string
          progress_percentage?: number
          updated_at?: string
        }
        Update: {
          classes_completed?: number | null
          completed_at?: string | null
          course_id?: string
          created_at?: string
          faculty_id?: string
          id?: string
          last_accessed?: string
          progress_percentage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_ids"
            referencedColumns: ["faculty_id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          department: string
          description: string | null
          duration_weeks: number | null
          id: string
          name: string
          plan_required: string
          updated_at: string
          whatsapp_group_link: string | null
        }
        Insert: {
          created_at?: string
          department: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          name: string
          plan_required?: string
          updated_at?: string
          whatsapp_group_link?: string | null
        }
        Update: {
          created_at?: string
          department?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          name?: string
          plan_required?: string
          updated_at?: string
          whatsapp_group_link?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          coupon_code: string | null
          created_at: string
          enrollment_date: string
          faculty_id: string
          id: string
          learning_mode: string | null
          plan_name: string
          status: string
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string
          enrollment_date?: string
          faculty_id: string
          id?: string
          learning_mode?: string | null
          plan_name: string
          status?: string
        }
        Update: {
          coupon_code?: string | null
          created_at?: string
          enrollment_date?: string
          faculty_id?: string
          id?: string
          learning_mode?: string | null
          plan_name?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty_ids"
            referencedColumns: ["faculty_id"]
          },
        ]
      }
      faculty_ids: {
        Row: {
          course_interest: string
          created_at: string
          department: string | null
          email: string
          faculty_id: string
          hear_about_us: string
          id: string
          name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          course_interest: string
          created_at?: string
          department?: string | null
          email: string
          faculty_id: string
          hear_about_us: string
          id?: string
          name: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          course_interest?: string
          created_at?: string
          department?: string | null
          email?: string
          faculty_id?: string
          hear_about_us?: string
          id?: string
          name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_at: string | null
          company: string
          cover_letter: string | null
          created_at: string | null
          faculty_id: string
          id: string
          position: string
          resume_url: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          company: string
          cover_letter?: string | null
          created_at?: string | null
          faculty_id: string
          id?: string
          position: string
          resume_url?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          company?: string
          cover_letter?: string | null
          created_at?: string | null
          faculty_id?: string
          id?: string
          position?: string
          resume_url?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lectures: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          meeting_link: string | null
          scheduled_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          scheduled_at: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_link?: string | null
          scheduled_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lectures_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cohort_month: number | null
          cohort_year: number | null
          created_at: string
          department: string | null
          email: string
          faculty_id: string
          id: string
          learning_mode: string | null
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          cohort_month?: number | null
          cohort_year?: number | null
          created_at?: string
          department?: string | null
          email: string
          faculty_id: string
          id: string
          learning_mode?: string | null
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          cohort_month?: number | null
          cohort_year?: number | null
          created_at?: string
          department?: string | null
          email?: string
          faculty_id?: string
          id?: string
          learning_mode?: string | null
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_course_lectures: {
        Args: { course_uuid: string }
        Returns: undefined
      }
      generate_faculty_id: {
        Args: {
          cohort_mo: number
          cohort_yr: number
          dept_name: string
          learn_mode: string
        }
        Returns: string
      }
      get_department_code: { Args: { dept: string }; Returns: string }
      seed_all_course_lectures: { Args: never; Returns: undefined }
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
