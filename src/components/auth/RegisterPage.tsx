
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, User, Mail, Lock, UserCheck } from 'lucide-react';

interface RegisterPageProps {
  onRegister: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'accountant' | 'employee';
  }) => void;
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee' as 'admin' | 'accountant' | 'employee'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    onRegister(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl border border-white/20 dark:border-gray-700/30">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl shadow-2xl transform rotate-3">
                <Building2 className="h-10 w-10 text-white transform -rotate-3" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Join Our Team
            </CardTitle>
            <CardDescription className="text-gray-300 dark:text-gray-400 text-lg">
              Create your account to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                  <p className="text-red-300 text-sm font-medium">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-gray-200 dark:text-gray-300 font-medium">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-white/10 border-white/30 text-white placeholder-gray-300 focus:border-blue-400 dark:focus:border-blue-400 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-gray-200 dark:text-gray-300 font-medium">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 bg-white/10 border-white/30 text-white placeholder-gray-300 focus:border-blue-400 dark:focus:border-blue-400 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2 text-gray-200 dark:text-gray-300 font-medium">
                  <UserCheck className="h-4 w-4" />
                  Role
                </Label>
                <Select value={formData.role} onValueChange={(value: 'admin' | 'accountant' | 'employee') => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="h-12 bg-white/10 border-white/30 text-white focus:border-blue-400 dark:focus:border-blue-400 backdrop-blur-sm [&>span]:text-white">
                    <SelectValue />
                  </SelectTrigger>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-gray-200 dark:text-gray-300 font-medium">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 bg-white/10 border-white/30 text-white placeholder-gray-300 focus:border-blue-400 dark:focus:border-blue-400 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-200 dark:text-gray-300 font-medium">
                  <Lock className="h-4 w-4" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="h-12 bg-white/10 border-white/30 text-white placeholder-gray-300 focus:border-blue-400 dark:focus:border-blue-400 backdrop-blur-sm"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold text-lg shadow-2xl transition-all duration-300 hover:shadow-blue-500/25 transform hover:scale-[1.02]"
              >
                Create Account
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-white/20">
              <p className="text-gray-300 dark:text-gray-400">
                Already have an account?{' '}
                <button 
                  onClick={onSwitchToLogin}
                  className="text-blue-400 dark:text-blue-400 hover:text-blue-300 dark:hover:text-blue-300 font-semibold transition-colors underline decoration-2 underline-offset-2"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
