import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService, UserRole } from '../../lib/services/auth-service';
import { Loader2, Shield } from 'lucide-react';
import { isCustomerSessionValid } from '../../utils/customerSession';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath
}: ProtectedRouteProps) {
  // Set default fallback path based on required role
  const defaultFallbackPath = fallbackPath || (
    requiredRole === 'admin' ? '/admin/login' :
    requiredRole === 'driver' ? '/driver/login' :
    '/booking'
  );
  const location = useLocation();
  const authState = authService.getAuthState();

  // Show loading spinner while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  // Special handling for customer role - check customer session as fallback
  if (requiredRole === 'customer' && !authState.isAuthenticated) {
    // Check if we have a valid customer session even if not authenticated
    if (isCustomerSessionValid()) {
      return <>{children}</>;
    }
    
    return <Navigate to={defaultFallbackPath} state={{ from: location }} replace />;
  }
  
  // For other roles, redirect to login if not authenticated
  if (!authState.isAuthenticated && requiredRole !== 'customer') {
    return <Navigate to={defaultFallbackPath} state={{ from: location }} replace />;
  }

  // Check if session is still valid
  if (!authService.isSessionValid()) {
    authService.logout();
    return <Navigate to={defaultFallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && !authService.hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission requirement
  if (requiredPermission && !authService.hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}