import { useState } from 'react';
import { useAuthStore, useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Settings, 
  User, 
  Shield, 
  Menu,
  X,
  LogOut,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { language } = useAppStore();
  const { t } = useTranslation(language);

  const isAuthority = user?.role === 'authority';

  const navigationItems = [
    {
      to: '/dashboard',
      label: t('dashboard.welcome'),
      icon: User,
      badge: null,
    },
    {
      to: '/map',
      label: 'Location',
      icon: MapPin,
      badge: null,
    },
    {
      to: '/panic',
      label: t('common.emergency'),
      icon: AlertTriangle,
      badge: null,
      className: 'text-emergency hover:text-emergency-dark',
    },
    {
      to: '/notifications',
      label: t('settings.notifications'),
      icon: Bell,
      badge: '3',
    },
    {
      to: '/settings',
      label: t('settings.settings'),
      icon: Settings,
      badge: null,
    },
  ];

  if (isAuthority) {
    navigationItems.unshift({
      to: '/authority',
      label: 'Authority Dashboard',
      icon: Shield,
      badge: null,
    });
  }

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className={cn(
      "bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95",
      className
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:block text-lg font-semibold text-foreground">
                Tourist Safety
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-accent",
                  item.className
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* User Info */}
            {user && (
              <div className="hidden sm:flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAuthority ? (
                      <span className="badge-authority">Authority</span>
                    ) : (
                      `Safety Score: ${user.safetyScore}%`
                    )}
                  </p>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            )}

            {/* Logout Button (Desktop) */}
            <Button
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('settings.logout')}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md text-base font-medium transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-accent",
                  item.className
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
            
            {/* Mobile User Info and Logout */}
            <div className="border-t border-border pt-3 mt-3">
              {user && (
                <div className="px-3 py-2">
                  <p className="text-base font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isAuthority ? 'Authority User' : `Safety Score: ${user.safetyScore}%`}
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full mx-3 mt-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('settings.logout')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}