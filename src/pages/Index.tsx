import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Smartphone,
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4 animate-bounce-in">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: AlertTriangle,
      title: 'Emergency SOS',
      description: 'One-touch panic button with instant emergency response',
      color: 'text-emergency'
    },
    {
      icon: MapPin,
      title: 'Real-time Tracking',
      description: 'GPS location monitoring with geo-fence safety alerts',
      color: 'text-primary'
    },
    {
      icon: Shield,
      title: 'Digital ID',
      description: 'Blockchain-secured tourist identification and verification',
      color: 'text-success'
    },
    {
      icon: Users,
      title: 'Authority Connect',
      description: 'Direct communication with local police and tourism officials',
      color: 'text-secondary'
    },
    {
      icon: Smartphone,
      title: 'Offline Mode',
      description: 'Critical features work without internet connectivity',
      color: 'text-warning'
    },
    {
      icon: Globe,
      title: 'Multi-language',
      description: 'Support for 10+ Indian languages plus English',
      color: 'text-primary-dark'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Smart Tourist Safety</h1>
              <p className="text-xs text-muted-foreground">Government of India Initiative</p>
            </div>
          </div>
          <div className="flex items-center">
            <Link to="/auth/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">
              🇮🇳 Government Initiative • Powered by AI & Blockchain
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Safety is Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-success">
                {' '}Priority
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced tourist safety monitoring system with real-time tracking, emergency response, 
              and AI-powered threat detection. Travel with confidence across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link to="/auth/consent">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/panic">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-emergency border-emergency hover:bg-emergency hover:text-emergency-foreground">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Emergency Access
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/auth/consent">
                <Button variant="outline" className="w-full sm:w-auto">
                  Register
                </Button>
              </Link>
              <Link to="/admin/auth/login">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Shield className="w-4 h-4 mr-2" />
                  Authority Portal
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Safety Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced technology stack ensuring your safety throughout your journey in India
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-interactive h-full">
                  <CardHeader className="pb-3">
                    <feature.icon className={`w-8 h-8 ${feature.color} mb-2`} />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">Trusted by Government Agencies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              'Ministry of Tourism',
              'State Police Departments',
              'Border Security Force',
              'Emergency Services'
            ].map((agency) => (
              <div key={agency} className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-muted-foreground">{agency}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary via-secondary to-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Travel Safely?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of tourists who trust our safety system for secure travel across India
            </p>
            <Link to="/auth/consent">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Create Your Safety Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Smart Tourist Safety System</p>
                <p className="text-xs text-muted-foreground">Government of India • Ministry of Tourism</p>
              </div>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
              <Link to="/support" className="hover:text-foreground">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;