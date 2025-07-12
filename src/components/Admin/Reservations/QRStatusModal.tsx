import React from 'react';
import { X, QrCode, CheckCircle, Clock, AlertCircle, MapPin, Calendar, User, Car } from 'lucide-react';
import { Reservation } from '../../../types';
import { getLocationString } from '../../../lib/utils/location';

interface QRStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

export default function QRStatusModal({ isOpen, onClose, reservation }: QRStatusModalProps) {
  if (!isOpen || !reservation) return null;

  const getStatusInfo = () => {
    switch (reservation.status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          title: 'Beklemede',
          description: 'Rezervasyon henüz şoföre atanmamış.'
        };
      case 'assigned':
        return {
          icon: Clock,
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          title: 'Şoföre Atandı',
          description: 'Şoför henüz QR kodu okutmadı.'
        };
      case 'started':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          title: 'Transfer Başladı',
          description: 'Şoför QR kodu okuttu ve transfere başladı.'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          title: 'Tamamlandı',
          description: 'Transfer başarıyla tamamlandı.'
        };
      case 'cancelled':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          title: 'İptal Edildi',
          description: 'Rezervasyon iptal edildi.'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          title: 'Bilinmiyor',
          description: 'Rezervasyon durumu bilinmiyor.'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">QR Kod Durumu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* QR Status */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 ${statusInfo.bgColor} rounded-full mb-4`}>
              <StatusIcon className={`h-10 w-10 ${statusInfo.color}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{statusInfo.title}</h3>
            <p className="text-gray-600">{statusInfo.description}</p>
          </div>

          {/* QR Code */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <QrCode className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">QR Kod Bilgisi</h3>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-2">
                <div className="text-lg font-mono font-bold text-gray-800">{reservation.qrCode}</div>
              </div>
              <p className="text-sm text-gray-600">
                Bu kod şoför tarafından {reservation.status === 'started' || reservation.status === 'completed' ? 'okutuldu' : 'henüz okutulmadı'}
              </p>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Müşteri</p>
                <p className="font-medium text-gray-800">{reservation.customerName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Güzergah</p>
                <p className="font-medium text-gray-800">
                  {getLocationString(reservation.pickupLocation)} → {getLocationString(reservation.dropoffLocation)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Tarih & Saat</p>
                <p className="font-medium text-gray-800">{reservation.pickupDate} {reservation.pickupTime}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Car className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Araç & Şoför</p>
                <p className="font-medium text-gray-800">
                  {reservation.vehicleType} - {reservation.driverName || 'Atanmadı'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}