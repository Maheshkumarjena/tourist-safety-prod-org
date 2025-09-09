import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore, useAppStore, useLocationStore } from '@/lib/store';
import { useTranslation, translations } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon,
  Globe,
  Bell,
  Shield,
  MapPin,
  Moon,
  Sun,
  Phone,
  User,
  Trash2,
  Plus,
  Save,
  AlertTriangle,
  Database
} from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuthStore();
  const { language, setLanguage, theme, setTheme, emergencyContacts, addEmergencyContact, updateEmergencyContact, removeEmergencyContact } = useAppStore();
  const { trackingConsent, setTrackingConsent } = useLocationStore();
  const { t } = useTranslation(language);

  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false
  });
  const [showAddContact, setShowAddContact] = useState(false);
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    emergency: true
  });

  const languages = Object.keys(translations);

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      addEmergencyContact(newContact);
      setNewContact({ name: '', phone: '', relationship: '', isPrimary: false });
      setShowAddContact(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleDataDeletion = () => {
    if (confirm('Are you sure you want to request data deletion? This action cannot be undone and will remove all your personal data from our systems.')) {
      alert('Data deletion request submitted. You will receive a confirmation email within 24 hours.');
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
            <h1 className="text-xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-3">
              <SettingsIcon className="w-6 h-6 md:w-8 md:h-8" />
              {t('settings.settings')}
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your preferences and safety settings
            </p>
          </div>

          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground">{user?.phoneNumber}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-2">
                    {user?.role === 'authority' ? 'Authority User' : 'Tourist'}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Safety Score: {user?.safetyScore}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('settings.language')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map((lang) => {
                  const languageData = translations[lang as keyof typeof translations];
                  const displayName = (languageData as any)?.languages?.[lang] || lang.toUpperCase();
                  
                  return (
                    <Button
                      key={lang}
                      variant={language === lang ? "default" : "outline"}
                      className="justify-start text-left h-auto p-3"
                      onClick={() => setLanguage(lang)}
                    >
                      <div>
                        <div className="font-medium text-sm">
                          {displayName}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="location-tracking" className="text-base font-medium">
                    Location Tracking
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow real-time location monitoring for safety
                  </p>
                </div>
                <Switch
                  id="location-tracking"
                  checked={trackingConsent}
                  onCheckedChange={setTrackingConsent}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Data Collection Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Emergency Location Sharing</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Analytics & Usage Data</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Safety Score Tracking</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {t('settings.notifications')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts and updates</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Emergency Alerts</Label>
                  <p className="text-sm text-muted-foreground">Critical safety notifications</p>
                </div>
                <Switch
                  checked={notifications.emergency}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, emergency: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Text message notifications</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, sms: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Emergency Contacts
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddContact(!showAddContact)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Contact Form */}
              {showAddContact && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        placeholder="Full Name"
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Phone Number"
                        value={newContact.phone}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <Input
                      placeholder="Relationship (e.g., Family, Friend, Colleague)"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="primary-contact"
                          checked={newContact.isPrimary}
                          onCheckedChange={(checked) => 
                            setNewContact(prev => ({ ...prev, isPrimary: checked }))
                          }
                        />
                        <Label htmlFor="primary-contact">Primary Contact</Label>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setShowAddContact(false)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleAddContact}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact List */}
              <div className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{contact.name}</p>
                        {contact.isPrimary && (
                          <Badge variant="default" className="text-xs">Primary</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeEmergencyContact(contact.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {emergencyContacts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Phone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No emergency contacts added yet</p>
                    <p className="text-sm">Add contacts for faster emergency response</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Current: {theme === 'dark' ? 'Dark' : 'Light'} mode
                  </p>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleDataDeletion}
              >
                <Database className="w-4 h-4 mr-2" />
                Request Data Deletion
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleLogout}
              >
                {t('settings.logout')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;