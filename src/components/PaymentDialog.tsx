import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Student, MONTHS, HINDI_MONTHS } from "@/types/database";

const formSchema = z.object({
  student_id: z.string().min(1, "छात्र चुनें"),
  amount: z.string().min(1, "राशि आवश्यक है"),
  month_for: z.string().min(1, "महीना चुनें"),
  year_for: z.string().min(1, "वर्ष चुनें"),
  payment_mode: z.string().min(1, "भुगतान मोड चुनें"),
  remarks: z.string().optional(),
});

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
  onSubmit: (data: {
    student_id: string;
    amount: number;
    month_for: string;
    year_for: number;
    payment_mode: string;
    remarks?: string;
  }) => void;
  selectedStudent?: Student | null;
}

const PaymentDialog = ({
  open,
  onOpenChange,
  students,
  onSubmit,
  selectedStudent,
}: PaymentDialogProps) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = MONTHS[currentDate.getMonth()];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_id: "",
      amount: "",
      month_for: currentMonth,
      year_for: currentYear.toString(),
      payment_mode: "Cash",
      remarks: "",
    },
  });

  useEffect(() => {
    if (selectedStudent) {
      form.setValue("student_id", selectedStudent.id);
      form.setValue("amount", selectedStudent.monthly_fee.toString());
    }
  }, [selectedStudent, form]);

  useEffect(() => {
    if (!open) {
      form.reset({
        student_id: "",
        amount: "",
        month_for: currentMonth,
        year_for: currentYear.toString(),
        payment_mode: "Cash",
        remarks: "",
      });
    }
  }, [open, form, currentMonth, currentYear]);

  const handleStudentChange = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      form.setValue("amount", student.monthly_fee.toString());
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      student_id: values.student_id,
      amount: parseFloat(values.amount),
      month_for: values.month_for,
      year_for: parseInt(values.year_for),
      payment_mode: values.payment_mode,
      remarks: values.remarks,
    });
    form.reset();
    onOpenChange(false);
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">भुगतान दर्ज करें</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>छात्र चुनें</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleStudentChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="छात्र का नाम" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.roll_no} - {student.student_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month_for"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>महीना</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MONTHS.map((month, index) => (
                          <SelectItem key={month} value={month}>
                            {HINDI_MONTHS[index]} ({month})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year_for"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वर्ष</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>राशि (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payment_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>भुगतान मोड</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">नकद (Cash)</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Bank Transfer">बैंक ट्रांसफर</SelectItem>
                        <SelectItem value="Cheque">चेक</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>टिप्पणी (वैकल्पिक)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="कोई विशेष टिप्पणी" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                रद्द करें
              </Button>
              <Button type="submit">भुगतान दर्ज करें</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
