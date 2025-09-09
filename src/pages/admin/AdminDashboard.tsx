import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  Shield, 
  Bell,
  FileText,
  Brain,
  Activity,
  Clock,
  BarChart3,
  FileSearch,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTourists: 1247,
    activeTourists: 892,
    alertsToday: 23,
    unreadAlerts: 7,
    incidentsToday: 3,
    avgSafetyScore: 84
  });

  const [recentAlerts] = useState([
    {
      id: '1',
      type: 'panic',
      tourist: 'Sarah Johnson',
      location: 'Red Fort, Delhi',
      time: '10:30 AM',
      severity: 'high'
    },
    {
      id: '2',
      type: 'location',
      tourist: 'Mike Chen',
      location: 'Gateway of India, Mumbai',
      time: '9:45 AM',
      severity: 'medium'
    },
    {
      id: '3',
      type: 'health',
      tourist: 'Emma Wilson',
      location: 'Taj Mahal, Agra',
      time: '8:20 AM',
      severity: 'low'
    }
  ]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/admin/auth/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const quickActions = [
    {
      title: 'Tourist Management',
      description: 'View and manage all registered tourists',
      icon: Users,
      action: () => navigate('/admin/tourists'),
      color: 'bg-blue-500'
    },
    {
      title: 'Alert Center',
      description: 'Monitor and respond to emergency alerts',
      icon: AlertTriangle,
      action: () => navigate('/admin/alerts'),
      color: 'bg-red-500'
    },
    {
      title: 'Incident Reports',
      description: 'Create and manage E-FIR incidents',
      icon: FileText,
      action: () => navigate('/admin/incidents'),
      color: 'bg-orange-500'
    },
    {
      title: 'Analytics & Reports',
      description: 'View comprehensive analytics and insights',
      icon: BarChart3,
      action: () => navigate('/admin/analytics'),
      color: 'bg-green-500'
    },
    {
      title: 'Audit Logs',
      description: 'Monitor system activity and security events',
      icon: FileSearch,
      action: () => navigate('/admin/audit'),
      color: 'bg-purple-500'
    },
    {
      title: 'Real-time Monitoring',
      description: 'Live dashboard with tourist tracking',
      icon: Activity,
      action: () => navigate('/admin/monitoring'),
      color: 'bg-indigo-500'
    }
  ];

  return (
    <AdminLayout>
      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Enhanced Header with Real-time Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Command Center</h1>
            <p className="text-muted-foreground text-sm md:text-base">Real-time tourist safety monitoring and management</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <Globe className="h-3 w-3 text-green-500" />
              <span className="text-xs">System Online</span>
            </Badge>
            <Badge variant="destructive" className="flex items-center gap-2 animate-pulse">
              <Zap className="h-3 w-3" />
              <span className="text-xs">{stats.unreadAlerts} Critical</span>
            </Badge>
            <Button variant="outline" size="sm" className="text-xs">
              <Smartphone className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Mobile Units: </span>15
            </Button>
          </div>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Total Tourists</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{stats.totalTourists.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Active Now</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{stats.activeTourists.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Currently tracked tourists
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Alerts Today</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{stats.alertsToday}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unreadAlerts} unread
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Avg Safety Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">{stats.avgSafetyScore}%</div>
              <p className="text-xs text-muted-foreground">
                +2% from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {quickActions.map((action) => (
                <Card key={action.title} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className={`p-2 rounded-lg ${action.color} text-white flex-shrink-0`}>
                        <action.icon className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base truncate">{action.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alerts" className="text-xs md:text-sm">Recent Alerts</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs md:text-sm">System Activity</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs md:text-sm">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Recent Emergency Alerts</CardTitle>
                <CardDescription>Latest alerts requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-3">
                      <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                        <div className={`p-2 rounded-full flex-shrink-0 ${
                          alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm md:text-base truncate">{alert.tourist}</p>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">{alert.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2">
                        <Badge variant={alert.severity === 'high' ? 'destructive' : 'outline'} className="text-xs">
                          {alert.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>System Activity Log</CardTitle>
                <CardDescription>Recent system events and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2" />
                  <p>Activity log implementation coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
                <CardDescription>Recent analytical reports and exports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>Reports section implementation coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;