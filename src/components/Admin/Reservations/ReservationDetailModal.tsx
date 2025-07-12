import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, User, Car, Phone, Edit, Trash2, Ban } from 'lucide-react';
import { getLocationString } from '../../../lib/utils/location';
import { generateReadableReservationNumber, getDriverDisplayName } from '../../../utils/reservation';
import { useStore } from '../../../store/useStore';
import toast from 'react-hot-toast';

interface ReservationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
}

export default function ReservationDetailModal({ isOpen, onClose, reservation }: ReservationDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateReservationStatus, deleteReservation, drivers } = useStore();

  if (!isOpen || !reservation) return null;

  const readableId = generateReadableReservationNumber(reservation.id || 'temp', 0);
  const driverName = getDriverDisplayName(reservation.driverId, drivers);

  const handleEdit = () => {
    setIsEditing(true);
    toast.success('Düzenleme modu aktif');
  };

  const handleDelete = async () => {
    if (window.confirm('Bu rezervasyonu silmek istediğinizden emin misiniz?')) {
      await deleteReservation(reservation.id);
      onClose();
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Bu rezervasyonu iptal etmek istediğinizden emin misiniz?')) {
      await updateReservationStatus(reservation.id, 'cancelled');
      onClose();
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    started: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    assigned: 'Atandı',
    started: 'Başladı',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{readableId}</h2>
            <p className="text-sm text-gray-600">{reservation.customerName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              statusColors[reservation.status as keyof typeof statusColors] || statusColors.pending
            }`}>
              {statusLabels[reservation.status as keyof typeof statusLabels] || 'Belirsiz'}
            </span>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Müşteri
            </h3>
            <div className="text-sm space-y-1">
              <div><strong>Ad:</strong> {reservation.customerName}</div>
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {reservation.customerPhone}
              </div>
              <div><strong>Email:</strong> {reservation.customerEmail}</div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Güzergah
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <strong>Kalkış:</strong> {getLocationString(reservation.pickupLocation)}
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <strong>Varış:</strong> {getLocationString(reservation.dropoffLocation)}
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-3 w-3 mr-1" />
                {reservation.pickupDate}
                <Clock className="h-3 w-3 ml-3 mr-1" />
                {reservation.pickupTime}
              </div>
            </div>
          </div>

          {/* Flight Info */}
          {reservation.flightNumber && (
            <div className="bg-blue-50 rounded-lg p-3">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Plane className="h-4 w-4 mr-2" />
                Uçuş Bilgisi
              </h3>
              <div className="text-sm">
                <div><strong>Uçuş Numarası:</strong> {reservation.flightNumber}</div>
              </div>
            </div>
          )}

          {/* Vehicle & Driver */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Araç
              </h3>
              <div className="text-sm">
                <div><strong>Tip:</strong> {reservation.vehicleType}</div>
                <div><strong>Yolcu:</strong> {reservation.passengerCount} kişi</div>
                <div><strong>Bagaj:</strong> {reservation.baggageCount} adet</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="font-semibold text-gray-800 mb-2">Şoför</h3>
              <div className="text-sm">
                <div className="font-medium">{driverName}</div>
                <div className="text-green-600 font-bold mt-1">${reservation.totalPrice}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200 flex space-x-2">
          <button 
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Düzenle</span>
          </button>
          <button 
            onClick={handleCancel}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Ban className="h-4 w-4" />
            <span>İptal Et</span>
          </button>
          <button 
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Sil</span>
          </button>
        </div>
      </div>
    </div>
  );
}