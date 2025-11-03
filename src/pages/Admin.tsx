import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';
import { format } from 'date-fns';

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

const Admin = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
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
  
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!isAdmin) {
      navigate('/research');
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges.',
        variant: 'destructive',
      });
      return;
    }

    fetchBlogs();
  }, [user, isAdmin, navigate]);

  const fetchBlogs = async () => {
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
      setLoading(false);
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
        supply: formData.supply ? (formData.supply) : null,
        demmand: formData.demmand ? (formData.demmand) : null,
        rate_setup: formData.rate_setup ? (formData.rate_setup) : null,
        fundamental: formData.fundamental ? (formData.fundamental) : null,
        indikator: formData.indikator ? (formData.indikator) : null,
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
          title: 'Success',
          description: 'Research paper updated successfully.',
        });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogData]);
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Research paper created successfully.',
        });
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
    if (!confirm('Are you sure you want to delete this research paper?')) return;
    
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Research paper deleted successfully.',
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
      supply: blog.supply?.toString() || '',
      demmand: blog.demmand?.toString() || '',
      rate_setup: blog.rate_setup?.toString() || '',
      fundamental: blog.fundamental?.toString() || '',
      indikator: blog.indikator?.toString() || '',
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

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={resetForm}
                  className="bg-gradient-gold text-black hover:shadow-gold font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Research
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-gold">
                    {editingBlog ? 'Edit Research Paper' : 'Update Blog'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Currency Pair</Label>
                      <Input
                        value={formData.pair}
                        onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
                        placeholder="EUR/USD"
                        required
                        className="bg-input border-border"
                      />
                    </div>
                    
                    <div>
                      <Label>Position</Label>
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
                    <Label>Content (Markdown supported)</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={10}
                      required
                      className="bg-input border-border font-mono"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>supply</Label>
                      <Input
                        type="string"
                        step="any"
                        value={formData.supply}
                        onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                    <div>
                      <Label>demmand</Label>
                      <Input
                        type="string"
                        step="any"
                        value={formData.demmand}
                        onChange={(e) => setFormData({ ...formData, demmand: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                    <div>
                      <Label>rate_setup</Label>
                      <Input
                        type="string"
                        step="any"
                        value={formData.rate_setup}
                        onChange={(e) => setFormData({ ...formData, rate_setup: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>fundamental</Label>
                      <Input
                        type="string"
                        step="any"
                        value={formData.fundamental}
                        onChange={(e) => setFormData({ ...formData, fundamental: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                    <div>
                      <Label>indikator</Label>
                      <Input
                        type="string"
                        step="any"
                        value={formData.indikator}
                        onChange={(e) => setFormData({ ...formData, indikator: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
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
                    {editingBlog ? 'Update Research' : 'Create Research'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid gap-4">
              {blogs.map((blog) => (
                <Card key={blog.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-foreground">{blog.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                          {blog.pair} • {blog.position.toUpperCase()} • {format(new Date(blog.created_at), 'MMM dd, yyyy')}
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
      </div>
    </div>
  );
};

export default Admin;
