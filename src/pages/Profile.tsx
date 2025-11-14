import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavigationPanel from '@/components/NavigationPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, LogOut, User, KeyRound, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const sendPushNotification = async (blogId: string, title: string) => {
  try {
    await supabase.functions.invoke('send-push-notification', {
      body: {
        title: 'Research Baru Elevatica',
        body: title,
        blogId
      }
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  pair: string;
  position: string;
  supply: string | null;
  demmand: string | null;
  rate_setup: string | null;
  fundamental: string | null;
  indikator: string | null;
  pdf_url: string | null;
  created_at: string;
}

const Profile = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    pair: '',
    position: 'long',
    supply: '',
    demmand: '',
    rate_setup: '',
    fundamental: '',
    indikator: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (isAdmin) {
      fetchBlogs();
    }
  }, [user, navigate, isAdmin]);

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      let pdfUrl = editingBlog?.pdf_url || null;
      
      if (pdfFile) {
        const fileExt = pdfFile.name.split('.').pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('research-pdfs')
          .upload(fileName, pdfFile);
        
        if (uploadError) throw uploadError;
        pdfUrl = fileName;
      }

      const blogData = {
        title: formData.title,
        slug,
        content: formData.content,
        pair: formData.pair,
        position: formData.position,
        supply: formData.supply || null,
        demmand: formData.demmand || null,
        rate_setup: formData.rate_setup || null,
        fundamental: formData.fundamental || null,
        indikator: formData.indikator || null,
        pdf_url: pdfUrl,
        author_id: user!.id,
      };

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id);
        
        if (error) throw error;
        
        toast({
          title: 'Berhasil',
          description: 'Research berhasil diperbarui.',
        });
      } else {
        const { data, error } = await supabase
          .from('blogs')
          .insert([blogData])
          .select();
        
        if (error) throw error;
        
        toast({
          title: 'Berhasil',
          description: 'Research berhasil dibuat.',
        });

        // Send push notification for new research
        if (data && data[0]) {
          await sendPushNotification(data[0].id, blogData.title);
        }
      }

      setDialogOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus research ini?')) return;
    
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Berhasil',
        description: 'Research berhasil dihapus.',
      });
      
      fetchBlogs();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      pair: blog.pair,
      position: blog.position,
      supply: blog.supply || '',
      demmand: blog.demmand || '',
      rate_setup: blog.rate_setup || '',
      fundamental: blog.fundamental || '',
      indikator: blog.indikator || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      content: '',
      pair: '',
      position: 'long',
      supply: '',
      demmand: '',
      rate_setup: '',
      fundamental: '',
      indikator: '',
    });
    setPdfFile(null);
  };

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
      
      <div className="pb-24 md:pb-12">
        <div className="container mx-auto px-4 pt-12 pb-12">
          <div className="max-w-4xl mx-auto">
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

            {/* Admin Section */}
            {isAdmin && (
              <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">
                    <span className="bg-gradient-gold bg-clip-text text-transparent">
                      Admin Panel
                    </span>
                  </h2>
                  
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={resetForm}
                        className="bg-gradient-gold text-black hover:shadow-gold font-semibold"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Research
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
                      <DialogHeader>
                        <DialogTitle className="text-gold">
                          {editingBlog ? 'Edit Research' : 'Tambah Research Baru'}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label>Judul</Label>
                          <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Pair</Label>
                            <Input
                              value={formData.pair}
                              onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
                              placeholder="EUR/USD atau BTC/USDT"
                              required
                              className="bg-input border-border"
                            />
                          </div>
                          
                          <div>
                            <Label>Posisi</Label>
                            <Select
                              value={formData.position}
                              onValueChange={(value) => setFormData({ ...formData, position: value })}
                            >
                              <SelectTrigger className="bg-input border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="long">Long</SelectItem>
                                <SelectItem value="short">Short</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Konten</Label>
                          <Textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={8}
                            required
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Supply Zone</Label>
                            <Input
                              value={formData.supply}
                              onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                              className="bg-input border-border"
                            />
                          </div>
                          <div>
                            <Label>Demand Zone</Label>
                            <Input
                              value={formData.demmand}
                              onChange={(e) => setFormData({ ...formData, demmand: e.target.value })}
                              className="bg-input border-border"
                            />
                          </div>
                          <div>
                            <Label>Rate Setup</Label>
                            <Input
                              value={formData.rate_setup}
                              onChange={(e) => setFormData({ ...formData, rate_setup: e.target.value })}
                              className="bg-input border-border"
                            />
                          </div>
                          <div>
                            <Label>Fundamental</Label>
                            <Input
                              value={formData.fundamental}
                              onChange={(e) => setFormData({ ...formData, fundamental: e.target.value })}
                              className="bg-input border-border"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Indikator</Label>
                          <Input
                            value={formData.indikator}
                            onChange={(e) => setFormData({ ...formData, indikator: e.target.value })}
                            className="bg-input border-border"
                          />
                        </div>

                        <div>
                          <Label>PDF File</Label>
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                            className="bg-input border-border"
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-gold text-black hover:shadow-gold font-semibold"
                        >
                          {editingBlog ? 'Update Research' : 'Buat Research'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {loadingBlogs ? (
                  <p className="text-center text-muted-foreground">Loading...</p>
                ) : (
                  <div className="grid gap-4">
                    {blogs.map((blog) => (
                      <Card key={blog.id} className="bg-secondary/30 border-gold/20">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-foreground">{blog.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-2">
                                {blog.pair} • {blog.position.toUpperCase()} • {format(new Date(blog.created_at), 'dd MMM yyyy')}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(blog)}
                                className="border-gold text-gold hover:bg-gold hover:text-black"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(blog.id)}
                                className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-2">{blog.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
