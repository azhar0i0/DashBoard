
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Building, Save } from 'lucide-react';
import { useFinancial } from '@/context/FinancialContext';

const Settings = () => {
  const { toast } = useToast();
  const { settings, updateSettings } = useFinancial();
  
  const [localSettings, setLocalSettings] = useState({
    companyName: settings.companyName,
    userName: settings.userName,
    currency: settings.currency,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    if (localSettings.newPassword && localSettings.newPassword !== localSettings.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password don't match.",
        variant: "destructive"
      });
      return;
    }

    updateSettings({
      companyName: localSettings.companyName,
      userName: localSettings.userName,
      currency: localSettings.currency,
    });

    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });

    // Clear password fields
    setLocalSettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account and company preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Update your company details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={localSettings.companyName}
                onChange={(e) => setLocalSettings({...localSettings, companyName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={localSettings.currency} onValueChange={(value) => setLocalSettings({...localSettings, currency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your personal account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name</Label>
              <Input 
                id="userName" 
                value={localSettings.userName}
                onChange={(e) => setLocalSettings({...localSettings, userName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password"
                value={localSettings.currentPassword}
                onChange={(e) => setLocalSettings({...localSettings, currentPassword: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password"
                value={localSettings.newPassword}
                onChange={(e) => setLocalSettings({...localSettings, newPassword: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type="password"
                value={localSettings.confirmPassword}
                onChange={(e) => setLocalSettings({...localSettings, confirmPassword: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
