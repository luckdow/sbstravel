import React, { useState } from 'react';
import { X, User, MapPin, Calendar, Clock, Car, Users, Package } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import toast from 'react-hot-toast';

interface AddReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReservationFormData {
  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Transfer Info
  transferType: 'airport-hotel' | 'hotel-airport';
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  
  // Details
  passengerCount: number;
  baggageCount: number;
  vehicleType: 'standard' | 'premium' | 'luxury';
  
  // Notes
  notes: string;
}

const initialFormData: ReservationFormData = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  transferType: 'airport-hotel',
  pickupLocation: '',
  dropoffLocation: '',
  pickupDate: '',
  pickupTime: '',
  passengerCount: 1,
  baggageCount: 1,
  vehicleType: 'standard',
  notes: ''
};

const vehicleTypes = [
  { value: 'standard', label: 'Standart', basePrice: 50 },
  { value: 'premium', label: 'Premium', basePrice: 75 },
  { value: 'luxury', label: 'Lüks', basePrice: 100 }
];

const popularDestinations = [
  'Kemer - Club Med Palmiye',
  'Belek - Regnum Carya',
  'Side - Manavgat Resort',
  'Kalkan - Kas Resort',
  'Alanya - Crystal Hotel',
  'Antalya Merkez'
];

export default function AddReservationModal({ isOpen, onClose }: AddReservationModalProps) {
  const [formData, setFormData] = useState<ReservationFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const { createNewReservation } = useStore();

  // Calculate price based on form data
  const calculatePrice = () => {
    const selectedVehicle = vehicleTypes.find(v => v.value === formData.vehicleType);
    const basePrice = selectedVehicle?.basePrice || 50;
    const distance = 35; // Mock distance - in real app would calculate based on locations
    const totalPrice = Math.round(basePrice + (distance * 1.5)); // Simple calculation
    return totalPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
        toast.error('Lütfen müşteri bilgilerini doldurun');
        return;
      }

      if (!formData.pickupDate || !formData.pickupTime) {
        toast.error('Lütfen tarih ve saat bilgilerini girin');
        return;
      }

      // Calculate distance and price
      const distance = 35; // Mock distance
      const totalPrice = calculatePrice();

      // Create reservation data
      const reservationData = {
        customerInfo: {
          firstName: formData.customerName.split(' ')[0],
          lastName: formData.customerName.split(' ').slice(1).join(' ') || '',
          email: formData.customerEmail,
          phone: formData.customerPhone
        },
        transferType: formData.transferType,
        destination: {
          name: formData.transferType === 'airport-hotel' ? formData.dropoffLocation : formData.pickupLocation,
          lat: 36.8969, // Mock coordinates
          lng: 30.7133
        },
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        passengerCount: formData.passengerCount,
        baggageCount: formData.baggageCount,
        vehicleType: formData.vehicleType,
        additionalServices: [],
        distance,
        totalPrice
      };

      const result = await createNewReservation(reservationData);
      
      if (result) {
        toast.success('Rezervasyon başarıyla oluşturuldu!');
        setFormData(initialFormData);
        onClose();
      } else {
        toast.error('Rezervasyon oluşturulurken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Rezervasyon oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ReservationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Yeni Rezervasyon Oluştur</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Müşteri Bilgileri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Müşteri Adı *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ad Soyad"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+90 5xx xxx xx xx"
                  required
                />
              </div>
            </div>
          </div>

          {/* Transfer Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Transfer Bilgileri
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Tipi
                </label>
                <select
                  value={formData.transferType}
                  onChange={(e) => handleInputChange('transferType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="airport-hotel">Havalimanı → Otel</option>
                  <option value="hotel-airport">Otel → Havalimanı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Araç Tipi
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {vehicleTypes.map(vehicle => (
                    <option key={vehicle.value} value={vehicle.value}>
                      {vehicle.label} (₺{vehicle.basePrice} başlangıç)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.transferType === 'airport-hotel' ? 'Otel/Destinasyon' : 'Alış Noktası'}
                </label>
                <select
                  value={formData.transferType === 'airport-hotel' ? formData.dropoffLocation : formData.pickupLocation}
                  onChange={(e) => {
                    if (formData.transferType === 'airport-hotel') {
                      handleInputChange('dropoffLocation', e.target.value);
                      handleInputChange('pickupLocation', 'Antalya Havalimanı (AYT)');
                    } else {
                      handleInputChange('pickupLocation', e.target.value);
                      handleInputChange('dropoffLocation', 'Antalya Havalimanı (AYT)');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Destinasyon seçin</option>
                  {popularDestinations.map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.transferType === 'hotel-airport' ? 'Otel/Destinasyon' : 'Varış Noktası'}
                </label>
                <input
                  type="text"
                  value={formData.transferType === 'airport-hotel' ? 'Antalya Havalimanı (AYT)' : formData.dropoffLocation}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Tarih ve Saat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Tarihi *
                </label>
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Saati *
                </label>
                <input
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Detaylar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yolcu Sayısı
                </label>
                <input
                  type="number"
                  value={formData.passengerCount}
                  onChange={(e) => handleInputChange('passengerCount', parseInt(e.target.value) || 1)}
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bagaj Sayısı
                </label>
                <input
                  type="number"
                  value={formData.baggageCount}
                  onChange={(e) => handleInputChange('baggageCount', parseInt(e.target.value) || 1)}
                  min="0"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-800">Tahmini Fiyat:</span>
              <span className="text-2xl font-bold text-green-600">₺{calculatePrice()}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              * Final fiyat mesafe hesaplamasına göre güncellenecektir
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Oluşturuluyor...' : 'Rezervasyon Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}