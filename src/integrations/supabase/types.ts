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
    PostgrestVersion: "14.5"
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
      blog_post_likes: {
        Row: {
          created_at: string
          id: string
          post_slug: string
          user_id: string | null
          visitor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_slug: string
          user_id?: string | null
          visitor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_slug?: string
          user_id?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          description: string
          id: string
          image_prompt: string | null
          is_published: boolean
          published_at: string
          read_time: string
          slug: string
          source: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category: string
          content: string
          created_at?: string
          description: string
          id?: string
          image_prompt?: string | null
          is_published?: boolean
          published_at?: string
          read_time?: string
          slug: string
          source?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          description?: string
          id?: string
          image_prompt?: string | null
          is_published?: boolean
          published_at?: string
          read_time?: string
          slug?: string
          source?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_briefs: {
        Row: {
          budget_text: string | null
          city: string | null
          company: string
          contact_name: string
          country: string
          created_at: string
          description: string
          email: string | null
          engagement: string
          id: string
          phone: string
          project_title: string
          skills_needed: string[]
          status: string
          timeline: string | null
          updated_at: string
        }
        Insert: {
          budget_text?: string | null
          city?: string | null
          company: string
          contact_name: string
          country?: string
          created_at?: string
          description: string
          email?: string | null
          engagement?: string
          id?: string
          phone: string
          project_title: string
          skills_needed?: string[]
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          budget_text?: string | null
          city?: string | null
          company?: string
          contact_name?: string
          country?: string
          created_at?: string
          description?: string
          email?: string | null
          engagement?: string
          id?: string
          phone?: string
          project_title?: string
          skills_needed?: string[]
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          certificate_type: string
          course_id: string | null
          course_name: string
          created_at: string | null
          date_issued: string | null
          faculty_id: string
          id: string
          issued_at: string | null
          issued_by: string
          student_name: string | null
        }
        Insert: {
          certificate_number: string
          certificate_type?: string
          course_id?: string | null
          course_name: string
          created_at?: string | null
          date_issued?: string | null
          faculty_id: string
          id?: string
          issued_at?: string | null
          issued_by?: string
          student_name?: string | null
        }
        Update: {
          certificate_number?: string
          certificate_type?: string
          course_id?: string | null
          course_name?: string
          created_at?: string | null
          date_issued?: string | null
          faculty_id?: string
          id?: string
          issued_at?: string | null
          issued_by?: string
          student_name?: string | null
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
      events: {
        Row: {
          address: string | null
          category: string
          city: string | null
          country: string | null
          created_at: string
          currency: string | null
          date_text: string | null
          description: string
          ends_at: string | null
          first_seen_at: string
          format: string
          id: string
          image_url: string | null
          is_expired: boolean
          is_featured: boolean
          is_free: boolean
          last_seen_at: string
          lat: number | null
          lng: number | null
          organizer: string
          price_text: string | null
          slug: string
          source_platform: string
          source_url: string
          starts_at: string | null
          state: string | null
          tags: string[]
          timezone: string | null
          title: string
          updated_at: string
          venue_name: string | null
        }
        Insert: {
          address?: string | null
          category?: string
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          date_text?: string | null
          description: string
          ends_at?: string | null
          first_seen_at?: string
          format?: string
          id?: string
          image_url?: string | null
          is_expired?: boolean
          is_featured?: boolean
          is_free?: boolean
          last_seen_at?: string
          lat?: number | null
          lng?: number | null
          organizer: string
          price_text?: string | null
          slug: string
          source_platform: string
          source_url: string
          starts_at?: string | null
          state?: string | null
          tags?: string[]
          timezone?: string | null
          title: string
          updated_at?: string
          venue_name?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          date_text?: string | null
          description?: string
          ends_at?: string | null
          first_seen_at?: string
          format?: string
          id?: string
          image_url?: string | null
          is_expired?: boolean
          is_featured?: boolean
          is_free?: boolean
          last_seen_at?: string
          lat?: number | null
          lng?: number | null
          organizer?: string
          price_text?: string | null
          slug?: string
          source_platform?: string
          source_url?: string
          starts_at?: string | null
          state?: string | null
          tags?: string[]
          timezone?: string | null
          title?: string
          updated_at?: string
          venue_name?: string | null
        }
        Relationships: []
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
      jobs: {
        Row: {
          company: string
          country: string | null
          created_at: string
          description: string
          employment_type: string
          first_seen_at: string
          id: string
          is_expired: boolean
          is_remote: boolean
          last_seen_at: string
          location: string | null
          posted_at: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          salary_unit: string | null
          slug: string
          source_platform: string
          source_url: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          company: string
          country?: string | null
          created_at?: string
          description: string
          employment_type?: string
          first_seen_at?: string
          id?: string
          is_expired?: boolean
          is_remote?: boolean
          last_seen_at?: string
          location?: string | null
          posted_at?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_unit?: string | null
          slug: string
          source_platform: string
          source_url: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          company?: string
          country?: string | null
          created_at?: string
          description?: string
          employment_type?: string
          first_seen_at?: string
          id?: string
          is_expired?: boolean
          is_remote?: boolean
          last_seen_at?: string
          location?: string | null
          posted_at?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_unit?: string | null
          slug?: string
          source_platform?: string
          source_url?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          channel: string
          contact: string
          created_at: string
          id: string
          interest: string
          name: string | null
          notes: string | null
          school: string | null
          source: string | null
        }
        Insert: {
          channel: string
          contact: string
          created_at?: string
          id?: string
          interest: string
          name?: string | null
          notes?: string | null
          school?: string | null
          source?: string | null
        }
        Update: {
          channel?: string
          contact?: string
          created_at?: string
          id?: string
          interest?: string
          name?: string | null
          notes?: string | null
          school?: string | null
          source?: string | null
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
      partner_listings: {
        Row: {
          apply_url: string | null
          created_at: string
          deadline: string | null
          description: string
          expires_at: string | null
          id: string
          is_active: boolean
          is_paid_placement: boolean
          kind: string
          location: string | null
          organisation: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          apply_url?: string | null
          created_at?: string
          deadline?: string | null
          description: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_paid_placement?: boolean
          kind: string
          location?: string | null
          organisation: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          apply_url?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_paid_placement?: boolean
          kind?: string
          location?: string | null
          organisation?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      role_matches: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          reason: string | null
          role_id: string
          score: number
          source: string
          status: string
          talent_profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string | null
          role_id: string
          score?: number
          source?: string
          status?: string
          talent_profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string | null
          role_id?: string
          score?: number
          source?: string
          status?: string
          talent_profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_matches_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "talent_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_matches_talent_profile_id_fkey"
            columns: ["talent_profile_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_applications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          role_id: string
          status: string
          talent_profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          role_id: string
          status?: string
          talent_profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          role_id?: string
          status?: string
          talent_profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_applications_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "talent_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_applications_talent_profile_id_fkey"
            columns: ["talent_profile_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_profiles: {
        Row: {
          admin_notes: string | null
          availability: string
          bio: string | null
          city: string | null
          country: string
          created_at: string
          cv_path: string | null
          email: string | null
          faculty_id: string | null
          full_name: string
          github_url: string | null
          headline: string | null
          hours_per_week: number | null
          id: string
          intro_video_url: string | null
          is_vetted: boolean
          linkedin_url: string | null
          phone: string | null
          portfolio_url: string | null
          profile_strength: number
          rate_amount: number | null
          rate_currency: string
          skill_details: Json
          skills: string[]
          source: string
          tools: string[]
          updated_at: string
          user_id: string | null
          vetted_at: string | null
          whatsapp: string | null
          work_mode: string
          years_experience: number | null
        }
        Insert: {
          admin_notes?: string | null
          availability?: string
          bio?: string | null
          city?: string | null
          country?: string
          created_at?: string
          cv_path?: string | null
          email?: string | null
          faculty_id?: string | null
          full_name: string
          github_url?: string | null
          headline?: string | null
          hours_per_week?: number | null
          id?: string
          intro_video_url?: string | null
          is_vetted?: boolean
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          profile_strength?: number
          rate_amount?: number | null
          rate_currency?: string
          skill_details?: Json
          skills?: string[]
          source?: string
          tools?: string[]
          updated_at?: string
          user_id?: string | null
          vetted_at?: string | null
          whatsapp?: string | null
          work_mode?: string
          years_experience?: number | null
        }
        Update: {
          admin_notes?: string | null
          availability?: string
          bio?: string | null
          city?: string | null
          country?: string
          created_at?: string
          cv_path?: string | null
          email?: string | null
          faculty_id?: string | null
          full_name?: string
          github_url?: string | null
          headline?: string | null
          hours_per_week?: number | null
          id?: string
          intro_video_url?: string | null
          is_vetted?: boolean
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          profile_strength?: number
          rate_amount?: number | null
          rate_currency?: string
          skill_details?: Json
          skills?: string[]
          source?: string
          tools?: string[]
          updated_at?: string
          user_id?: string | null
          vetted_at?: string | null
          whatsapp?: string | null
          work_mode?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      talent_roles: {
        Row: {
          apply_deadline: string | null
          budget_currency: string
          budget_max: number | null
          budget_min: number | null
          budget_unit: string
          city: string | null
          company: string
          country: string
          created_at: string
          created_by: string | null
          description: string
          employment_type: string
          id: string
          is_featured: boolean
          is_remote: boolean
          nice_to_have: string[]
          openings: number
          required_skills: string[]
          responsibilities: string[]
          role_kind: string
          seniority: string
          slug: string
          status: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          apply_deadline?: string | null
          budget_currency?: string
          budget_max?: number | null
          budget_min?: number | null
          budget_unit?: string
          city?: string | null
          company?: string
          country?: string
          created_at?: string
          created_by?: string | null
          description: string
          employment_type?: string
          id?: string
          is_featured?: boolean
          is_remote?: boolean
          nice_to_have?: string[]
          openings?: number
          required_skills?: string[]
          responsibilities?: string[]
          role_kind?: string
          seniority?: string
          slug: string
          status?: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          apply_deadline?: string | null
          budget_currency?: string
          budget_max?: number | null
          budget_min?: number | null
          budget_unit?: string
          city?: string | null
          company?: string
          country?: string
          created_at?: string
          created_by?: string | null
          description?: string
          employment_type?: string
          id?: string
          is_featured?: boolean
          is_remote?: boolean
          nice_to_have?: string[]
          openings?: number
          required_skills?: string[]
          responsibilities?: string[]
          role_kind?: string
          seniority?: string
          slug?: string
          status?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      archive_stale_listings: { Args: never; Returns: undefined }
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      seed_all_course_lectures: { Args: never; Returns: undefined }
      verify_certificate: {
        Args: { cert_number: string }
        Returns: {
          certificate_number: string
          certificate_type: string
          course_name: string
          date_issued: string
          issued_at: string
          issued_by: string
          student_name: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "recruiter" | "user"
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
      app_role: ["admin", "recruiter", "user"],
    },
  },
} as const
