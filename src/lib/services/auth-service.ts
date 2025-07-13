export type UserRole = 'admin' | 'customer' | 'driver';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  permissions: string[];
  metadata: {
    lastLogin?: Date;
    loginCount: number;
    registrationDate: Date;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  profile?: {
    avatar?: string;
    address?: string;
    preferences: {
      language: string;
      currency: string;
      notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
      };
    };
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpiry: Date | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
  termsAccepted: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    sessionExpiry: null,
  };
  private listeners: ((state: AuthState) => void)[] = [];

  // Mock user database
  private users: Map<string, User & { password: string }> = new Map();

  // Role permissions mapping
  private rolePermissions: Record<UserRole, string[]> = {
    admin: [
      'reservations:read',
      'reservations:write',
      'reservations:delete',
      'users:read',
      'users:write',
      'users:delete',
      'drivers:read',
      'drivers:write',
      'drivers:assign',
      'payments:read',
      'payments:refund',
      'analytics:read',
      'settings:write',
    ],
    customer: [
      'reservations:read:own',
      'reservations:write:own',
      'profile:read:own',
      'profile:write:own',
      'invoices:read:own',
    ],
    driver: [
      'reservations:read:assigned',
      'reservations:update:assigned',
      'profile:read:own',
      'profile:write:own',
      'earnings:read:own',
      'transfers:update:own',
    ],
  };

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    this.initializeMockUsers();
    this.loadAuthState();
    this.startSessionMonitoring();
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      this.setLoading(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userWithPassword = Array.from(this.users.values()).find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase()
      );

      if (!userWithPassword) {
        return { success: false, error: 'E-posta adresi bulunamadı' };
      }

      // Simple password check (in production, use proper hashing)
      if (userWithPassword.password !== credentials.password) {
        return { success: false, error: 'Geçersiz şifre' };
      }

      if (!userWithPassword.isActive) {
        return { success: false, error: 'Hesabınız deaktif durumda' };
      }

      const user: User = { ...userWithPassword };
      delete (user as any).password;

      // Update login metadata
      user.metadata.lastLogin = new Date();
      user.metadata.loginCount += 1;

      // Generate session token
      const token = this.generateToken(user.id, credentials.rememberMe);
      const sessionExpiry = credentials.rememberMe
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      this.authState = {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        sessionExpiry,
      };

      this.saveAuthState();
      this.notifyListeners();

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Giriş sırasında bir hata oluştu' };
    } finally {
      this.setLoading(false);
    }
  }

  async register(data: RegisterData): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      this.setLoading(true);

      // Check if email already exists
      const existingUser = Array.from(this.users.values()).find(
        u => u.email.toLowerCase() === data.email.toLowerCase()
      );

      if (existingUser) {
        return { success: false, error: 'Bu e-posta adresi zaten kullanımda' };
      }

      // Create new user
      const userId = this.generateUserId();
      const user: User = {
        id: userId,
        email: data.email.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role || 'customer',
        isActive: true,
        permissions: this.rolePermissions[data.role || 'customer'],
        metadata: {
          lastLogin: new Date(),
          loginCount: 1,
          registrationDate: new Date(),
          emailVerified: false,
          phoneVerified: false,
        },
        profile: {
          preferences: {
            language: 'tr',
            currency: 'USD',
            notifications: {
              email: true,
              sms: true,
              push: true,
            },
          },
        },
      };

      // Store user with password
      this.users.set(userId, { ...user, password: data.password });

      // Auto-login after registration
      const token = this.generateToken(userId);
      const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      this.authState = {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        sessionExpiry,
      };

      this.saveAuthState();
      this.saveUsers();
      this.notifyListeners();

      // Send welcome email (simulated)
      await this.sendWelcomeEmail(user);

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Kayıt sırasında bir hata oluştu' };
    } finally {
      this.setLoading(false);
    }
  }

  async logout(): Promise<void> {
    this.authState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      sessionExpiry: null,
    };

    this.clearAuthState();
    this.notifyListeners();
  }

  // Google sign-in integration
  async authenticateGoogleUser(googleUser: { email: string; name: string }, role: UserRole): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      this.setLoading(true);

      // Check if user already exists
      const userEmail = googleUser.email?.toLowerCase() || '';
      let existingUser = Array.from(this.users.values()).find(u => {
        return u.email && u.email.toLowerCase() === userEmail;
      });

      let user: User;

      if (existingUser) {
        // Verify role matches
        if (existingUser.role !== role) {
          return { 
            success: false, 
            error: `Bu hesap ${role} yetkisine sahip değil. Mevcut yetki: ${existingUser.role}` 
          };
        }
        
        user = { ...existingUser };
        delete (user as any).password;
        
        // Update login metadata
        user.metadata.lastLogin = new Date();
        user.metadata.loginCount += 1;
        
        // Update the stored user
        this.users.set(user.id, { ...existingUser, metadata: user.metadata });
      } else {
        // Create new user from Google account
        const userId = this.generateUserId();
        const nameParts = googleUser.name?.split(' ') || ['User', ''];
        const firstName = nameParts[0] || 'User';
        const lastNameParts = nameParts.slice(1) || [''];
        
        user = {
          id: userId,
          email: userEmail,
          firstName: firstName || '',
          lastName: lastNameParts.join(' ') || '',
          phone: '', // Will need to be filled later
          role: role,
          isActive: true,
          permissions: this.rolePermissions[role],
          metadata: {
            lastLogin: new Date(),
            loginCount: 1,
            registrationDate: new Date(),
            emailVerified: true, // Google accounts are verified
            phoneVerified: false,
          },
          profile: {
            preferences: {
              language: 'tr',
              currency: 'USD',
              notifications: {
                email: true,
                sms: true,
                push: true,
              },
            },
          },
        };

        // Store user (Google users don't have passwords in our system)
        this.users.set(userId, { ...user, password: '' });
      }

      // Generate session token
      const token = this.generateToken(user.id);
      const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      this.authState = {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        sessionExpiry,
      };

      this.saveAuthState();
      this.saveUsers();
      this.notifyListeners();

      return { success: true, user };
    } catch (error) {
      console.error('Google authentication error:', error);
      return { success: false, error: 'Google ile giriş sırasında bir hata oluştu' };
    } finally {
      this.setLoading(false);
    }
  }

  async requestPasswordReset(request: PasswordResetRequest): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const user = Array.from(this.users.values()).find(
        u => u.email.toLowerCase() === request.email.toLowerCase()
      );

      if (!user) {
        // Don't reveal if email exists or not for security
        return { success: true };
      }

      // Generate reset token (in production, store securely and set expiry)
      const resetToken = this.generateResetToken();
      
      // Send reset email (simulated)
      await this.sendPasswordResetEmail(user, resetToken);

      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: 'Şifre sıfırlama isteği sırasında hata oluştu' };
    }
  }

  async confirmPasswordReset(request: PasswordResetConfirm): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // In production, verify token validity and expiry
      // For demo, accept any token that starts with 'reset_'
      if (!request.token.startsWith('reset_')) {
        return { success: false, error: 'Geçersiz sıfırlama kodu' };
      }

      // In production, find user by token
      // For demo, we'll just update the first user's password
      const firstUser = Array.from(this.users.values())[0];
      if (firstUser) {
        firstUser.password = request.newPassword;
        this.saveUsers();
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset confirm error:', error);
      return { success: false, error: 'Şifre sıfırlama sırasında hata oluştu' };
    }
  }

  // Permission and role management
  hasPermission(permission: string, resourceId?: string): boolean {
    if (!this.authState.user) return false;

    const userPermissions = this.authState.user.permissions;
    
    // Check for exact permission
    if (userPermissions.includes(permission)) return true;

    // Check for owner-specific permissions
    if (permission.includes(':own') && resourceId) {
      return userPermissions.includes(permission) && resourceId === this.authState.user.id;
    }

    return false;
  }

  hasRole(role: UserRole): boolean {
    return this.authState.user?.role === role;
  }

  canAccessPanel(panel: 'admin' | 'customer' | 'driver'): boolean {
    if (!this.authState.isAuthenticated) return false;
    
    const userRole = this.authState.user?.role;
    
    switch (panel) {
      case 'admin':
        return userRole === 'admin';
      case 'customer':
        return userRole === 'customer';
      case 'driver':
        return userRole === 'driver';
      default:
        return false;
    }
  }

  getRedirectPath(): string {
    if (!this.authState.user) return '/';
    
    switch (this.authState.user.role) {
      case 'admin':
        return '/admin';
      case 'customer':
        return '/customer-panel';
      case 'driver':
        return '/driver';
      default:
        return '/';
    }
  }

  // User management
  async updateProfile(updates: Partial<User>): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      if (!this.authState.user) {
        return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
      }

      const userId = this.authState.user.id;
      const userWithPassword = this.users.get(userId);
      
      if (!userWithPassword) {
        return { success: false, error: 'Kullanıcı bulunamadı' };
      }

      // Update user data
      const updatedUser = { ...userWithPassword, ...updates };
      this.users.set(userId, updatedUser);

      // Update auth state
      const userWithoutPassword: User = { ...updatedUser };
      delete (userWithoutPassword as any).password;
      
      this.authState.user = userWithoutPassword;
      
      this.saveAuthState();
      this.saveUsers();
      this.notifyListeners();

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profil güncellenirken hata oluştu' };
    }
  }

  // State management
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  isSessionValid(): boolean {
    if (!this.authState.sessionExpiry) return false;
    return new Date() < this.authState.sessionExpiry;
  }

  // Private methods
  private initializeMockUsers(): void {
    // Admin user
    this.users.set('admin-1', {
      id: 'admin-1',
      email: 'sbstravelinfo@gmail.com',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+90 242 123 45 67',
      role: 'admin',
      isActive: true,
      permissions: this.rolePermissions.admin,
      password: 'admin123',
      metadata: {
        lastLogin: new Date(),
        loginCount: 0,
        registrationDate: new Date(),
        emailVerified: true,
        phoneVerified: true,
      },
      profile: {
        preferences: {
          language: 'tr',
          currency: 'USD',
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
        },
      },
    });

    // Customer user
    this.users.set('customer-1', {
      id: 'customer-1',
      email: 'customer@test.com',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      phone: '+90 532 123 45 67',
      role: 'customer',
      isActive: true,
      permissions: this.rolePermissions.customer,
      password: 'customer123',
      metadata: {
        lastLogin: new Date(),
        loginCount: 0,
        registrationDate: new Date(),
        emailVerified: true,
        phoneVerified: false,
      },
      profile: {
        preferences: {
          language: 'tr',
          currency: 'USD',
          notifications: {
            email: true,
            sms: true,
            push: false,
          },
        },
      },
    });

    // Driver user
    this.users.set('driver-1', {
      id: 'driver-1',
      email: 'driver@test.com',
      firstName: 'Mehmet',
      lastName: 'Demir',
      phone: '+90 533 123 45 67',
      role: 'driver',
      isActive: true,
      permissions: this.rolePermissions.driver,
      password: 'driver123',
      metadata: {
        lastLogin: new Date(),
        loginCount: 0,
        registrationDate: new Date(),
        emailVerified: true,
        phoneVerified: true,
      },
      profile: {
        preferences: {
          language: 'tr',
          currency: 'USD',
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
        },
      },
    });

    this.saveUsers();
  }

  private generateToken(userId: string, longExpiry?: boolean): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${userId}_${timestamp}_${random}`;
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private generateResetToken(): string {
    return `reset_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private setLoading(loading: boolean): void {
    this.authState.isLoading = loading;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.authState }));
  }

  private saveAuthState(): void {
    try {
      localStorage.setItem('ayt_auth_state', JSON.stringify({
        user: this.authState.user,
        token: this.authState.token,
        sessionExpiry: this.authState.sessionExpiry?.toISOString(),
      }));
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }

  private loadAuthState(): void {
    try {
      const saved = localStorage.getItem('ayt_auth_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user && parsed.token && parsed.sessionExpiry) {
          const sessionExpiry = new Date(parsed.sessionExpiry);
          if (sessionExpiry > new Date()) {
            this.authState = {
              user: parsed.user,
              token: parsed.token,
              isAuthenticated: true,
              isLoading: false,
              sessionExpiry,
            };
            console.log('Session restored for user:', parsed.user.email);
          } else {
            console.log('Session expired, clearing auth state');
            this.clearAuthState();
          }
        } else {
          console.log('Invalid stored auth data, clearing');
          this.clearAuthState();
        }
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      console.warn('Clearing potentially corrupted auth state');
      this.clearAuthState();
    }
  }

  private clearAuthState(): void {
    localStorage.removeItem('ayt_auth_state');
  }

  private saveUsers(): void {
    try {
      const usersArray = Array.from(this.users.entries());
      localStorage.setItem('ayt_users', JSON.stringify(usersArray));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  private loadUsers(): void {
    try {
      const saved = localStorage.getItem('ayt_users');
      if (saved) {
        const usersArray = JSON.parse(saved);
        this.users = new Map(usersArray);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  private startSessionMonitoring(): void {
    setInterval(() => {
      if (this.authState.isAuthenticated && !this.isSessionValid()) {
        console.log('Session expired, logging out...');
        this.logout();
      }
    }, 60000); // Check every minute
  }

  private async sendWelcomeEmail(user: User): Promise<void> {
    console.log(`Sending welcome email to ${user.email}`);
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async sendPasswordResetEmail(user: User, resetToken: string): Promise<void> {
    console.log(`Sending password reset email to ${user.email} with token: ${resetToken}`);
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

export const authService = AuthService.getInstance();