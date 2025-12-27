import { Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student, Payment, HINDI_MONTHS, MONTHS } from "@/types/database";
import { format } from "date-fns";

interface PaymentHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  payments: Payment[];
  onDownloadReceipt: (payment: Payment) => void;
}

const PaymentHistoryDialog = ({
  open,
  onOpenChange,
  student,
  payments,
  onDownloadReceipt,
}: PaymentHistoryDialogProps) => {
  if (!student) return null;

  const studentPayments = payments
    .filter((p) => p.student_id === student.id)
    .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());

  const getHindiMonth = (month: string) => {
    const index = MONTHS.indexOf(month);
    return index >= 0 ? HINDI_MONTHS[index] : month;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            भुगतान इतिहास - {student.student_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">रोल नं.</p>
              <p className="font-medium">{student.roll_no}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">कक्षा</p>
              <p className="font-medium">{student.class}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">पिता का नाम</p>
              <p className="font-medium">{student.father_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">मासिक फीस</p>
              <p className="font-medium">₹{student.monthly_fee.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {studentPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              कोई भुगतान रिकॉर्ड नहीं मिला।
            </div>
          ) : (
            <div className="overflow-x-auto max-h-80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>रसीद नं.</TableHead>
                    <TableHead>महीना</TableHead>
                    <TableHead>राशि</TableHead>
                    <TableHead>तारीख</TableHead>
                    <TableHead>मोड</TableHead>
                    <TableHead className="text-right">रसीद</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.receipt_no}</TableCell>
                      <TableCell>
                        {getHindiMonth(payment.month_for)} {payment.year_for}
                      </TableCell>
                      <TableCell>₹{payment.amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        {format(new Date(payment.payment_date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>{payment.payment_mode}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownloadReceipt(payment)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          डाउनलोड
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentHistoryDialog;
