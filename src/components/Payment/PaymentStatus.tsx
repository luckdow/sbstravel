import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, Eye, Download } from 'lucide-react';

interface PaymentStatusProps {
  transactionId: string;
  onStatusUpdate?: (status: string) => void;
}

interface PaymentStatusData {
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  timestamp: string;
  description: string;
  errorMessage?: string;
  refundAmount?: number;
}

export default function PaymentStatus({ transactionId, onStatusUpdate }: PaymentStatusProps) {
  const [paymentData, setPaymentData] = useState<PaymentStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentStatus();
    const interval = setInterval(fetchPaymentStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [transactionId]);

  const fetchPaymentStatus = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: PaymentStatusData = {
        transactionId,
        status: 'completed',
        amount: 85.00,
        currency: 'USD',
        timestamp: new Date().toISOString(),
        description: 'Antalya Havalimanı → Kemer Transfer'
      };
      
      setPaymentData(mockData);
      onStatusUpdate?.(mockData.status);
    } catch (error) {
      console.error('Error fetching payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600 bg-yellow-100',
          label: 'Beklemede',
          description: 'Ödeme işlemi başlatıldı, onay bekleniyor'
        };
      case 'processing':
        return {
          icon: RefreshCw,
          color: 'text-blue-600 bg-blue-100',
          label: 'İşleniyor',
          description: 'Ödeme işlemi devam ediyor'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600 bg-green-100',
          label: 'Tamamlandı',
          description: 'Ödeme başarıyla tamamlandı'
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-600 bg-red-100',
          label: 'Başarısız',
          description: 'Ödeme işlemi başarısız oldu'
        };
      case 'cancelled':
        return {
          icon: AlertCircle,
          color: 'text-gray-600 bg-gray-100',
          label: 'İptal Edildi',
          description: 'Ödeme işlemi iptal edildi'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600 bg-gray-100',
          label: 'Bilinmiyor',
          description: 'Durum bilinmiyor'
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ödeme durumu kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Ödeme Bulunamadı</h3>
          <p className="text-gray-600">Belirtilen işlem numarası için ödeme bulunamadı.</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(paymentData.status);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Status Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${statusConfig.color} mb-4`}>
          <statusConfig.icon className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Ödeme Durumu: {statusConfig.label}
        </h2>
        <p className="text-gray-600">{statusConfig.description}</p>
      </div>

      {/* Payment Details */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">İşlem Numarası</h4>
            <p className="text-gray-600 font-mono">{paymentData.transactionId}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">Tutar</h4>
            <p className="text-lg font-bold text-green-600">
              {paymentData.amount.toFixed(2)} {paymentData.currency}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">İşlem Tarihi</h4>
            <p className="text-gray-600">
              {new Date(paymentData.timestamp).toLocaleString('tr-TR')}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">Açıklama</h4>
            <p className="text-gray-600">{paymentData.description}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {paymentData.status === 'failed' && paymentData.errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800">Hata Detayı</h4>
              <p className="text-red-700 text-sm mt-1">{paymentData.errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Refund Info */}
      {paymentData.refundAmount && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <div className="flex items-start space-x-3">
            <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800">İade Bilgisi</h4>
              <p className="text-blue-700 text-sm mt-1">
                {paymentData.refundAmount.toFixed(2)} {paymentData.currency} tutarında iade işlemi gerçekleştirildi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={fetchPaymentStatus}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Durumu Yenile</span>
        </button>
        
        {paymentData.status === 'completed' && (
          <>
            <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Detayları Görüntüle</span>
            </button>
            
            <button className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Fatura İndir</span>
            </button>
          </>
        )}
        
        {paymentData.status === 'failed' && (
          <button className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-700 transition-colors">
            Tekrar Dene
          </button>
        )}
      </div>

      {/* Status Timeline */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-4">İşlem Geçmişi</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Ödeme başlatıldı</p>
              <p className="text-xs text-gray-500">
                {new Date(paymentData.timestamp).toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
          
          {paymentData.status !== 'pending' && (
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                paymentData.status === 'completed' ? 'bg-green-500' : 
                paymentData.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {statusConfig.label}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(paymentData.timestamp).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}