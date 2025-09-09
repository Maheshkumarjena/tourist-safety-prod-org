import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Shield, MapPin, Bell, Database, User, Eye, Lock, ChevronRight } from 'lucide-react';

const ConsentScreen = () => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      navigate('/auth/register');
    }
  };

  const handleDecline = () => {
    navigate('/');
  };

  const consentItems = [
    {
      icon: MapPin,
      title: 'Continuous Location Tracking',
      description: 'Allow real-time GPS monitoring during your trip for safety purposes'
    },
    {
      icon: User,
      title: 'Digital ID Sharing',
      description: 'Share your digital identity with authorized tourism authorities when required'
    },
    {
      icon: Bell,
      title: 'Safety Alerts & Notifications',
      description: 'Receive critical safety alerts and emergency notifications'
    },
    {
      icon: Shield,
      title: 'Emergency Services Access',
      description: 'Grant emergency services access to your location during SOS situations'
    },
    {
      icon: Database,
      title: 'Safety Analytics',
      description: 'Allow data processing for safety improvements and analytics'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-primary/20">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <CardTitle className="text-2xl font-bold text-primary mb-2">
                Terms & Conditions
              </CardTitle>
              <p className="text-muted-foreground">
                Please review and accept to continue your safe journey
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30">
                SafeWander Tourist Safety App
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Consent Items */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                By using this app, you agree to:
              </h3>
              
              <ScrollArea className="h-64 w-full border rounded-lg p-4 bg-muted/30">
                <div className="space-y-4">
                  {consentItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* Privacy & Data Protection */}
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Lock className="w-5 h-5" />
                Privacy & Data Protection
              </h3>
              
              <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p>Your data is encrypted and stored securely on blockchain</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p>Location data is only used for safety purposes</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <p>You can request data deletion after your trip</p>
                </div>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border-2 border-dashed border-primary/30">
              <Checkbox
                id="accept-terms"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="accept-terms" className="text-sm leading-relaxed cursor-pointer">
                I have read and accept the terms and conditions above. I understand that this data collection is essential for my safety during travel and I consent to the processing of my personal data as described.
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleDecline}
                className="flex-1"
              >
                Decline & Exit
              </Button>
              
              <Button
                onClick={handleAccept}
                disabled={!accepted}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Accept & Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>By continuing, you acknowledge that you have read our Privacy Policy and Terms of Service</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ConsentScreen;