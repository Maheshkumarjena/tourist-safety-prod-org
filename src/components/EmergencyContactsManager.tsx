import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Phone, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Star,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  email?: string;
  address?: string;
}

interface ContactFormData {
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  email: string;
  address: string;
}

const relationshipOptions = [
  'Family',
  'Spouse',
  'Parent',
  'Sibling',
  'Child',
  'Friend',
  'Colleague',
  'Doctor',
  'Lawyer',
  'Insurance Agent',
  'Hotel/Accommodation',
  'Tour Guide',
  'Other'
];

export function EmergencyContactsManager() {
  const { emergencyContacts, addEmergencyContact, updateEmergencyContact, removeEmergencyContact } = useAppStore();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false,
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.relationship) {
      newErrors.relationship = 'Relationship is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveContact = () => {
    if (!validateForm()) return;

    const contactData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      relationship: formData.relationship,
      isPrimary: formData.isPrimary,
      email: formData.email.trim() || undefined,
      address: formData.address.trim() || undefined,
    };

    if (editingContact) {
      updateEmergencyContact(editingContact.id, contactData);
      setEditingContact(null);
    } else {
      addEmergencyContact(contactData);
      setIsAddingContact(false);
    }

    // Reset form
    setFormData({
      name: '',
      phone: '',
      relationship: '',
      isPrimary: false,
      email: '',
      address: ''
    });
    setErrors({});
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isPrimary: contact.isPrimary,
      email: contact.email || '',
      address: contact.address || ''
    });
    setEditingContact(contact);
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Are you sure you want to delete this emergency contact?')) {
      removeEmergencyContact(contactId);
    }
  };

  const handleCancel = () => {
    setIsAddingContact(false);
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      relationship: '',
      isPrimary: false,
      email: '',
      address: ''
    });
    setErrors({});
  };

  const handleCallContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const primaryContact = emergencyContacts.find(contact => contact.isPrimary);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6" />
            Emergency Contacts
          </h2>
          <p className="text-muted-foreground">
            Manage your emergency contact information for quick access during emergencies
          </p>
        </div>
        
        <Button
          onClick={() => setIsAddingContact(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      {/* Primary Contact Alert */}
      {!primaryContact && emergencyContacts.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No primary contact set. Please designate one contact as your primary emergency contact.
          </AlertDescription>
        </Alert>
      )}

      {/* Contact Form */}
      <AnimatePresence>
        {(isAddingContact || editingContact) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingContact ? 'Edit Contact' : 'Add New Contact'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship *</Label>
                    <Select
                      value={formData.relationship}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
                    >
                      <SelectTrigger className={errors.relationship ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.relationship && (
                      <p className="text-sm text-destructive">{errors.relationship}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter address"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPrimary"
                    checked={formData.isPrimary}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrimary: checked }))}
                  />
                  <Label htmlFor="isPrimary" className="text-sm">
                    Set as primary contact
                  </Label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleSaveContact} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {editingContact ? 'Update Contact' : 'Save Contact'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contacts List */}
      <div className="grid gap-4">
        {emergencyContacts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No Emergency Contacts
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add emergency contacts for quick access during emergencies
              </p>
              <Button onClick={() => setIsAddingContact(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Contact
              </Button>
            </CardContent>
          </Card>
        ) : (
          emergencyContacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <Card className={cn(
                "transition-all duration-200 hover:shadow-md",
                contact.isPrimary && "ring-2 ring-primary/20 bg-primary/5"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-foreground" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">{contact.name}</h3>
                          {contact.isPrimary && (
                            <Badge variant="default" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Primary
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{contact.phone}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {contact.relationship}
                          </div>
                          {contact.email && (
                            <div className="text-sm text-muted-foreground">
                              {contact.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCallContact(contact.phone)}
                        className="text-success border-success hover:bg-success hover:text-success-foreground"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditContact(contact)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {emergencyContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Emergency Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {primaryContact && (
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start text-left text-success border-success hover:bg-success hover:text-success-foreground"
                  onClick={() => handleCallContact(primaryContact.phone)}
                >
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Call Primary Contact</div>
                      <div className="text-sm opacity-80">{primaryContact.name}</div>
                    </div>
                  </div>
                </Button>
              )}
              
              <Button
                variant="outline"
                className="h-auto p-4 justify-start text-left"
                onClick={() => {
                  const message = `Emergency Alert: I need immediate assistance. Please contact me or emergency services. Location: ${window.location.href}`;
                  const phones = emergencyContacts.map(c => c.phone).join(',');
                  window.open(`sms:${phones}?body=${encodeURIComponent(message)}`, '_self');
                }}
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Send Emergency SMS</div>
                    <div className="text-sm opacity-80">To all contacts</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}