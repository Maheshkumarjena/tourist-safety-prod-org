import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore, useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { Navbar } from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User,
  Camera,
  Upload,
  FileText,
  CreditCard,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  CreditCard as PassportIcon
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { language } = useAppStore();
  const { t } = useTranslation(language);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    nationality: 'Indian',
    dateOfBirth: '1990-01-01',
    passportNumber: 'A12345678',
    address: '123 Main Street, Guwahati, Assam, India',
    emergencyContact: '+91 98765 43210'
  });

  const [tripData, setTripData] = useState({
    destination: 'Northeast India Tourism Circuit',
    startDate: '2025-09-07',
    endDate: '2025-09-14',
    purpose: 'Tourism',
    accommodation: 'Hotel Brahmaputra, Guwahati',
    plannedActivities: 'Sightseeing, Cultural tours, Adventure activities'
  });

  const kycStatus = {
    identity: { status: 'verified', document: 'Aadhaar Card', date: '2025-09-01' },
    passport: { status: 'verified', document: 'Passport', date: '2025-09-01' },
    address: { status: 'pending', document: 'Utility Bill', date: null },
    photo: { status: 'verified', document: 'Profile Photo', date: '2025-09-01' }
  };

  const kycProgress = Object.values(kycStatus).filter(item => item.status === 'verified').length / Object.values(kycStatus).length * 100;

  const handleSave = () => {
    updateUser({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phoneNumber: profileData.phoneNumber,
    });
    setIsEditing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-emergency" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-success bg-success-light/20 border-success/20';
      case 'pending':
        return 'text-warning bg-warning-light/20 border-warning/20';
      case 'rejected':
        return 'text-emergency bg-emergency-light/20 border-emergency/20';
      default:
        return 'text-muted-foreground bg-muted/20 border-muted/20';
    }
  };

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
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-foreground">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-muted-foreground mt-2">
              Tourist ID: DTID-{user?.id}
            </p>
            <div className="flex justify-center space-x-2 mt-3">
              <Badge variant="secondary">
                {user?.role === 'authority' ? 'Authority User' : 'Tourist'}
              </Badge>
              <Badge variant="outline" className="text-success border-success">
                Safety Score: {user?.safetyScore}%
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
              <TabsTrigger value="kyc" className="text-xs sm:text-sm">KYC Status</TabsTrigger>
              <TabsTrigger value="trip" className="text-xs sm:text-sm">Current Trip</TabsTrigger>
              <TabsTrigger value="digital-id" className="text-xs sm:text-sm">Digital ID</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    >
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={profileData.nationality}
                        onChange={(e) => setProfileData(prev => ({ ...prev, nationality: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* KYC Tab */}
            <TabsContent value="kyc" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    KYC Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">{Math.round(kycProgress)}%</span>
                    </div>
                    <Progress value={kycProgress} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    {Object.entries(kycStatus).map(([key, status]) => (
                      <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(status.status)}
                          <div>
                            <p className="font-medium capitalize">{key} Verification</p>
                            <p className="text-sm text-muted-foreground">{status.document}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(status.status)}>
                            {status.status}
                          </Badge>
                          {status.date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(status.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {kycProgress < 100 && (
                    <div className="mt-6 p-4 bg-warning-light/20 border border-warning/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                        <div>
                          <p className="font-medium text-warning">Complete KYC Required</p>
                          <p className="text-sm text-warning/80 mt-1">
                            Please complete all KYC requirements for full access to safety features.
                          </p>
                          <Button size="sm" className="mt-2">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Documents
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trip Tab */}
            <TabsContent value="trip" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Current Trip Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        value={tripData.destination}
                        onChange={(e) => setTripData(prev => ({ ...prev, destination: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose of Visit</Label>
                      <Input
                        id="purpose"
                        value={tripData.purpose}
                        onChange={(e) => setTripData(prev => ({ ...prev, purpose: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={tripData.startDate}
                        onChange={(e) => setTripData(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={tripData.endDate}
                        onChange={(e) => setTripData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accommodation">Accommodation</Label>
                    <Input
                      id="accommodation"
                      value={tripData.accommodation}
                      onChange={(e) => setTripData(prev => ({ ...prev, accommodation: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activities">Planned Activities</Label>
                    <Textarea
                      id="activities"
                      value={tripData.plannedActivities}
                      onChange={(e) => setTripData(prev => ({ ...prev, plannedActivities: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Trip Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-success-light/20 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-success mx-auto mb-1" />
                        <p className="text-sm font-medium">Verified</p>
                        <p className="text-xs text-muted-foreground">Identity</p>
                      </div>
                      <div className="text-center p-3 bg-success-light/20 rounded-lg">
                        <Shield className="w-6 h-6 text-success mx-auto mb-1" />
                        <p className="text-sm font-medium">Active</p>
                        <p className="text-xs text-muted-foreground">Tracking</p>
                      </div>
                      <div className="text-center p-3 bg-primary/10 rounded-lg">
                        <MapPin className="w-6 h-6 text-primary mx-auto mb-1" />
                        <p className="text-sm font-medium">7 Days</p>
                        <p className="text-xs text-muted-foreground">Remaining</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/10 rounded-lg">
                        <Calendar className="w-6 h-6 text-secondary mx-auto mb-1" />
                        <p className="text-sm font-medium">Sep 14</p>
                        <p className="text-xs text-muted-foreground">Departure</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Digital ID Tab */}
            <TabsContent value="digital-id" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PassportIcon className="w-5 h-5" />
                    Blockchain Digital ID
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="inline-block p-6 bg-white rounded-lg border">
                    <QRCodeSVG 
                      value={`TOURIST_DIGITAL_ID:${user?.id}:${Date.now()}`}
                      size={200}
                      level="M"
                      includeMargin={true}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Digital Tourist ID</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This QR code contains your verified tourist identification. Show this to authorities when requested.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Tourist ID</p>
                        <p className="text-muted-foreground">DTID-{user?.id}</p>
                      </div>
                      <div>
                        <p className="font-medium">Validity</p>
                        <p className="text-muted-foreground">Valid for current trip</p>
                      </div>
                      <div>
                        <p className="font-medium">Issued</p>
                        <p className="text-muted-foreground">Sep 07, 2025</p>
                      </div>
                      <div>
                        <p className="font-medium">Expires</p>
                        <p className="text-muted-foreground">Sep 14, 2025</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Blockchain Security Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>✓ Tamper-proof identity verification</li>
                      <li>✓ Real-time validity checking</li>
                      <li>✓ Secure data encryption</li>
                      <li>✓ Government-verified credentials</li>
                    </ul>
                  </div>

                  <Button className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Download Digital ID Card
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;