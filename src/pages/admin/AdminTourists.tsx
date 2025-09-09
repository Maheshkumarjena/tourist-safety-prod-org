import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  MessageCircle, 
  MapPin, 
  Phone,
  Download,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

const AdminTourists = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const [stats] = useState({
    totalTourists: 1247,
    activeTourists: 892,
    alertTourists: 7,
    inactiveTourists: 348
  });

  const tourists = [
    {
      id: 'TUR-001',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1-555-0123',
      nationality: 'USA',
      currentLocation: 'Red Fort, Delhi',
      status: 'active',
      lastSeen: '2 hours ago',
      safetyScore: 85,
      alerts: 1
    },
    {
      id: 'TUR-002', 
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1-555-0124',
      nationality: 'Canada', 
      currentLocation: 'Gateway of India, Mumbai',
      status: 'active',
      lastSeen: '30 minutes ago',
      safetyScore: 92,
      alerts: 0
    },
    {
      id: 'TUR-003',
      name: 'Emma Wilson', 
      email: 'emma.w@email.com',
      phone: '+1-555-0125',
      nationality: 'UK',
      currentLocation: 'Taj Mahal, Agra',
      status: 'alert',
      lastSeen: '1 hour ago', 
      safetyScore: 45,
      alerts: 2
    }
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/admin/auth/login');
      return;
    }
    setTimeout(() => setIsLoading(false), 1000);
  }, [isAuthenticated, user, navigate]);

  const filteredTourists = tourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.currentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tourist.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'alert':
        return <Badge variant="destructive">Alert</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">Loading tourist data...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Tourist Management</h1>
            <p className="text-muted-foreground">Monitor and manage registered tourists</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-2 text-xs sm:text-sm">
              <Users className="h-3 w-3" />
              <span className="hidden xs:inline">{stats.totalTourists} Total</span>
              <span className="xs:hidden">{stats.totalTourists}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 text-xs sm:text-sm text-green-600">
              <Shield className="h-3 w-3" />
              <span className="hidden xs:inline">{stats.activeTourists} Active</span>
              <span className="xs:hidden">{stats.activeTourists}</span>
            </Badge>
            <Button size="sm" className="text-xs sm:text-sm">
              <Download className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">CSV</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tourists</p>
                  <p className="text-2xl font-bold">{stats.totalTourists}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeTourists}</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{stats.alertTourists}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.inactiveTourists}</p>
                </div>
                <Users className="h-8 w-8 text-gray-600" />
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
                    placeholder="Search tourists..."
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
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tourists Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Tourists ({filteredTourists.length})</CardTitle>
            <CardDescription>Comprehensive list of all registered tourists and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Tourist</TableHead>
                    <TableHead className="min-w-[180px]">Contact</TableHead>
                    <TableHead className="min-w-[180px]">Location</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Safety Score</TableHead>
                    <TableHead className="min-w-[100px]">Last Seen</TableHead>
                    <TableHead className="min-w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTourists.map((tourist) => (
                    <TableRow key={tourist.id}>
                      <TableCell className="min-w-[150px]">
                        <div>
                          <p className="font-medium">{tourist.name}</p>
                          <p className="text-sm text-muted-foreground">{tourist.nationality}</p>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[180px]">
                        <div>
                          <p className="text-sm">{tourist.email}</p>
                          <p className="text-sm text-muted-foreground">{tourist.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[180px]">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm">{tourist.currentLocation}</span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        {getStatusBadge(tourist.status)}
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            tourist.safetyScore >= 80 ? 'bg-green-500' :
                            tourist.safetyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span>{tourist.safetyScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        <span className="text-sm text-muted-foreground">{tourist.lastSeen}</span>
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTourists;