import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Ticket, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message === 'Invalid login credentials' 
            ? 'Invalid email or password' 
            : error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in"
        });
      }
    } else {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message.includes('already registered') 
            ? 'This email is already registered. Try signing in instead.' 
            : error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to TicketPulse"
        });
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 hero-gradient opacity-50" />
      
      <div className="relative w-full max-w-md">
        <Button
          variant="ghost"
          className="absolute -top-16 left-0"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Button>

        <div className="glass rounded-2xl p-8 shadow-2xl shadow-primary/10">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Ticket className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold gradient-text">TicketPulse</span>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>

          <p className="text-muted-foreground text-center mb-8">
            {isLogin 
              ? 'Sign in to access your account' 
              : 'Join us to discover amazing events'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-11 bg-secondary/50 border-border/50 focus:border-primary h-12"
                />
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 bg-secondary/50 border-border/50 focus:border-primary h-12"
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 bg-secondary/50 border-border/50 focus:border-primary h-12"
                />
              </div>
              {errors.password && (
                <p className="text-destructive text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              className="w-full h-12 text-base"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
