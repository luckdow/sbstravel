import React from 'react';
import { User, Mail, Phone, Plus, X } from 'lucide-react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { BookingFormData } from '../../types';
import { useStore } from '../../store/useStore';
import { useEffect } from 'react';

interface CustomerInfoFormProps {
  register: UseFormRegister<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  setValue: UseFormSetValue<BookingFormData>;
  additionalServices: string[];
}


export default function CustomerInfoForm({
  register,
  errors,
  setValue,
  additionalServices
}: CustomerInfoFormProps) {
  const { extraServices, fetchExtraServices } = useStore();
  
  useEffect(() => {
    fetchExtraServices();
  }, [fetchExtraServices]);
  
  const toggleService = (serviceId: string) => {
    const currentServices = additionalServices || [];
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId];
    
    setValue('additionalServices', newServices);
  };

  const getTotalServicesCost = () => {
    return (additionalServices || []).reduce((total, serviceId) => {
      const service = extraServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Kişisel Bilgiler</h2>
      
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Ad *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                {...register('customerInfo.firstName')}
                placeholder="Adınızı girin"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            {errors.customerInfo?.firstName && (
              <p className="mt-2 text-sm text-red-600">{errors.customerInfo.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Soyad *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                {...register('customerInfo.lastName')}
                placeholder="Soyadınızı girin"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            {errors.customerInfo?.lastName && (
              <p className="mt-2 text-sm text-red-600">{errors.customerInfo.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">E-posta *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                {...register('customerInfo.email')}
                placeholder="ornek@email.com"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            {errors.customerInfo?.email && (
              <p className="mt-2 text-sm text-red-600">{errors.customerInfo.email.message}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">QR kodlu fatura bu adrese gönderilecektir</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Telefon *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                {...register('customerInfo.phone')}
                placeholder="+90 5XX XXX XX XX"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            {errors.customerInfo?.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.customerInfo.phone.message}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">Acil durumlar için iletişim</p>
          </div>
        </div>

        {/* Additional Services */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Ek Hizmetler (İsteğe Bağlı)</h3>
          <p className="text-gray-600 mb-6">Transfer deneyiminizi daha konforlu hale getirmek için ek hizmetler seçebilirsiniz.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {extraServices.length > 0 ? extraServices.map((service) => {
              const isSelected = (additionalServices || []).includes(service.id);
              
              return (
                <div
                  key={service.id}
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{service.name}</h4>
                      <p className="text-sm text-blue-600 font-semibold">+${service.price}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Plus className="h-4 w-4 text-white rotate-45" />}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-3 text-center py-4 text-gray-500">
                Ek hizmetler yükleniyor...
              </div>
            )}
          </div>

          {(additionalServices || []).length > 0 && (
            <div className="mt-6 bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">Seçilen Ek Hizmetler:</span>
                <span className="font-bold text-blue-600">${getTotalServicesCost()}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(additionalServices || []).map((serviceId) => {
                  const service = availableServices.find(s => s.id === serviceId);
                  return service ? (
                    <span
                      key={serviceId}
                      className="inline-flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{service.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleService(serviceId);
                        }}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Önemli Bilgiler:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Transfer saatinden 15 dakika önce hazır olunuz</li>
            <li>• Şoförünüz size WhatsApp ile ulaşacaktır</li>
            <li>• QR kodunuzu şoföre göstermeyi unutmayınız</li>
            <li>• İptal işlemleri transfer saatinden 24 saat önce yapılmalıdır</li>
          </ul>
        </div>
      </div>
    </div>
  );
}