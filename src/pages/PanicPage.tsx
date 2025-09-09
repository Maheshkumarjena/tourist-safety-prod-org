import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore, useLocationStore } from '@/lib/store';
import { PanicButton } from '@/components/ui/panic-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Users, 
  Shield,
  Clock,
  Ambulance,
  Car,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const PanicPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { currentLocation, isTracking } = useLocationStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const emergencyContacts = [
    {
      name: 'Police',
      number: '100',
      icon: Shield,
      color: 'bg-primary',
      description: 'Police Emergency Services'
    },
    {
      name: 'Medical',
      number: '108',
      icon: Ambulance,
      color: 'bg-emergency',
      description: 'Ambulance & Medical Emergency'
    },
    {
      name: 'Fire',
      number: '101',
      icon: AlertTriangle,
      color: 'bg-warning',
      description: 'Fire Department'
    },
    {
      name: 'Tourist Helpline',
      number: '1363',
      icon: Car,
      color: 'bg-secondary',
      description: 'Ministry of Tourism Helpline'
    }
  ];

  const handleEmergencyCall = (number: string, name: string) => {
    // In a real app, this would initiate a phone call
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emergency-light/20 to-background">
      {/* Header */}
      <header className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            )}
            <div>
              <h1 className="text-sm md:text-lg font-bold text-emergency">EMERGENCY MODE</h1>
              <p className="text-xs text-muted-foreground">Immediate assistance available</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Emergency Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <Card className="bg-emergency-light/50 border-emergency/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-emergency animate-pulse" />
                <h1 className="text-lg md:text-2xl font-bold text-emergency">Emergency Assistance</h1>
              </div>
              <p className="text-emergency/80 mb-4">
                You have access to immediate emergency services. Help is available 24/7.
              </p>
              {user && (
                <div className="flex justify-center space-x-4 text-sm">
                  <Badge variant="outline" className="border-emergency/30">
                    User: {user.firstName} {user.lastName}
                  </Badge>
                  {currentLocation && (
                    <Badge variant="outline" className="border-emergency/30">
                      <MapPin className="w-3 h-3 mr-1" />
                      Location Available
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Panic Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-emergency">
                  SOS Emergency Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PanicButton size="lg" />
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    How it works:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Hold button for 1 second to activate</li>
                    <li>• 5-second countdown before alert is sent</li>
                    <li>• Location and details shared with authorities</li>
                    <li>• Emergency contacts notified automatically</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Emergency Contacts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <Button
                    key={contact.name}
                    variant="outline"
                    className="w-full h-auto p-4 justify-start"
                    onClick={() => handleEmergencyCall(contact.number, contact.name)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        contact.color
                      )}>
                        <contact.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-lg font-bold text-primary">{contact.number}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{contact.description}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Personal Contacts */}
            {user && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Personal Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: 'Family Contact', phone: '+91 98765 43210', relation: 'Primary' },
                    { name: 'Friend Contact', phone: '+91 98765 43211', relation: 'Secondary' }
                  ].map((contact, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => handleEmergencyCall(contact.phone, contact.name)}
                    >
                      <div className="text-left">
                        <div className="text-sm font-medium">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.relation}</div>
                      </div>
                      <div className="text-right">
                        <Phone className="w-4 h-4" />
                      </div>
                    </Button>
                  ))}
                  
                  {isAuthenticated && (
                    <Link to="/settings">
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        Manage Emergency Contacts
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Location Status */}
        {currentLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Card className="bg-success-light/50 border-success/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium text-success">Location Available</p>
                      <p className="text-xs text-success/80">
                        Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-success text-success">
                    <Clock className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Authentication Prompt for Non-Users */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-primary-light/50 border-primary/30">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Get Full Protection
                </h3>
                <p className="text-sm text-primary/80 mb-4">
                  Create an account for advanced safety features, location tracking, and personalized emergency contacts.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/auth/register">
                    <Button className="w-full sm:w-auto">Create Account</Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button variant="outline" className="w-full sm:w-auto">Login</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PanicPage;