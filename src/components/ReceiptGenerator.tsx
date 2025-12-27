import { Student, Payment, HINDI_MONTHS, MONTHS } from "@/types/database";
import { format } from "date-fns";

interface ReceiptData {
  student: Student;
  payment: Payment;
  instituteName?: string;
  instituteAddress?: string;
}

export const generateReceiptHTML = (data: ReceiptData): string => {
  const { student, payment, instituteName = "ट्यूशन सेंटर", instituteAddress = "" } = data;

  const getHindiMonth = (month: string) => {
    const index = MONTHS.indexOf(month);
    return index >= 0 ? HINDI_MONTHS[index] : month;
  };

  const amountInWords = (num: number): string => {
    const ones = ['', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
      'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'];
    const tens = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];

    if (num === 0) return 'शून्य';
    if (num < 20) return ones[num];
    if (num < 100) {
      const tenPart = Math.floor(num / 10);
      const onePart = num % 10;
      return tens[tenPart] + (onePart ? ' ' + ones[onePart] : '');
    }
    if (num < 1000) {
      const hundredPart = Math.floor(num / 100);
      const remainder = num % 100;
      return ones[hundredPart] + ' सौ' + (remainder ? ' ' + amountInWords(remainder) : '');
    }
    if (num < 100000) {
      const thousandPart = Math.floor(num / 1000);
      const remainder = num % 1000;
      return amountInWords(thousandPart) + ' हज़ार' + (remainder ? ' ' + amountInWords(remainder) : '');
    }
    return num.toString();
  };

  return `
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>फीस रसीद - ${payment.receipt_no}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Poppins', 'Noto Sans Devanagari', sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .receipt {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border: 2px solid #4F46E5;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 2px dashed #4F46E5;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #4F46E5;
      font-size: 24px;
      font-weight: 700;
    }
    .header p {
      color: #666;
      font-size: 14px;
    }
    .receipt-title {
      text-align: center;
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      color: white;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 600;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-item {
      padding: 10px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .info-item label {
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }
    .info-item span {
      font-weight: 600;
      color: #333;
    }
    .amount-section {
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin: 20px 0;
    }
    .amount-section .amount {
      font-size: 32px;
      font-weight: 700;
    }
    .amount-section .words {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
    }
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px dashed #ddd;
    }
    .signature-box {
      text-align: center;
      width: 45%;
    }
    .signature-line {
      border-top: 2px solid #333;
      margin-top: 50px;
      padding-top: 10px;
      font-size: 14px;
      color: #666;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #eee;
      color: #999;
      font-size: 12px;
    }
    @media print {
      body { background: white; padding: 0; }
      .receipt { border: 1px solid #ccc; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>${instituteName}</h1>
      ${instituteAddress ? `<p>${instituteAddress}</p>` : ''}
    </div>

    <div class="receipt-title">
      फीस रसीद / FEE RECEIPT
    </div>

    <div class="info-grid">
      <div class="info-item">
        <label>रसीद संख्या / Receipt No.</label>
        <span>${payment.receipt_no}</span>
      </div>
      <div class="info-item">
        <label>तारीख / Date</label>
        <span>${format(new Date(payment.payment_date), 'dd/MM/yyyy')}</span>
      </div>
      <div class="info-item">
        <label>छात्र का नाम / Student Name</label>
        <span>${student.student_name}</span>
      </div>
      <div class="info-item">
        <label>रोल नं. / Roll No.</label>
        <span>${student.roll_no}</span>
      </div>
      <div class="info-item">
        <label>पिता का नाम / Father's Name</label>
        <span>${student.father_name}</span>
      </div>
      <div class="info-item">
        <label>कक्षा / Class</label>
        <span>${student.class}</span>
      </div>
      <div class="info-item">
        <label>फीस का महीना / Fee Month</label>
        <span>${getHindiMonth(payment.month_for)} ${payment.year_for}</span>
      </div>
      <div class="info-item">
        <label>भुगतान मोड / Payment Mode</label>
        <span>${payment.payment_mode}</span>
      </div>
    </div>

    <div class="amount-section">
      <div class="amount">₹${payment.amount.toLocaleString('en-IN')}</div>
      <div class="words">रुपये ${amountInWords(payment.amount)} मात्र</div>
    </div>

    ${payment.remarks ? `
    <div class="info-item" style="margin-bottom: 20px;">
      <label>टिप्पणी / Remarks</label>
      <span>${payment.remarks}</span>
    </div>
    ` : ''}

    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-line">छात्र/अभिभावक के हस्ताक्षर</div>
      </div>
      <div class="signature-box">
        <div class="signature-line">प्राधिकृत हस्ताक्षर</div>
      </div>
    </div>

    <div class="footer">
      <p>यह एक कंप्यूटर जनित रसीद है।</p>
      <p>This is a computer generated receipt.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const downloadReceipt = (student: Student, payment: Payment) => {
  const html = generateReceiptHTML({ student, payment });
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};
