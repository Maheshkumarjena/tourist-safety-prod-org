import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const demoAccounts = [
    {
      type: 'Tourist',
      email: 'tourist@demo.com',
      password: 'demo123',
      description: 'Regular tourist account with safety features',
      badge: 'Tourist',
      badgeColor: 'bg-primary'
    }
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    if (emailInput && passwordInput) {
      emailInput.value = email;
      passwordInput.value = password;
      
      // Trigger form validation
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-background flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link to="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Logo and Title */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t('auth.login')}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Access your tourist safety account
            </p>
          </div>

          {/* Demo Accounts */}
          <Card className="bg-muted/30 border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="w-5 h-5 text-success mr-2" />
                Demo Accounts
              </CardTitle>
              <CardDescription className="text-sm">
                Click to auto-fill credentials for testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {demoAccounts.map((account) => (
                <Button
                  key={account.type}
                  variant="outline"
                  className="w-full justify-between h-auto p-3"
                  onClick={() => fillDemoCredentials(account.email, account.password)}
                  type="button"
                >
                  <div className="text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={cn("text-xs", account.badgeColor, "text-white")}>
                        {account.badge}
                      </Badge>
                      <span className="font-medium text-sm">{account.type} Demo</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{account.description}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Login Form */}
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...register('password')}
                      className={cn(
                        "pr-10",
                        errors.password ? 'border-destructive' : ''
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link 
                    to="/auth/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('auth.loginButton')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/auth/register" className="text-primary hover:underline font-medium">
                    {t('auth.register')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Access */}
          <Card className="bg-emergency-light/50 border-emergency/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-emergency mx-auto mb-2" />
                <h3 className="font-medium text-emergency mb-2">Emergency Situation?</h3>
                <p className="text-sm text-emergency/80 mb-4">
                  Access emergency features without login
                </p>
                <Link to="/panic">
                  <Button variant="outline" className="w-full border-emergency text-emergency hover:bg-emergency hover:text-emergency-foreground">
                    Emergency Access
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;