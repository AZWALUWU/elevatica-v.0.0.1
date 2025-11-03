import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, LogOut, BookOpen, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      {user ? (
        <>
          <Link to="/research" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="hover:text-gold w-full md:w-auto">
              Research
            </Button>
          </Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="hover:text-gold w-full md:w-auto">
                <Crown className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="border-gold text-gold hover:bg-gold hover:text-black w-full md:w-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </>
      ) : (
        <Link to="/auth" onClick={() => setIsOpen(false)}>
          <Button className="bg-gradient-gold text-black hover:shadow-gold font-semibold w-full md:w-auto">
            Login / Register
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-gold rounded flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Elevatica
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-gold" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
