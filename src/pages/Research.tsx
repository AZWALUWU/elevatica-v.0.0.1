import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  pair: string;
  position: string;
  created_at: string;
}

const Research = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchBlogs();
  }, [user, navigate]);

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                Research Library
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Access our collection of in-depth market analysis and research papers
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading research papers...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No research papers available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link key={blog.id} to={`/research/${blog.slug}`}>
                  <Card className="h-full bg-card border-border hover:border-gold hover:shadow-gold transition-all duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-gradient-gold text-black border-none">
                          {blog.pair}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`${
                            blog.position === 'long' 
                              ? 'border-green-500 text-green-500' 
                              : 'border-red-500 text-red-500'
                          }`}
                        >
                          {blog.position === 'long' ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {blog.position.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-foreground line-clamp-2">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="flex items-center text-muted-foreground mt-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(blog.created_at), 'MMM dd, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">
                        {blog.content.substring(0, 150)}...
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Research;
