import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Shield, 
  Bell, 
  Settings, 
  LogOut, 
  Activity,
  Users,
  AlertTriangle,
  FileText,
  BarChart3,
  FileSearch,
  Menu
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out successfully' });
    navigate('/admin/auth/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: Activity
    },
    {
      title: 'Tourists',
      path: '/admin/tourists',
      icon: Users
    },
    {
      title: 'Alert Center',
      path: '/admin/alerts',
      icon: AlertTriangle
    },
    {
      title: 'Incidents',
      path: '/admin/incidents',
      icon: FileText
    },
    {
      title: 'Analytics',
      path: '/admin/analytics',
      icon: BarChart3
    },
    {
      title: 'Audit Logs',
      path: '/admin/audit',
      icon: FileSearch
    },
    {
      title: 'Notifications',
      path: '/admin/notifications',
      icon: Bell
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: Settings
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-3 md:px-6 py-3">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-4 md:space-x-8">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-bold">Tourism Authority</h1>
              <p className="text-xs text-muted-foreground">Safety Management System</p>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{item.title}</span>
                </Button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Authority Portal</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleNavigation(item.path)}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.title}
                    </Button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Right side - Status and Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Badge variant="outline" className="hidden sm:flex items-center gap-2">
            <Activity className="h-3 w-3 text-green-500" />
            <span className="text-xs">Online</span>
          </Badge>

          <Button variant="outline" size="sm" className="relative" onClick={() => navigate('/admin/notifications')}>
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline ml-2">Alerts</span>
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">7</Badge>
          </Button>

          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/settings')} className="hidden sm:inline-flex">
            <Settings className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium truncate max-w-32">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};