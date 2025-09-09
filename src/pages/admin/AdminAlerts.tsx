import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Phone, 
  Eye, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

const AdminAlerts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const activeAlerts = [
    {
      id: 'ALT-001',
      type: 'panic',
      tourist: 'Sarah Johnson',
      location: 'Red Fort, Delhi',
      coordinates: '28.6562, 77.2410',
      time: '10:30 AM',
      severity: 'critical',
      status: 'active',
      description: 'Tourist pressed panic button',
      phone: '+1-555-0123'
    },
    {
      id: 'ALT-002',
      type: 'location',
      tourist: 'Mike Chen',
      location: 'Gateway of India, Mumbai',
      coordinates: '18.9220, 72.8347',
      time: '9:45 AM',
      severity: 'high',
      status: 'investigating',
      description: 'Unusual movement pattern detected',
      phone: '+1-555-0124'
    },
    {
      id: 'ALT-003',
      type: 'health',
      tourist: 'Emma Wilson',
      location: 'Taj Mahal, Agra',
      coordinates: '27.1751, 78.0421',
      time: '8:20 AM',
      severity: 'medium',
      status: 'active',
      description: 'Medical assistance requested',
      phone: '+1-555-0125'
    },
    {
      id: 'ALT-004',
      type: 'safety',
      tourist: 'James Brown',
      location: 'Hawa Mahal, Jaipur',
      coordinates: '26.9239, 75.8267',
      time: '7:15 AM',
      severity: 'low',
      status: 'resolved',
      description: 'Reported suspicious activity',
      phone: '+1-555-0126'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'investigating': return 'default';
      case 'resolved': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredAlerts = activeAlerts.filter(alert => {
    const matchesSearch = alert.tourist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const activeCount = activeAlerts.filter(a => a.status === 'active').length;
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Alert Center</h1>
            <p className="text-muted-foreground">Monitor and respond to tourist safety alerts</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="destructive" className="text-xs sm:text-sm">
              {activeCount} Active
            </Badge>
            {criticalCount > 0 && (
              <Badge variant="destructive" className="text-xs sm:text-sm animate-pulse">
                {criticalCount} Critical
              </Badge>
            )}
            <Button size="sm" className="text-xs sm:text-sm">
              <RefreshCw className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Alerts</p>
                  <p className="text-2xl font-bold">{activeAlerts.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-red-600">{activeCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-orange-600">{criticalCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-600">12</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts ({filteredAlerts.length})</CardTitle>
            <CardDescription>Real-time monitoring of tourist safety alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex flex-col lg:flex-row items-start gap-4">
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant={getStatusColor(alert.status)}>
                          {alert.status.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">#{alert.id}</span>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">{alert.tourist}</h3>
                        <p className="text-muted-foreground">{alert.description}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>{alert.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{alert.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                        <Eye className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Contact</span>
                        <span className="sm:hidden">Call</span>
                      </Button>
                      {alert.status === 'active' && (
                        <Button size="sm" className="flex-1 sm:flex-none">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Acknowledge</span>
                          <span className="sm:hidden">ACK</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAlerts;