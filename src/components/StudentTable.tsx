import { useState } from "react";
import { Edit2, Trash2, IndianRupee, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student, Payment } from "@/types/database";

interface StudentTableProps {
  students: Student[];
  payments: Payment[];
  currentMonth: string;
  currentYear: number;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onPayment: (student: Student) => void;
  onViewHistory: (student: Student) => void;
}

const StudentTable = ({
  students,
  payments,
  currentMonth,
  currentYear,
  onEdit,
  onDelete,
  onPayment,
  onViewHistory,
}: StudentTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getPaymentStatus = (studentId: string) => {
    const payment = payments.find(
      (p) =>
        p.student_id === studentId &&
        p.month_for === currentMonth &&
        p.year_for === currentYear
    );
    return payment ? "paid" : "pending";
  };

  const filteredStudents = students.filter(
    (student) =>
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.father_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentDate = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const hindiMonths = [
    "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
  ];

  return (
    <Card className="animate-fade-in shadow-lg border-0">
      <CardHeader className="border-b bg-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold">
            छात्र सूची - {hindiMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">रोल नं.</TableHead>
                <TableHead className="font-semibold">छात्र का नाम</TableHead>
                <TableHead className="font-semibold">पिता का नाम</TableHead>
                <TableHead className="font-semibold">संपर्क नं.</TableHead>
                <TableHead className="font-semibold">कक्षा</TableHead>
                <TableHead className="font-semibold">मासिक फीस</TableHead>
                <TableHead className="font-semibold">स्थिति</TableHead>
                <TableHead className="font-semibold text-right">कार्रवाई</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    कोई छात्र नहीं मिला। नया छात्र जोड़ें।
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  const status = getPaymentStatus(student.id);
                  return (
                    <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{student.roll_no}</TableCell>
                      <TableCell className="font-medium">{student.student_name}</TableCell>
                      <TableCell>{student.father_name}</TableCell>
                      <TableCell>{student.contact_no}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>₹{student.monthly_fee.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <Badge
                          variant={status === "paid" ? "default" : "destructive"}
                          className={status === "paid" 
                            ? "bg-stat-green hover:bg-stat-green/90" 
                            : "bg-stat-red hover:bg-stat-red/90"
                          }
                        >
                          {status === "paid" ? "भुगतान हुआ" : "बाकी"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewHistory(student)}
                            title="इतिहास देखें"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onPayment(student)}
                            title="भुगतान करें"
                          >
                            <IndianRupee className="h-4 w-4 text-stat-green" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(student)}
                            title="संपादित करें"
                          >
                            <Edit2 className="h-4 w-4 text-stat-blue" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(student)}
                            title="हटाएं"
                          >
                            <Trash2 className="h-4 w-4 text-stat-red" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentTable;
