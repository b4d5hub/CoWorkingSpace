
  import { useState } from 'react';
  import { Button } from './ui/button';
  import { Input } from './ui/input';
  import { Label } from './ui/label';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
  import { COUNTRY_CODES } from '../lib/countryCodes';
  import { ArrowLeft, Lock, Mail, User as UserIcon } from 'lucide-react';
  import type { User } from '../App';

  type LoginPageProps = {
    onLogin: (user: User) => void;
    onBackToHome: () => void;
  };

  export function LoginPage({ onLogin, onBackToHome }: LoginPageProps) {
    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register form state
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPhone, setRegisterPhone] = useState('');
    const [registerCountryCode, setRegisterCountryCode] = useState('+212');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      (async () => {
        try {
          const { login } = await import('../api/auth');
          const user = await login(loginEmail, loginPassword);
          onLogin(user);
        } catch (err: any) {
          setError(err?.message || 'Login failed');
        } finally {
          setLoading(false);
        }
      })();
    };

    const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      (async () => {
        try {
          const { register } = await import('../api/auth');
          const fullPhone = registerPhone && registerPhone.trim().length > 0
            ? `${registerCountryCode} ${registerPhone.trim()}`
            : undefined;
          const user = await register(registerName, registerEmail, registerPassword, fullPhone);
          onLogin(user);
        } catch (err: any) {
          setError(err?.message || 'Registration failed');
        } finally {
          setLoading(false);
        }
      })();
    };

    return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-white">
      {/* Back to Homepage Button - Top Left */}
      <Button
        onClick={onBackToHome}
        variant="ghost"
        className="absolute top-6 left-6 z-20 text-foreground hover:text-foreground/70"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <div className="w-full max-w-md relative z-10">

        <div className="text-center mb-8">
          <h1 className="text-foreground mb-2 tracking-tight">CoWorkingSpace</h1>
          <p className="text-muted-foreground">Distributed Room Reservation System</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-stone-100">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-white border-stone-200">
              <CardHeader>
                <CardTitle className="text-foreground">Welcome Back</CardTitle>
                <CardDescription className="text-muted-foreground">Sign in to manage your room reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 border-stone-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 border-stone-200"
                        required
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="text-sm text-red-600" role="alert">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white border-0 rounded-full"
                  >
                    {loading ? 'Signing in…' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="bg-white border-stone-200">
              <CardHeader>
                <CardTitle className="text-foreground">Create Account</CardTitle>
                <CardDescription className="text-muted-foreground">Register to start booking meeting rooms</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="pl-10 border-stone-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10 border-stone-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Phone Number</Label>
                    <div className="flex gap-2">
                      <div className="min-w-[180px]">
                        <Select value={registerCountryCode} onValueChange={setRegisterCountryCode}>
                          <SelectTrigger>
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            side="bottom"
                            sideOffset={6}
                            className="bg-white z-50 w-[300px] shadow-lg border border-stone-200"
                            style={{ maxHeight: '320px' }}
                          >
                            <div className="max-h-[320px] overflow-y-auto">
                              {COUNTRY_CODES.map((c) => (
                                <SelectItem key={`${c.iso2}-${c.code}`} value={c.code}>
                                  {c.code} ({c.country})
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="Phone number"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        className="border-stone-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10 border-stone-200"
                        required
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="text-sm text-red-600" role="alert">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white border-0 rounded-full"
                  >
                    {loading ? 'Creating account…' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
