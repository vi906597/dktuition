import { GraduationCap, UserPlus, IndianRupee, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onAddStudent: () => void;
  onRecordPayment: () => void;
}

const Header = ({ onAddStudent, onRecordPayment }: HeaderProps) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="gradient-header text-primary-foreground py-6 px-6 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl glass-effect">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">ट्यूशन फीस प्रबंधन</h1>
            <p className="text-primary-foreground/80 text-sm md:text-base">
              छात्रों की फीस का हिसाब-किताब
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onAddStudent}
            variant="secondary"
            className="flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">नया छात्र</span>
          </Button>
          <Button
            onClick={onRecordPayment}
            className="flex items-center gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <IndianRupee className="h-4 w-4" />
            <span className="hidden sm:inline">भुगतान दर्ज करें</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground ml-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline max-w-[120px] truncate">
                  {user?.email?.split('@')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="text-muted-foreground text-sm">
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                लॉगआउट करें
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
