import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emailSchema = z.object({
  email: z.string().email("सही ईमेल पता डालें"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए"),
  newPassword: z.string().min(6, "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए"),
  confirmPassword: z.string().min(6, "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "पासवर्ड मेल नहीं खाते",
  path: ["confirmPassword"],
});

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const handleEmailChange = async (values: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({
      email: values.email,
    });
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "त्रुटि",
        description: "ईमेल बदलने में समस्या हुई।",
        variant: "destructive",
      });
    } else {
      toast({
        title: "सफल",
        description: "नए ईमेल पर पुष्टि लिंक भेजा गया है।",
      });
      emailForm.reset();
      onOpenChange(false);
    }
  };

  const handlePasswordChange = async (values: z.infer<typeof passwordSchema>) => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
    });
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "त्रुटि",
        description: "पासवर्ड बदलने में समस्या हुई।",
        variant: "destructive",
      });
    } else {
      toast({
        title: "सफल",
        description: "पासवर्ड बदल गया!",
      });
      passwordForm.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>सेटिंग्स</DialogTitle>
          <DialogDescription>ईमेल या पासवर्ड बदलें</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="email">ईमेल बदलें</TabsTrigger>
            <TabsTrigger value="password">पासवर्ड बदलें</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleEmailChange)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>नया ईमेल</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="नया ईमेल पता" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      बदल रहा है...
                    </>
                  ) : (
                    "ईमेल बदलें"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="password">
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>वर्तमान पासवर्ड</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="वर्तमान पासवर्ड"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>नया पासवर्ड</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="नया पासवर्ड"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>पासवर्ड पुष्टि</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="पासवर्ड दोबारा डालें"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      बदल रहा है...
                    </>
                  ) : (
                    "पासवर्ड बदलें"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
