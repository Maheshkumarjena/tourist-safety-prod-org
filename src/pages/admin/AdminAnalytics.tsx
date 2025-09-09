import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Download,
  Calendar,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data for charts
  const visitorTrends = [
    { month: 'Jan', visitors: 1247, incidents: 12, alerts: 45 },
    { month: 'Feb', visitors: 1356, incidents: 8, alerts: 32 },
    { month: 'Mar', visitors: 1489, incidents: 15, alerts: 56 },
    { month: 'Apr', visitors: 1623, incidents: 10, alerts: 41 },
    { month: 'May', visitors: 1789, incidents: 18, alerts: 67 },
    { month: 'Jun', visitors: 1945, incidents: 7, alerts: 38 }
  ];

  const locationData = [
    { location: 'Red Fort', visitors: 245, incidents: 3, riskScore: 65 },
    { location: 'India Gate', visitors: 298, incidents: 1, riskScore: 25 },
    { location: 'Taj Mahal', visitors: 412, incidents: 2, riskScore: 45 },
    { location: 'Gateway of India', visitors: 187, incidents: 4, riskScore: 75 },
    { location: 'Hawa Mahal', visitors: 156, incidents: 1, riskScore: 35 }
  ];

  const incidentTypes = [
    { name: 'Harassment', value: 35, color: '#ef4444' },
    { name: 'Theft', value: 28, color: '#f97316' },
    { name: 'Medical', value: 20, color: '#eab308' },
    { name: 'Lost Documents', value: 12, color: '#22c55e' },
    { name: 'Other', value: 5, color: '#6366f1' }
  ];

  const alertTypes = [
    { name: 'Panic Button', value: 42, color: '#dc2626' },
    { name: 'Location Alert', value: 31, color: '#ea580c' },
    { name: 'Health Alert', value: 18, color: '#ca8a04' },
    { name: 'Safety Alert', value: 9, color: '#16a34a' }
  ];

  const safetyMetrics = [
    { metric: 'Response Time', value: '3.2 min', change: '-12%', trend: 'down' },
    { metric: 'Resolution Rate', value: '94.2%', change: '+5%', trend: 'up' },
    { metric: 'Tourist Satisfaction', value: '4.7/5', change: '+0.3', trend: 'up' },
    { metric: 'Incident Prevention', value: '87%', change: '+8%', trend: 'up' }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-red-500 text-white';
    if (score >= 50) return 'bg-orange-500 text-white';
    if (score >= 30) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Analytics & Reports</h1>
            <p className="text-muted-foreground">Comprehensive insights into tourist safety patterns</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {safetyMetrics.map((metric) => (
            <Card key={metric.metric}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.metric}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-3 w-3 ${
                        metric.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      <span>{metric.change}</span>
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="locations">Location Analysis</TabsTrigger>
            <TabsTrigger value="incidents">Incident Patterns</TabsTrigger>
            <TabsTrigger value="heatmaps">Risk Heatmaps</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visitor & Incident Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Visitor & Incident Trends</CardTitle>
                  <CardDescription>Monthly comparison of tourist visits and incidents</CardDescription>
                </CardHeader>
                 <CardContent>
                   <div className="w-full">
                     <ResponsiveContainer width="100%" height={300}>
                       <BarChart data={visitorTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="month" />
                         <YAxis />
                         <Tooltip />
                         <Bar dataKey="visitors" fill="#3b82f6" name="Visitors" />
                         <Bar dataKey="incidents" fill="#ef4444" name="Incidents" />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                 </CardContent>
              </Card>

              {/* Alert Response Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Alert Response Trends</CardTitle>
                  <CardDescription>Average response time and alert volume</CardDescription>
                </CardHeader>
                 <CardContent>
                   <div className="w-full">
                     <ResponsiveContainer width="100%" height={300}>
                       <LineChart data={visitorTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="month" />
                         <YAxis />
                         <Tooltip />
                         <Line type="monotone" dataKey="alerts" stroke="#f59e0b" strokeWidth={2} name="Alerts" />
                       </LineChart>
                     </ResponsiveContainer>
                   </div>
                 </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Incident Types Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Incident Types Distribution</CardTitle>
                  <CardDescription>Breakdown of incident categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={incidentTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {incidentTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Alert Types Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Alert Types Distribution</CardTitle>
                  <CardDescription>Types of safety alerts received</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={alertTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {alertTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Location Risk Analysis</CardTitle>
                <CardDescription>Tourist hotspots with incident rates and risk scores</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                   {locationData.map((location) => (
                     <div key={location.location} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
                       <div className="flex items-center gap-4 min-w-0 flex-1">
                         <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                         <div className="min-w-0 flex-1">
                           <h3 className="font-semibold truncate">{location.location}</h3>
                           <p className="text-sm text-muted-foreground">
                             {location.visitors} visitors this month
                           </p>
                         </div>
                       </div>
                       <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                         <div className="text-left sm:text-right">
                           <p className="text-sm font-medium">{location.incidents} incidents</p>
                           <p className="text-xs text-muted-foreground">
                             {((location.incidents / location.visitors) * 100).toFixed(1)}% incident rate
                           </p>
                         </div>
                         <Badge className={getRiskColor(location.riskScore)}>
                           Risk: {location.riskScore}
                         </Badge>
                       </div>
                     </div>
                   ))}
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Incident Timeline</CardTitle>
                  <CardDescription>Hourly distribution of incidents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <p>Hourly incident analysis chart would be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Seasonal Patterns</CardTitle>
                  <CardDescription>Monthly incident variations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2" />
                    <p>Seasonal pattern analysis would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="heatmaps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Risk Heatmaps</CardTitle>
                <CardDescription>Visual representation of risk zones and tourist density</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Heatmap</h3>
                  <p>Geographic heatmap visualization would be integrated here</p>
                  <p className="text-sm mt-2">Showing tourist density, incident hotspots, and risk zones</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;