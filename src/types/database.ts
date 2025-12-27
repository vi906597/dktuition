export interface Student {
  id: string;
  roll_no: string;
  student_name: string;
  father_name: string;
  contact_no: string;
  class: string;
  monthly_fee: number;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  month_for: string;
  year_for: number;
  receipt_no: string;
  payment_mode: string;
  remarks?: string;
  created_at: string;
}

export interface PaymentWithStudent extends Payment {
  students?: Student;
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const HINDI_MONTHS = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];
