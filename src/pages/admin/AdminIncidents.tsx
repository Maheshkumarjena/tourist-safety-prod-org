import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Download, 
  Calendar,
  MapPin,
  User,
  AlertCircle
} from 'lucide-react';

const AdminIncidents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const incidents = [
    {
      id: 'INC-2024-001',
      efirNo: 'E-FIR/2024/001',
      title: 'Tourist Harassment at Red Fort',
      tourist: 'Sarah Johnson',
      location: 'Red Fort, Delhi',
      date: '2024-01-15',
      time: '14:30',
      status: 'under_investigation',
      severity: 'high',
      officer: 'Inspector Rajesh Kumar',
      description: 'Tourist reported harassment by local vendors near the main entrance.',
      actions: ['Initial complaint filed', 'Witness statements recorded', 'CCTV footage reviewed']
    },
    {
      id: 'INC-2024-002',
      efirNo: 'E-FIR/2024/002',
      title: 'Lost Passport and Documents',
      tourist: 'Mike Chen',
      location: 'Connaught Place, Delhi',
      date: '2024-01-14',
      time: '11:15',
      status: 'resolved',
      severity: 'medium',
      officer: 'Sub-Inspector Priya Sharma',
      description: 'Tourist lost passport and travel documents in crowded market area.',
      actions: ['Missing documents report filed', 'Embassy contacted', 'Temporary documents issued']
    },
    {
      id: 'INC-2024-003',
      efirNo: 'E-FIR/2024/003',
      title: 'Medical Emergency at Taj Mahal',
      tourist: 'Emma Wilson',
      location: 'Taj Mahal, Agra',
      date: '2024-01-13',
      time: '09:45',
      status: 'closed',
      severity: 'critical',
      officer: 'Inspector Amit Singh',
      description: 'Tourist suffered heart attack during visit, emergency medical response provided.',
      actions: ['Ambulance called', 'Hospital admission arranged', 'Family contacted', 'Insurance claim processed']
    },
    {
      id: 'INC-2024-004',
      efirNo: 'E-FIR/2024/004',
      title: 'Theft of Personal Belongings',
      tourist: 'James Brown',
      location: 'India Gate, Delhi',
      date: '2024-01-12',
      time: '18:20',
      status: 'draft',
      severity: 'medium',
      officer: 'Constable Sita Devi',
      description: 'Tourist reported theft of camera, wallet, and mobile phone.',
      actions: ['Complaint being prepared', 'Evidence collection in progress']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'outline';
      case 'under_investigation': return 'default';
      case 'resolved': return 'secondary';
      case 'closed': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.tourist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.efirNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalIncidents = incidents.length;
  const activeIncidents = incidents.filter(i => i.status === 'under_investigation').length;
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved' || i.status === 'closed').length;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Incident Reports & E-FIR</h1>
            <p className="text-muted-foreground">Manage incidents and generate First Information Reports</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Create E-FIR</span>
                <span className="sm:hidden">New E-FIR</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl mx-4">
              <DialogHeader>
                <DialogTitle>Create New E-FIR</DialogTitle>
                <DialogDescription>
                  Generate a new Electronic First Information Report for an incident
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tourist">Tourist Name</Label>
                    <Input id="tourist" placeholder="Enter tourist name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Incident location" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="officer">Investigating Officer</Label>
                    <Input id="officer" placeholder="Officer name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Incident Title</Label>
                  <Input id="title" placeholder="Brief description of the incident" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide detailed description of the incident"
                    rows={4}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)} className="w-full sm:w-auto">
                    Create E-FIR
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Incidents</p>
                  <p className="text-2xl font-bold">{totalIncidents}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Under Investigation</p>
                  <p className="text-2xl font-bold text-orange-600">{activeIncidents}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{resolvedIncidents}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
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
                    placeholder="Search incidents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="under_investigation">Under Investigation</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Incidents List */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Reports ({filteredIncidents.length})</CardTitle>
            <CardDescription>Electronic First Information Reports and incident management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredIncidents.map((incident) => (
                <div key={incident.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex flex-col lg:flex-row items-start gap-4">
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity.toUpperCase()}
                        </Badge>
                        <Badge variant={getStatusColor(incident.status)}>
                          {incident.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground font-mono break-all">
                          {incident.efirNo}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">{incident.title}</h3>
                        <p className="text-muted-foreground">{incident.description}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{incident.tourist}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{incident.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>{incident.date} {incident.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{incident.officer}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Actions Taken:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {incident.actions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                        <Eye className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                        <Download className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
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

export default AdminIncidents;