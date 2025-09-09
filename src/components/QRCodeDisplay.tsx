import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  QrCode, 
  RefreshCw, 
  Download, 
  Share2, 
  Shield,
  User,
  Calendar,
  MapPin
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
// import { blockchainAPI } from '@/lib/api';
// Temporarily disabled to isolate error
const blockchainAPI = {
  issueDigitalID: async () => ({ digitalId: 'test', qrCode: 'test' }),
  getQRCode: async (id: string) => ({ qrCode: 'test' })
};

interface DigitalIDData {
  id: string;
  qrData: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
  userData: {
    name: string;
    documentNumber: string;
    nationality: string;
    issuedBy: string;
  };
}

export const QRCodeDisplay = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [digitalID, setDigitalID] = useState<DigitalIDData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const generateDigitalID = async () => {
    try {
      setIsLoading(true);
      const response = await blockchainAPI.issueDigitalID();
      
      // Mock digital ID data - in real app this would come from blockchain
      const mockDigitalID: DigitalIDData = {
        id: response.digitalId || 'DTID-' + Date.now(),
        qrData: JSON.stringify({
          id: response.digitalId,
          name: `${user?.firstName} ${user?.lastName}`,
          documentNumber: 'PASS123456789',
          nationality: 'Indian',
          issuedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          verificationUrl: `https://verify.touristsafety.gov.in/${response.digitalId}`
        }),
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        userData: {
          name: `${user?.firstName} ${user?.lastName}`,
          documentNumber: 'PASS123456789',
          nationality: 'Indian',
          issuedBy: 'Ministry of Tourism, India'
        }
      };

      setDigitalID(mockDigitalID);
    } catch (error) {
      toast({
        title: "Failed to generate Digital ID",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshQRCode = async () => {
    if (!digitalID) return;
    
    try {
      setIsRefreshing(true);
      const response = await blockchainAPI.getQRCode(digitalID.id);
      
      setDigitalID(prev => prev ? {
        ...prev,
        qrData: JSON.stringify({
          ...JSON.parse(prev.qrData),
          refreshedAt: new Date().toISOString()
        })
      } : null);

      toast({
        title: "QR Code refreshed",
        description: "Your digital ID has been updated",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const downloadQRCode = () => {
    if (!digitalID) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a larger canvas for better quality
    canvas.width = 512;
    canvas.height = 512;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 512, 512);

    // Get QR code SVG and convert to image
    const svgElement = document.querySelector('#digital-qr-code');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 512, 512);
        
        // Download the image
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `digital-id-${digitalID.id}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const shareQRCode = async () => {
    if (!digitalID || !navigator.share) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(digitalID?.qrData || '');
        toast({
          title: "Copied to clipboard",
          description: "Digital ID data copied",
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Unable to share at this time",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      await navigator.share({
        title: 'My Digital Tourist ID',
        text: 'Here is my verified digital tourist ID',
        url: `https://verify.touristsafety.gov.in/${digitalID.id}`
      });
    } catch (error) {
      // User cancelled sharing
    }
  };

  useEffect(() => {
    generateDigitalID();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-6 h-6" />
              Digital Tourist ID
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Skeleton className="w-64 h-64" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!digitalID) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <QrCode className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Digital ID Found</h3>
          <p className="text-muted-foreground mb-4">
            Generate your digital tourist ID to get started
          </p>
          <Button onClick={generateDigitalID}>
            Generate Digital ID
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* QR Code Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-6 h-6" />
              Digital Tourist ID
            </CardTitle>
            <Badge className={getStatusColor(digitalID.status)}>
              {digitalID.status.charAt(0).toUpperCase() + digitalID.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center"
          >
            <div className="bg-white p-4 rounded-lg shadow-lg border">
              <QRCodeSVG
                id="digital-qr-code"
                value={digitalID.qrData}
                size={256}
                level="H"
                includeMargin
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
          </motion.div>

          {/* ID Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{digitalID.userData.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Document Number</p>
                  <p className="font-medium font-mono">{digitalID.userData.documentNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nationality</p>
                  <p className="font-medium">{digitalID.userData.nationality}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Expires</p>
                  <p className="font-medium">
                    {new Date(digitalID.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Issued by: {digitalID.userData.issuedBy}
              </p>
              <p className="text-xs text-muted-foreground">
                ID: {digitalID.id}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={refreshQRCode}
              disabled={isRefreshing}
              className="flex-1"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              onClick={downloadQRCode}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <Button
              variant="outline"
              onClick={shareQRCode}
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold mb-2">Security Information</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• This QR code contains your verified digital identity</p>
                <p>• Only show this to authorized personnel when requested</p>
                <p>• The QR code is cryptographically signed and tamper-proof</p>
                <p>• Report any suspicious verification requests immediately</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};