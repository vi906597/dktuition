-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_no TEXT NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  contact_no TEXT NOT NULL,
  class TEXT NOT NULL,
  monthly_fee NUMERIC NOT NULL DEFAULT 0,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  month_for TEXT NOT NULL,
  year_for INTEGER NOT NULL,
  receipt_no TEXT NOT NULL UNIQUE,
  payment_mode TEXT DEFAULT 'Cash',
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on students
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (allowing public access for this school management system)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a school admin system)
CREATE POLICY "Allow all operations on students" 
ON public.students 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on payments" 
ON public.payments 
FOR ALL 
USING (true)
WITH CHECK (true);