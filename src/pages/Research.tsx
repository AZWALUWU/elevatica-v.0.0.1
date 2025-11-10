import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import NavigationPanel from '@/components/NavigationPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  pair: string;
  position: string;
  created_at: string;
}

type Category = 'all' | 'forex' | 'crypto' | 'stock';

const getCategory = (pair: string): 'forex' | 'crypto' | 'stock' => {
  const upperPair = pair.toUpperCase();
  const cryptoSymbols = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL', 'ADA', 'DOT', 'DOGE', 'XRP', 'MATIC', 'AVAX'];
  
  if (cryptoSymbols.some(symbol => upperPair.includes(symbol))) {
    return 'crypto';
  }
  
  if (upperPair.includes('/') && !cryptoSymbols.some(symbol => upperPair.includes(symbol))) {
    return 'forex';
  }
  
  return 'stock';
};

const Research = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredBlogs = blogs.filter(blog => {
    if (selectedCategory === 'all') return true;
    return getCategory(blog.pair) === selectedCategory;
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchBlogs();

    // Subscribe to realtime changes for new blog posts
    const channel = supabase
      .channel('blogs-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'blogs'
        },
        (payload) => {
          const newBlog = payload.new as Blog;
          setBlogs(prevBlogs => [newBlog, ...prevBlogs]);
          
          const category = getCategory(newBlog.pair);
          const categoryLabel = category === 'forex' ? 'Forex' : category === 'crypto' ? 'Crypto' : 'Stock';
          
          toast({
            title: `📚 Riset ${categoryLabel} Baru!`,
            description: `${newBlog.title} - ${newBlog.pair} (${newBlog.position.toUpperCase()})`,
            duration: 5000,
          });

          // Send push notification if supported and permission granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Riset ${categoryLabel} Baru Tersedia!`, {
              body: `${newBlog.title} - ${newBlog.pair} (${newBlog.position.toUpperCase()})`,
              icon: '/logo-192.png',
              badge: '/logo-192.png',
              tag: `research-${newBlog.id}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'blogs'
        },
        (payload) => {
          const updatedBlog = payload.new as Blog;
          setBlogs(prevBlogs => 
            prevBlogs.map(blog => 
              blog.id === updatedBlog.id ? updatedBlog : blog
            )
          );
          
          toast({
            title: '🔄 Riset Diperbarui!',
            description: `${updatedBlog.title} telah diperbarui`,
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate, toast]);

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
      <NavigationPanel />
      
      <div className="md:pl-20 pb-16 md:pb-0">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Research Library
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Access our collection of in-depth market analysis and research papers
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-gradient-gold text-black' : ''}
              >
                All Research
              </Button>
              <Button
                variant={selectedCategory === 'forex' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('forex')}
                className={selectedCategory === 'forex' ? 'bg-gradient-gold text-black' : ''}
              >
                Forex
              </Button>
              <Button
                variant={selectedCategory === 'crypto' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('crypto')}
                className={selectedCategory === 'crypto' ? 'bg-gradient-gold text-black' : ''}
              >
                Crypto
              </Button>
              <Button
                variant={selectedCategory === 'stock' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('stock')}
                className={selectedCategory === 'stock' ? 'bg-gradient-gold text-black' : ''}
              >
                Stock
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading research papers...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {selectedCategory === 'all' 
                  ? 'No research papers available yet.' 
                  : `No ${selectedCategory} research papers available yet.`}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
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
    </div>
  );
};

export default Research;
