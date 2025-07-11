import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { googleMapsService } from '../lib/google-maps';
import { calculatePrice } from '../utils/pricing';
import { ANTALYA_AIRPORT } from '../config/google-maps';

import Header from '../components/Layout/Header';
import Footer from '../components/Footer';
import LocationSearch from '../components/Booking/LocationSearch';
import VehicleSelection from '../components/Booking/VehicleSelection';
import CustomerInfoForm from '../components/Booking/CustomerInfoForm';
import PriceDisplay from '../components/Booking/PriceDisplay';
import PaymentGateway from '../components/Payment/PaymentGateway';
import RouteMap from '../components/Booking/RouteMap';

import { MapPin, Calendar, Clock, Users, Luggage, ArrowRight, CheckCircle } from 'lucide-react';

// Form validation schema
const bookingSchema = yup.object({
  transferType: yup.string().required('Transfer türü seçiniz'),
  destination: yup.string().required('Varış noktası gereklidir'),
  pickupDate: yup.string().required('Transfer tarihi gereklidir'),
  pickupTime: yup.string().required('Transfer saati gereklidir'),
  passengerCount: yup.number().min(1, 'En az 1 yolcu').required('Yolcu sayısı gereklidir'),
  baggageCount: yup.number().min(0, 'Bagaj sayısı 0 veya daha fazla olmalı').required('Bagaj sayısı gereklidir'),
  vehicleType: yup.string().required('Araç tipi seçiniz'),
  customerInfo: yup.object({
    firstName: yup.string().required('Ad gereklidir'),
    lastName: yup.string().required('Soyad gereklidir'),
    email: yup.string().email('Geçerli e-posta adresi girin').required('E-posta gereklidir'),
    phone: yup.string().required('Telefon numarası gereklidir')
  })
});

type BookingFormData = yup.InferType<typeof bookingSchema>;

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [priceCalculation, setPriceCalculation] = useState<any>(null);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  
  const navigate = useNavigate();
  const { createNewReservation } = useStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema),
    defaultValues: {
      transferType: 'airport-hotel',
      passengerCount: 2,
      baggageCount: 2,
      vehicleType: 'standard',
      additionalServices: []
    }
  });

  const watchedValues = watch();

  // Calculate price when destination or vehicle type changes
  React.useEffect(() => {
    const calculatePricing = async () => {
      if (watchedValues.destination && watchedValues.vehicleType) {
        setIsCalculatingPrice(true);
        try {
          const distance = await googleMapsService.getDistanceFromAirport(watchedValues.destination);
          const basePrice = calculatePrice(distance, watchedValues.vehicleType);
          const additionalServicesCost = (watchedValues.additionalServices || []).reduce((total, serviceId) => {
            const servicePrices: Record<string, number> = {
              'baby-seat': 10,
              'booster-seat': 8,
              'meet-greet': 15,
              'extra-stop': 20,
              'waiting-time': 25,
              'premium-water': 5
            };
            return total + (servicePrices[serviceId] || 0);
          }, 0);

          const totalPrice = basePrice + additionalServicesCost;

          setPriceCalculation({
            distance,
            vehicleType: watchedValues.vehicleType,
            basePrice,
            additionalServicesCost,
            totalPrice
          });
        } catch (error) {
          console.error('Error calculating price:', error);
        } finally {
          setIsCalculatingPrice(false);
        }
      }
    };

    calculatePricing();
  }, [watchedValues.destination, watchedValues.vehicleType, watchedValues.additionalServices]);

  const onSubmit = async (data: BookingFormData) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Show payment gateway
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    try {
      const reservationData = {
        ...watchedValues,
        distance: priceCalculation?.distance || 0,
        totalPrice: priceCalculation?.totalPrice || 0,
        paymentResult
      };

      const reservationId = await createNewReservation(reservationData);
      
      if (reservationId) {
        toast.success('Rezervasyon başarıyla oluşturuldu!');
        navigate(`/payment/success?transaction_id=${paymentResult.transactionId}&order_id=${reservationId}`);
      }
    } catch (error) {
      toast.error('Rezervasyon oluşturulurken hata oluştu');
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
    setShowPayment(false);
  };

  const steps = [
    { number: 1, title: 'Transfer Detayları', icon: MapPin },
    { number: 2, title: 'Araç Seçimi', icon: Users },
    { number: 3, title: 'Kişisel Bilgiler', icon: Users },
    { number: 4, title: 'Onay & Ödeme', icon: CheckCircle }
  ];

  if (showPayment && priceCalculation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <PaymentGateway
                amount={priceCalculation.totalPrice}
                currency="USD"
                orderId={`RES-${Date.now()}`}
                customerInfo={{
                  name: `${watchedValues.customerInfo?.firstName} ${watchedValues.customerInfo?.lastName}`,
                  email: watchedValues.customerInfo?.email || '',
                  phone: watchedValues.customerInfo?.phone || ''
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transfer Rezervasyonu
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Antalya Havalimanı transfer hizmetinizi kolayca rezerve edin
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      Adım {step.number}
                    </p>
                    <p className={`text-sm ${
                      currentStep >= step.number ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-24 h-0.5 ml-6 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Step 1: Transfer Details */}
                  {currentStep === 1 && (
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Transfer Detayları</h2>
                      
                      <div className="space-y-6">
                        {/* Transfer Type */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Transfer Türü</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="relative">
                              <input
                                type="radio"
                                {...register('transferType')}
                                value="airport-hotel"
                                className="sr-only"
                              />
                              <div className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                watchedValues.transferType === 'airport-hotel'
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}>
                                <div className="text-center">
                                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                  <h3 className="font-bold text-gray-800 mb-2">Havalimanı → Otel</h3>
                                  <p className="text-sm text-gray-600">Antalya Havalimanı'ndan otel/tatil beldesi</p>
                                </div>
                              </div>
                            </label>
                            
                            <label className="relative">
                              <input
                                type="radio"
                                {...register('transferType')}
                                value="hotel-airport"
                                className="sr-only"
                              />
                              <div className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                watchedValues.transferType === 'hotel-airport'
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}>
                                <div className="text-center">
                                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                  <h3 className="font-bold text-gray-800 mb-2">Otel → Havalimanı</h3>
                                  <p className="text-sm text-gray-600">Otel/tatil beldesinden Antalya Havalimanı</p>
                                </div>
                              </div>
                            </label>
                          </div>
                          {errors.transferType && (
                            <p className="mt-2 text-sm text-red-600">{errors.transferType.message}</p>
                          )}
                        </div>

                        {/* Destination */}
                        <LocationSearch
                          value={watchedValues.destination || ''}
                          onChange={(value) => setValue('destination', value)}
                          label={watchedValues.transferType === 'airport-hotel' ? 'Varış Noktası (Otel/Bölge)' : 'Kalkış Noktası (Otel/Bölge)'}
                          placeholder="Otel adı veya bölge girin (örn: Kemer, Belek, Side)"
                        />
                        {errors.destination && (
                          <p className="mt-2 text-sm text-red-600">{errors.destination.message}</p>
                        )}

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              <Calendar className="h-4 w-4 inline mr-2 text-blue-600" />
                              Transfer Tarihi
                            </label>
                            <input
                              type="date"
                              {...register('pickupDate')}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                            {errors.pickupDate && (
                              <p className="mt-2 text-sm text-red-600">{errors.pickupDate.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              <Clock className="h-4 w-4 inline mr-2 text-blue-600" />
                              Transfer Saati
                            </label>
                            <select
                              {...register('pickupTime')}
                              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                            >
                              <option value="">Saat seçin</option>
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = i.toString().padStart(2, '0');
                                return (
                                  <option key={hour} value={`${hour}:00`}>{hour}:00</option>
                                );
                              })}
                            </select>
                            {errors.pickupTime && (
                              <p className="mt-2 text-sm text-red-600">{errors.pickupTime.message}</p>
                            )}
                          </div>
                        </div>

                        {/* Passenger and Baggage Count */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              <Users className="h-4 w-4 inline mr-2 text-blue-600" />
                              Yolcu Sayısı
                            </label>
                            <select
                              {...register('passengerCount', { valueAsNumber: true })}
                              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                            >
                              {[1,2,3,4,5,6,7,8].map(num => (
                                <option key={num} value={num}>{num} Kişi</option>
                              ))}
                            </select>
                            {errors.passengerCount && (
                              <p className="mt-2 text-sm text-red-600">{errors.passengerCount.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              <Luggage className="h-4 w-4 inline mr-2 text-blue-600" />
                              Bagaj Sayısı
                            </label>
                            <select
                              {...register('baggageCount', { valueAsNumber: true })}
                              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                            >
                              {[0,1,2,3,4,5,6,7,8].map(num => (
                                <option key={num} value={num}>{num} Bagaj</option>
                              ))}
                            </select>
                            {errors.baggageCount && (
                              <p className="mt-2 text-sm text-red-600">{errors.baggageCount.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Vehicle Selection */}
                  {currentStep === 2 && (
                    <VehicleSelection
                      selectedVehicle={watchedValues.vehicleType || ''}
                      onVehicleSelect={(vehicleType) => setValue('vehicleType', vehicleType)}
                      passengerCount={watchedValues.passengerCount || 1}
                      baggageCount={watchedValues.baggageCount || 0}
                      priceCalculation={priceCalculation}
                      isCalculatingPrice={isCalculatingPrice}
                    />
                  )}

                  {/* Step 3: Customer Info */}
                  {currentStep === 3 && (
                    <CustomerInfoForm
                      register={register}
                      errors={errors}
                      setValue={setValue}
                      additionalServices={watchedValues.additionalServices || []}
                    />
                  )}

                  {/* Step 4: Confirmation */}
                  {currentStep === 4 && (
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Rezervasyon Onayı</h2>
                      
                      <div className="space-y-6">
                        {/* Transfer Summary */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <h3 className="font-bold text-gray-800 mb-4">Transfer Özeti</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Transfer Türü</p>
                              <p className="font-semibold">
                                {watchedValues.transferType === 'airport-hotel' ? 'Havalimanı → Otel' : 'Otel → Havalimanı'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Varış Noktası</p>
                              <p className="font-semibold">{watchedValues.destination}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Tarih & Saat</p>
                              <p className="font-semibold">{watchedValues.pickupDate} - {watchedValues.pickupTime}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Yolcu & Bagaj</p>
                              <p className="font-semibold">{watchedValues.passengerCount} kişi, {watchedValues.baggageCount} bagaj</p>
                            </div>
                          </div>
                        </div>

                        {/* Customer Summary */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <h3 className="font-bold text-gray-800 mb-4">Müşteri Bilgileri</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Ad Soyad</p>
                              <p className="font-semibold">
                                {watchedValues.customerInfo?.firstName} {watchedValues.customerInfo?.lastName}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">E-posta</p>
                              <p className="font-semibold">{watchedValues.customerInfo?.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Telefon</p>
                              <p className="font-semibold">{watchedValues.customerInfo?.phone}</p>
                            </div>
                          </div>
                        </div>

                        {/* Terms */}
                        <div className="bg-blue-50 rounded-2xl p-6">
                          <h3 className="font-bold text-blue-800 mb-4">Önemli Bilgiler</h3>
                          <ul className="text-sm text-blue-700 space-y-2">
                            <li>• Transfer saatinden 15 dakika önce hazır olunuz</li>
                            <li>• Şoförünüz size WhatsApp ile ulaşacaktır</li>
                            <li>• QR kodunuzu şoföre göstermeyi unutmayınız</li>
                            <li>• İptal işlemleri transfer saatinden 24 saat önce yapılmalıdır</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Geri
                      </button>
                    )}
                    
                    <button
                      type="submit"
                      className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                    >
                      <span>{currentStep === 4 ? 'Ödemeye Geç' : 'Devam Et'}</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Price Display */}
                  {priceCalculation && (
                    <PriceDisplay priceCalculation={priceCalculation} />
                  )}

                  {/* Route Map */}
                  {watchedValues.destination && (
                    <RouteMap
                      origin={watchedValues.transferType === 'airport-hotel' ? ANTALYA_AIRPORT : watchedValues.destination}
                      destination={watchedValues.transferType === 'airport-hotel' ? watchedValues.destination : ANTALYA_AIRPORT}
                      onRouteCalculated={(distance, duration) => {
                        // Route calculated callback
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}