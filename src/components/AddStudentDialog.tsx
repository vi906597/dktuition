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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Student } from "@/types/database";

const formSchema = z.object({
  roll_no: z.string().min(1, "रोल नंबर आवश्यक है"),
  student_name: z.string().min(1, "छात्र का नाम आवश्यक है"),
  father_name: z.string().min(1, "पिता का नाम आवश्यक है"),
  contact_no: z.string().min(10, "सही संपर्क नंबर डालें"),
  class: z.string().min(1, "कक्षा आवश्यक है"),
  monthly_fee: z.string().min(1, "मासिक फीस आवश्यक है"),
  address: z.string().optional(),
});

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Student, "id" | "created_at" | "updated_at">) => void;
  editStudent?: Student | null;
}

const AddStudentDialog = ({
  open,
  onOpenChange,
  onSubmit,
  editStudent,
}: AddStudentDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roll_no: "",
      student_name: "",
      father_name: "",
      contact_no: "",
      class: "",
      monthly_fee: "",
      address: "",
    },
  });

  useEffect(() => {
    if (editStudent) {
      form.reset({
        roll_no: editStudent.roll_no,
        student_name: editStudent.student_name,
        father_name: editStudent.father_name,
        contact_no: editStudent.contact_no,
        class: editStudent.class,
        monthly_fee: editStudent.monthly_fee.toString(),
        address: editStudent.address || "",
      });
    } else {
      form.reset({
        roll_no: "",
        student_name: "",
        father_name: "",
        contact_no: "",
        class: "",
        monthly_fee: "",
        address: "",
      });
    }
  }, [editStudent, form, open]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      roll_no: values.roll_no,
      student_name: values.student_name,
      father_name: values.father_name,
      contact_no: values.contact_no,
      class: values.class,
      monthly_fee: parseFloat(values.monthly_fee),
      address: values.address,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editStudent ? "छात्र संपादित करें" : "नया छात्र जोड़ें"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roll_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>रोल नंबर</FormLabel>
                    <FormControl>
                      <Input placeholder="जैसे: 001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>कक्षा</FormLabel>
                    <FormControl>
                      <Input placeholder="जैसे: 10th" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="student_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>छात्र का नाम</FormLabel>
                  <FormControl>
                    <Input placeholder="छात्र का पूरा नाम" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="father_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>पिता का नाम</FormLabel>
                  <FormControl>
                    <Input placeholder="पिता का पूरा नाम" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>संपर्क नंबर</FormLabel>
                    <FormControl>
                      <Input placeholder="मोबाइल नंबर" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthly_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>मासिक फीस (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>पता (वैकल्पिक)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="पूरा पता" {...field} />
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
              <Button type="submit">
                {editStudent ? "अपडेट करें" : "जोड़ें"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
