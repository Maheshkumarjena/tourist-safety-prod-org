import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { 
  Home, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  Settings,
  User,
  Bell,
  MoreHorizontal,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function BottomNavigation() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const currentPath = location.pathname;

  const mainNavItems = [
    {
      to: '/dashboard',
      label: 'Home',
      icon: Home,
    },
    {
      to: '/map',
      label: 'Location',
      icon: MapPin,
    },
    {
      to: '/itinerary',
      label: 'Itinerary',
      icon: Calendar,
    },
    {
      to: '/panic',
      label: 'Emergency',
      icon: AlertTriangle,
      className: 'text-emergency-foreground bg-emergency hover:bg-emergency/90',
    },
  ];

  const moreItems = [
    {
      to: '/profile',
      label: 'Profile',
      icon: User,
    },
    {
      to: '/digital-id',
      label: 'Digital ID',
      icon: Shield,
    },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: '3',
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {mainNavItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-0 flex-1",
              isActive(item.to)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              item.className
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              isActive(item.to) && !item.className && "text-primary"
            )} />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}

        {/* More menu */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium min-w-0 flex-1 h-auto text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <MoreHorizontal className="w-5 h-5" />
              <span>More</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end" side="top">
            <div className="space-y-1">
              {moreItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors w-full",
                    isActive(item.to)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
              
              <div className="border-t border-border pt-2 mt-2">
                {user && (
                  <div className="px-3 py-2 text-xs">
                    <p className="font-medium text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-muted-foreground">
                      Safety Score: {user.safetyScore}%
                    </p>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  Logout
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}