import { motion } from 'framer-motion';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Smartphone,
  Eye,
  Lock
} from 'lucide-react';

const DigitalID = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Digital Tourist ID
            </h1>
            <p className="text-muted-foreground mt-2">
              Your secure, blockchain-verified digital identity
            </p>
          </div>

          {/* Status Banner */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Identity Verified
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your digital ID is active and ready to use
                  </p>
                </div>
                <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Display Component */}
          <QRCodeDisplay />

          {/* How to Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                How to Use Your Digital ID
              </CardTitle>
              <CardDescription>
                Present your QR code when requested by authorities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Show QR Code</h4>
                  <p className="text-sm text-muted-foreground">
                    Present your screen to the verification officer
                  </p>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Instant Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Officer scans and verifies your identity instantly
                  </p>
                </div>
                
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Access Granted</h4>
                  <p className="text-sm text-muted-foreground">
                    Verified access to tourist areas and services
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits of Digital ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Faster Check-ins</h4>
                    <p className="text-sm text-muted-foreground">
                      Skip long queues with instant verification
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Enhanced Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Blockchain-secured, tamper-proof identity
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">No Physical Documents</h4>
                    <p className="text-sm text-muted-foreground">
                      Carry your ID digitally, reduce risk of loss
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Real-time Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatic updates and renewal notifications
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Important Security Notes
                  </h4>
                  <div className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                    <p>• Keep your phone charged to ensure QR code availability</p>
                    <p>• Only show your QR code to authorized personnel</p>
                    <p>• Report any unauthorized scanning attempts immediately</p>
                    <p>• Take a screenshot as backup (store securely)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Blockchain Details</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <p>Network: Tourism Safety Blockchain</p>
                    <p>Consensus: Proof of Authority</p>
                    <p>Hash Algorithm: SHA-256</p>
                    <p>Encryption: AES-256</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Verification Process</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <p>QR Format: High Error Correction</p>
                    <p>Data Signing: Digital Signature</p>
                    <p>Timestamp: UTC ISO 8601</p>
                    <p>Validity: Real-time Check</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DigitalID;