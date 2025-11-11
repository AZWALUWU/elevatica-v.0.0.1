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
      {/* Desktop - Left Sidebar Yellow Pill */}
      <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-40">
        <div className="bg-gold rounded-full p-4 shadow-gold-lg">
          <TooltipProvider>
            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item) => (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className="group relative"
                    >
                      <img 
                        src={item.icon} 
                        alt={item.name}
                        className="w-8 h-8 transition-all duration-300 brightness-0"
                      />
                      {isActive(item.path) && (
                        <div className="absolute inset-0 rounded-full bg-black/20 animate-pulse"></div>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gold text-black border-0">
                    <p className="text-sm font-semibold">{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </TooltipProvider>
        </div>
      </aside>

      {/* Mobile - Bottom Bar Yellow Pill */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-gold rounded-full px-8 py-3 shadow-gold-lg">
          <div className="flex items-center gap-12">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="relative group"
              >
                <img 
                  src={item.icon} 
                  alt={item.name}
                  className="w-7 h-7 transition-all duration-300 brightness-0"
                />
                {isActive(item.path) && (
                  <div className="absolute inset-0 rounded-full bg-black/20 animate-pulse"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavigationPanel;
