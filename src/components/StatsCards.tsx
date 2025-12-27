import { Users, IndianRupee, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  totalStudents: number;
  monthlyFee: number;
  receivedFee: number;
  pendingFee: number;
}

const StatsCards = ({ totalStudents, monthlyFee, receivedFee, pendingFee }: StatsCardsProps) => {
  const stats = [
    {
      title: "कुल छात्र",
      titleEn: "Total Students",
      value: totalStudents.toString(),
      icon: Users,
      gradient: "stat-card-blue",
    },
    {
      title: "इस महीने की फीस",
      titleEn: "This Month's Fee",
      value: `₹${monthlyFee.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      gradient: "stat-card-green",
    },
    {
      title: "प्राप्त फीस",
      titleEn: "Received Fee",
      value: `₹${receivedFee.toLocaleString('en-IN')}`,
      icon: CheckCircle,
      gradient: "stat-card-orange",
    },
    {
      title: "बाकी फीस",
      titleEn: "Pending Fee",
      value: `₹${pendingFee.toLocaleString('en-IN')}`,
      icon: Clock,
      gradient: "stat-card-red",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`${stat.gradient} border-0 text-stat-card animate-fade-in overflow-hidden`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/20">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
