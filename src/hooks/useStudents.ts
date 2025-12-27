import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("roll_no");

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      toast({
        title: "त्रुटि",
        description: "छात्रों की सूची लोड करने में समस्या हुई।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData: Omit<Student, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("students")
        .insert([studentData])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("यह रोल नंबर पहले से मौजूद है।");
        }
        throw error;
      }

      setStudents((prev) => [...prev, data]);
      toast({
        title: "सफल",
        description: "नया छात्र जोड़ा गया।",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "त्रुटि",
        description: error.message || "छात्र जोड़ने में समस्या हुई।",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from("students")
        .update(studentData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setStudents((prev) =>
        prev.map((s) => (s.id === id ? data : s))
      );
      toast({
        title: "सफल",
        description: "छात्र की जानकारी अपडेट की गई।",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "त्रुटि",
        description: "अपडेट करने में समस्या हुई।",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: "सफल",
        description: "छात्र हटा दिया गया।",
      });
    } catch (error: any) {
      toast({
        title: "त्रुटि",
        description: "हटाने में समस्या हुई।",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents,
  };
};
