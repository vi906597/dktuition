import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Payment } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const generateReceiptNo = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `RCP${year}${month}${day}${random}`;
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      toast({
        title: "त्रुटि",
        description: "भुगतान रिकॉर्ड लोड करने में समस्या हुई।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async (paymentData: {
    student_id: string;
    amount: number;
    month_for: string;
    year_for: number;
    payment_mode: string;
    remarks?: string;
  }) => {
    try {
      // Check if payment already exists for this month
      const existingPayment = payments.find(
        (p) =>
          p.student_id === paymentData.student_id &&
          p.month_for === paymentData.month_for &&
          p.year_for === paymentData.year_for
      );

      if (existingPayment) {
        throw new Error("इस महीने का भुगतान पहले से दर्ज है।");
      }

      const { data, error } = await supabase
        .from("payments")
        .insert([
          {
            ...paymentData,
            receipt_no: generateReceiptNo(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setPayments((prev) => [data, ...prev]);
      toast({
        title: "सफल",
        description: "भुगतान दर्ज किया गया।",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "त्रुटि",
        description: error.message || "भुगतान दर्ज करने में समस्या हुई।",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    addPayment,
    refetch: fetchPayments,
  };
};
