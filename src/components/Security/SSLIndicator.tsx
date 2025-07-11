import React, { useState, useEffect } from 'react';
import { Shield, Check, AlertTriangle } from 'lucide-react';
import { validateSSLConfiguration } from '../../utils/ssl-validator';

interface SSLIndicatorProps {
  className?: string;
}

export default function SSLIndicator({ className = '' }: SSLIndicatorProps) {
  const [isSecure, setIsSecure] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSSL = () => {
      setIsLoading(true);
      const secure = validateSSLConfiguration();
      setIsSecure(secure);
      setIsLoading(false);
    };

    checkSSL();
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
        <span className="text-sm text-gray-600">Güvenlik kontrol ediliyor...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isSecure ? (
        <>
          <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
            <Shield className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex items-center space-x-1">
            <Check className="h-3 w-3 text-green-600" />
            <span className="text-sm font-medium text-green-700">Güvenli Bağlantı</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3 text-red-600" />
            <span className="text-sm font-medium text-red-700">Güvensiz Bağlantı</span>
          </div>
        </>
      )}
    </div>
  );
}