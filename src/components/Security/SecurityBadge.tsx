import React from 'react';
import { Shield, Lock, Award } from 'lucide-react';

interface SecurityBadgeProps {
  type?: 'ssl' | 'payment' | 'data';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SecurityBadge({ 
  type = 'ssl', 
  size = 'md',
  className = '' 
}: SecurityBadgeProps) {
  const badges = {
    ssl: {
      icon: Shield,
      title: 'SSL Korumalı',
      subtitle: '256-bit şifreleme',
      color: 'green'
    },
    payment: {
      icon: Lock,
      title: 'Güvenli Ödeme',
      subtitle: 'PCI DSS sertifikalı',
      color: 'blue'
    },
    data: {
      icon: Award,
      title: 'KVKK Uyumlu',
      subtitle: 'Veri güvenliği',
      color: 'purple'
    }
  };

  const badge = badges[type];
  const Icon = badge.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  return (
    <div className={`
      inline-flex items-center space-x-2 border rounded-lg font-medium
      ${sizeClasses[size]}
      ${colorClasses[badge.color]}
      ${className}
    `}>
      <Icon className={iconSizes[size]} />
      <div className="flex flex-col">
        <span className="font-semibold leading-tight">{badge.title}</span>
        {size !== 'sm' && (
          <span className="text-xs opacity-75 leading-tight">{badge.subtitle}</span>
        )}
      </div>
    </div>
  );
}