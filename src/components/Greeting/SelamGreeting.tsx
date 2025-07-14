import React from 'react';

interface SelamGreetingProps {
  className?: string;
}

export default function SelamGreeting({ className = '' }: SelamGreetingProps) {
  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <span className="text-2xl">👋</span>
      <span className="text-lg font-semibold text-yellow-400">
        Selam!
      </span>
      <span className="text-blue-100 text-sm">
        Hoş geldiniz
      </span>
    </div>
  );
}