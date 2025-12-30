-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow all operations on students" ON public.students;
DROP POLICY IF EXISTS "Allow all operations on payments" ON public.payments;

-- Create authenticated-only policies for students table
CREATE POLICY "Authenticated users can view students"
  ON public.students
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert students"
  ON public.students
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update students"
  ON public.students
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete students"
  ON public.students
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create authenticated-only policies for payments table
CREATE POLICY "Authenticated users can view payments"
  ON public.payments
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert payments"
  ON public.payments
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update payments"
  ON public.payments
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete payments"
  ON public.payments
  FOR DELETE
  USING (auth.uid() IS NOT NULL);