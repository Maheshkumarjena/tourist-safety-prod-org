import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  MapPin,
  Clock,
  Plus,
  Edit,
  CheckCircle,
  AlertTriangle,
  Camera,
  Star,
  Trash2,
  Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ItineraryItem {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  date: string;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  type: 'sightseeing' | 'dining' | 'accommodation' | 'transport' | 'activity';
  priority: 'high' | 'medium' | 'low';
}

const Itinerary = () => {
  const { language } = useAppStore();
  const { t } = useTranslation(language);
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Mock itinerary data
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([
    {
      id: '1',
      title: 'Visit Kamakhya Temple',
      description: 'Explore the famous Kamakhya Temple, one of the most revered Shakti Peethas',
      location: 'Kamakhya Temple, Guwahati',
      startTime: '08:00',
      endTime: '10:00',
      date: '2025-09-08',
      status: 'planned',
      type: 'sightseeing',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Brahmaputra River Cruise',
      description: 'Scenic boat ride on the mighty Brahmaputra River',
      location: 'Fancy Bazaar Ghat, Guwahati',
      startTime: '11:00',
      endTime: '13:00',
      date: '2025-09-08',
      status: 'planned',
      type: 'activity',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Local Assamese Lunch',
      description: 'Traditional Assamese thali at a local restaurant',
      location: 'Paradise Restaurant, Pan Bazaar',
      startTime: '13:30',
      endTime: '14:30',
      date: '2025-09-08',
      status: 'planned',
      type: 'dining',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Check-in Hotel Brahmaputra',
      description: 'Check-in and rest at the hotel',
      location: 'Hotel Brahmaputra, M.G. Road',
      startTime: '15:00',
      endTime: '16:00',
      date: '2025-09-08',
      status: 'completed',
      type: 'accommodation',
      priority: 'high'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'ongoing':
        return <Clock className="w-4 h-4 text-warning animate-pulse" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-emergency" />;
      default:
        return <Calendar className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'ongoing':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'cancelled':
        return 'text-emergency bg-emergency/10 border-emergency/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sightseeing':
        return <Camera className="w-4 h-4" />;
      case 'dining':
        return <Star className="w-4 h-4" />;
      case 'accommodation':
        return <MapPin className="w-4 h-4" />;
      case 'transport':
        return <Navigation className="w-4 h-4" />;
      case 'activity':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const todayItems = itineraryItems.filter(item => item.date === selectedDate);
  const upcomingItems = itineraryItems.filter(item => new Date(item.date) > new Date(selectedDate));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                <Calendar className="w-6 h-6 md:w-8 md:h-8" />
                My Itinerary
              </h1>
              <p className="text-muted-foreground mt-2">
                Plan and track your travel schedule
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Done' : 'Edit'}
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            {/* Today's Itinerary */}
            <TabsContent value="today" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>

              <div className="space-y-4">
                {todayItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "transition-all duration-200",
                      item.status === 'completed' && "opacity-75",
                      item.status === 'ongoing' && "ring-2 ring-warning/50",
                      isEditing && "hover:shadow-md cursor-pointer"
                    )}>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex flex-col items-center space-y-1 min-w-0">
                              {getTypeIcon(item.type)}
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-foreground">{item.title}</h3>
                                <Badge className={getStatusColor(item.status)}>
                                  {getStatusIcon(item.status)}
                                  <span className="ml-1 capitalize">{item.status}</span>
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">
                                {item.description}
                              </p>
                              
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate">{item.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{item.startTime} - {item.endTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {isEditing && (
                            <div className="flex justify-end gap-2 pt-2 border-t">
                              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                                <Edit className="w-3 h-3 mr-2" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-destructive hover:bg-destructive hover:text-destructive-foreground">
                                <Trash2 className="w-3 h-3 mr-2" />
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {todayItems.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No items scheduled for this date</p>
                      <Button className="mt-4" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Item
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Upcoming Itinerary */}
            <TabsContent value="upcoming" className="space-y-4">
              <div className="space-y-6">
                {upcomingItems.length > 0 ? (
                  upcomingItems.reduce((acc, item) => {
                    const date = item.date;
                    if (!acc[date]) {
                      acc[date] = [];
                    }
                    acc[date].push(item);
                    return acc;
                  }, {} as Record<string, ItineraryItem[]>)
                ) && Object.entries(
                  upcomingItems.reduce((acc, item) => {
                    const date = item.date;
                    if (!acc[date]) {
                      acc[date] = [];
                    }
                    acc[date].push(item);
                    return acc;
                  }, {} as Record<string, ItineraryItem[]>)
                ).map(([date, items]) => (
                  <div key={date}>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <div className="space-y-3 ml-6 border-l-2 border-muted pl-4">
                      {items.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-foreground">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.location}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline">{item.startTime}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No upcoming items planned</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Total Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {itineraryItems.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Planned activities</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">
                      {itineraryItems.filter(item => item.status === 'completed').length}
                    </div>
                    <p className="text-sm text-muted-foreground">Activities done</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Remaining</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">
                      {itineraryItems.filter(item => item.status === 'planned').length}
                    </div>
                    <p className="text-sm text-muted-foreground">To be done</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['sightseeing', 'dining', 'accommodation', 'transport', 'activity'].map((type) => {
                      const count = itineraryItems.filter(item => item.type === type).length;
                      const percentage = (count / itineraryItems.length) * 100;
                      
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(type)}
                            <span className="capitalize font-medium">{type}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-muted rounded-full">
                              <div 
                                className="h-2 bg-primary rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Itinerary;