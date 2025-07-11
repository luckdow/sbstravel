import React from 'react';
import { Database, AlertTriangle } from 'lucide-react';

interface MockDataIndicatorProps {
  isVisible?: boolean;
  onAddSampleData?: () => void;
  onClearData?: () => void;
}

export default function MockDataIndicator({ 
  isVisible = process.env.NODE_ENV === 'development',
  onAddSampleData,
  onClearData 
}: MockDataIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-orange-100 border border-orange-200 rounded-xl p-4 shadow-lg z-50 max-w-sm">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-orange-200 rounded-lg">
          <Database className="h-5 w-5 text-orange-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-orange-800">Development Mode</h4>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-xs text-orange-700 mt-1">
            Örnek veriler kullanılıyor. Gerçek API bağlandığında otomatik devre dışı kalacak.
          </p>
          <div className="flex space-x-2 mt-3">
            {onAddSampleData && (
              <button
                onClick={onAddSampleData}
                className="text-xs bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Örnek Veri Ekle
              </button>
            )}
            {onClearData && (
              <button
                onClick={onClearData}
                className="text-xs border border-orange-600 text-orange-600 px-3 py-1 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Temizle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}