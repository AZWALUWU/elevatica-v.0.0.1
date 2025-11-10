import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavigationPanel from '@/components/NavigationPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, LogOut, User, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  const userInitial = user.email?.[0].toUpperCase() || 'U';

  const handleResetPassword = async () => {
    if (!user.email) return;
    
    setIsResettingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Email Terkirim',
        description: 'Silakan cek email Anda untuk link reset password.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationPanel />
      
      <div className="md:pl-20 pb-16 md:pb-0">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Profil Pengguna
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Kelola informasi akun Anda
              </p>
            </div>

            <Card className="bg-secondary/30 border-gold/20">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24 border-4 border-gold/20">
                    <AvatarFallback className="text-3xl font-bold bg-gradient-gold text-black">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">Informasi Akun</CardTitle>
                <CardDescription>Detail profil dan pengaturan akun Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">User ID</p>
                      <p className="font-mono text-sm truncate">{user.id}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <Button
                    onClick={handleResetPassword}
                    disabled={isResettingPassword}
                    variant="outline"
                    className="w-full border-gold text-gold hover:bg-gold hover:text-black"
                  >
                    <KeyRound className="w-4 h-4 mr-2" />
                    {isResettingPassword ? 'Mengirim...' : 'Reset Password'}
                  </Button>
                  
                  <Button
                    onClick={signOut}
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Card className="bg-secondary/30 border-gold/20">
                <CardContent className="py-6">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Fitur Premium Segera Hadir!</strong><br />
                    Kami sedang mengembangkan fitur profil tambahan termasuk customisasi profil, preferensi notifikasi, dan banyak lagi.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
