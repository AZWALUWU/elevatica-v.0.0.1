import { Link, useLocation } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import homeIcon from '@/assets/home.png';
import marketAnalysisIcon from '@/assets/market-analysis.png';
import userIcon from '@/assets/user.png';

const NavigationPanel = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Home', icon: homeIcon, path: '/home' },
    { name: 'Riset', icon: marketAnalysisIcon, path: '/research' },
    { name: 'Profile', icon: userIcon, path: '/profile' },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <>
      {/* Desktop - Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-20 bg-secondary/30 border-r border-border flex-col items-center py-8 z-40">
        <TooltipProvider>
          <nav className="flex flex-col items-center space-y-6">
            {navItems.map((item) => (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={`
                      relative p-3 rounded-xl transition-all duration-300
                      ${isActive(item.path) 
                        ? 'bg-gold/20 shadow-lg shadow-gold/20' 
                        : 'hover:bg-muted/50'
                      }
                    `}
                  >
                    <img 
                      src={item.icon} 
                      alt={item.name}
                      className={`w-8 h-8 transition-all duration-300 ${
                        isActive(item.path) ? 'brightness-0 invert' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                    {isActive(item.path) && (
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold rounded-r-full"></div>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-card border-border">
                  <p className="text-sm font-medium">{item.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </TooltipProvider>
      </aside>

      {/* Mobile - Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-secondary/95 backdrop-blur-md border-t border-border z-50">
        <div className="flex items-center justify-evenly h-full px-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300
                ${isActive(item.path) 
                  ? 'bg-gold/20' 
                  : 'active:bg-muted/30'
                }
              `}
            >
              <img 
                src={item.icon} 
                alt={item.name}
                className={`w-6 h-6 transition-all duration-300 ${
                  isActive(item.path) ? 'brightness-0 invert' : 'opacity-70'
                }`}
              />
              <span className={`text-xs mt-1 transition-colors duration-300 ${
                isActive(item.path) ? 'text-gold font-medium' : 'text-muted-foreground'
              }`}>
                {item.name}
              </span>
              {isActive(item.path) && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gold rounded-b-full"></div>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default NavigationPanel;
