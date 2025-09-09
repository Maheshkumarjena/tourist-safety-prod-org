import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileSearch, 
  Search, 
  Download, 
  Filter,
  User,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  Settings,
  Database,
  Key
} from 'lucide-react';

const AdminAudit = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');

  const auditLogs = [
    {
      id: 'AUD-001',
      timestamp: '2024-01-15 14:32:15',
      action: 'USER_LOGIN',
      user: 'admin@tourism.gov',
      userRole: 'admin',
      details: 'Administrator login from IP: 192.168.1.100',
      severity: 'info',
      resource: 'authentication',
      status: 'success'
    },
    {
      id: 'AUD-002',
      timestamp: '2024-01-15 14:28:42',
      action: 'INCIDENT_CREATED',
      user: 'inspector.kumar@tourism.gov',
      userRole: 'officer',
      details: 'New E-FIR created for tourist harassment incident',
      severity: 'normal',
      resource: 'incidents',
      status: 'success'
    },
    {
      id: 'AUD-003',
      timestamp: '2024-01-15 14:25:18',
      action: 'ALERT_ACKNOWLEDGED',
      user: 'operator.sharma@tourism.gov',
      userRole: 'operator',
      details: 'Panic alert ALT-001 acknowledged and response initiated',
      severity: 'high',
      resource: 'alerts',
      status: 'success'
    },
    {
      id: 'AUD-004',
      timestamp: '2024-01-15 14:22:56',
      action: 'TOURIST_DATA_ACCESSED',
      user: 'admin@tourism.gov',
      userRole: 'admin',
      details: 'Tourist profile viewed: Sarah Johnson (ID: TUR-12345)',
      severity: 'normal',
      resource: 'user_data',
      status: 'success'
    },
    {
      id: 'AUD-005',
      timestamp: '2024-01-15 14:19:33',
      action: 'FAILED_LOGIN_ATTEMPT',
      user: 'unknown@email.com',
      userRole: 'unknown',
      details: 'Failed admin login attempt from IP: 203.145.78.92',
      severity: 'critical',
      resource: 'authentication',
      status: 'failed'
    },
    {
      id: 'AUD-006',
      timestamp: '2024-01-15 14:15:21',
      action: 'SYSTEM_SETTINGS_CHANGED',
      user: 'admin@tourism.gov',
      userRole: 'admin',
      details: 'Alert threshold settings updated for panic button responses',
      severity: 'high',
      resource: 'settings',
      status: 'success'
    },
    {
      id: 'AUD-007',
      timestamp: '2024-01-15 14:12:47',
      action: 'DATA_EXPORT',
      user: 'analyst.patel@tourism.gov',
      userRole: 'analyst',
      details: 'Monthly incident report exported (Format: PDF)',
      severity: 'normal',
      resource: 'reports',
      status: 'success'
    },
    {
      id: 'AUD-008',
      timestamp: '2024-01-15 14:08:12',
      action: 'DATABASE_BACKUP',
      user: 'system',
      userRole: 'system',
      details: 'Automated daily database backup completed successfully',
      severity: 'info',
      resource: 'database',
      status: 'success'
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'user_login':
      case 'failed_login_attempt':
        return User;
      case 'alert_acknowledged':
        return AlertTriangle;
      case 'system_settings_changed':
        return Settings;
      case 'database_backup':
        return Database;
      case 'data_export':
        return Download;
      default:
        return Shield;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      case 'info': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'secondary';
      case 'failed': return 'destructive';
      case 'warning': return 'outline';
      default: return 'outline';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    const matchesUser = userFilter === 'all' || log.userRole === userFilter;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  const totalLogs = auditLogs.length;
  const criticalEvents = auditLogs.filter(log => log.severity === 'critical').length;
  const failedActions = auditLogs.filter(log => log.status === 'failed').length;
  const todayLogs = auditLogs.filter(log => log.timestamp.startsWith('2024-01-15')).length;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground">System activity monitoring and security tracking</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Filter className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Advanced </span>Filters
            </Button>
            <Button size="sm" className="text-xs sm:text-sm">
              <Download className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export </span>Logs
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{totalLogs}</p>
                </div>
                <FileSearch className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Events</p>
                  <p className="text-2xl font-bold text-red-600">{criticalEvents}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed Actions</p>
                  <p className="text-2xl font-bold text-orange-600">{failedActions}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Events</p>
                  <p className="text-2xl font-bold text-blue-600">{todayLogs}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
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
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Action Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="login">Login Events</SelectItem>
                    <SelectItem value="incident">Incident Actions</SelectItem>
                    <SelectItem value="alert">Alert Actions</SelectItem>
                    <SelectItem value="settings">Settings Changes</SelectItem>
                    <SelectItem value="data">Data Access</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="User Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="officer">Officer</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs List */}
        <Card>
          <CardHeader>
            <CardTitle>System Activity Log ({filteredLogs.length} entries)</CardTitle>
            <CardDescription>Chronological record of all system activities and security events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                
                return (
                  <div key={log.id} className="border rounded-lg p-4 hover:bg-muted/50">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="p-2 bg-muted rounded-lg flex-shrink-0">
                        <ActionIcon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={getSeverityColor(log.severity)}>
                              {log.severity.toUpperCase()}
                            </Badge>
                            <Badge variant={getStatusColor(log.status)}>
                              {log.status.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground font-mono break-all">
                              {log.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{log.timestamp}</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold">{log.action.replace(/_/g, ' ')}</h3>
                          <p className="text-muted-foreground">{log.details}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{log.user}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Key className="h-4 w-4 flex-shrink-0" />
                            <span>{log.userRole}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Database className="h-4 w-4 flex-shrink-0" />
                            <span>{log.resource}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAudit;