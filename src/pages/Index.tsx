import { useState, useMemo } from "react";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import StudentTable from "@/components/StudentTable";
import AddStudentDialog from "@/components/AddStudentDialog";
import PaymentDialog from "@/components/PaymentDialog";
import PaymentHistoryDialog from "@/components/PaymentHistoryDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { downloadReceipt } from "@/components/ReceiptGenerator";
import { useStudents } from "@/hooks/useStudents";
import { usePayments } from "@/hooks/usePayments";
import { Student, Payment, MONTHS } from "@/types/database";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { students, loading: studentsLoading, addStudent, updateStudent, deleteStudent } = useStudents();
  const { payments, loading: paymentsLoading, addPayment } = usePayments();

  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const currentDate = new Date();
  const currentMonth = MONTHS[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const monthlyFee = students.reduce((acc, s) => acc + s.monthly_fee, 0);

    const currentMonthPayments = payments.filter(
      (p) => p.month_for === currentMonth && p.year_for === currentYear
    );
    const receivedFee = currentMonthPayments.reduce((acc, p) => acc + p.amount, 0);
    const pendingFee = monthlyFee - receivedFee;

    return {
      totalStudents,
      monthlyFee,
      receivedFee,
      pendingFee: Math.max(0, pendingFee),
    };
  }, [students, payments, currentMonth, currentYear]);

  const handleAddStudent = () => {
    setEditStudent(null);
    setAddStudentOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditStudent(student);
    setAddStudentOpen(true);
  };

  const handleStudentSubmit = async (data: Omit<Student, "id" | "created_at" | "updated_at">) => {
    if (editStudent) {
      await updateStudent(editStudent.id, data);
    } else {
      await addStudent(data);
    }
  };

  const handleRecordPayment = () => {
    setSelectedStudent(null);
    setPaymentOpen(true);
  };

  const handlePaymentForStudent = (student: Student) => {
    setSelectedStudent(student);
    setPaymentOpen(true);
  };

  const handleViewHistory = (student: Student) => {
    setSelectedStudent(student);
    setHistoryOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (studentToDelete) {
      await deleteStudent(studentToDelete.id);
      setDeleteOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleDownloadReceipt = (payment: Payment) => {
    const student = students.find((s) => s.id === payment.student_id);
    if (student) {
      downloadReceipt(student, payment);
    }
  };

  if (studentsLoading || paymentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAddStudent={handleAddStudent} onRecordPayment={handleRecordPayment} />

      <main className="container mx-auto px-4 py-8">
        <StatsCards {...stats} />
        <StudentTable
          students={students}
          payments={payments}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onEdit={handleEditStudent}
          onDelete={handleDeleteClick}
          onPayment={handlePaymentForStudent}
          onViewHistory={handleViewHistory}
        />
      </main>

      <AddStudentDialog
        open={addStudentOpen}
        onOpenChange={setAddStudentOpen}
        onSubmit={handleStudentSubmit}
        editStudent={editStudent}
      />

      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        students={students}
        onSubmit={addPayment}
        selectedStudent={selectedStudent}
      />

      <PaymentHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        student={selectedStudent}
        payments={payments}
        onDownloadReceipt={handleDownloadReceipt}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        student={studentToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;
