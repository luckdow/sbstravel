import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSearchParams } from 'react-router-dom';
import { LocationData } from '../types';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { googleMapsService } from '../lib/google-maps';
import { calculateTotalPrice } from '../lib/utils/pricing';
import { ANTALYA_AIRPORT } from '../config/google-maps';

import Header from '../components/Layout/Header';
import Footer from '../components/Footer';
import LocationSearch from '../components/Booking/LocationSearch';
import VehicleSelection from '../components/Booking/VehicleSelection';
import CustomerInfoForm from '../components/Booking/CustomerInfoForm';
import PaymentGateway from '../components/Payment/PaymentGateway';
import RouteMap from '../components/Booking/RouteMap';

import { MapPin, Calendar, Clock, Users, Luggage, ArrowRight, CheckCircle, Car, DollarSign, Loader2 } from 'lucide-react';

// Form validation schema
const bookingSchema = yup.object({
  transferType: yup.string().required('Transfer türü seçiniz'),
  vehicleType: yup.string().required('Araç tipi seçiniz'),
  destination: yup.object({
    name: yup.string().required('Varış noktası gereklidir'),
    lat: yup.number().required(),
    lng: yup.number().required()
  }).required('Varış noktası gereklidir'),
  pickupDate: yup.string().required('Transfer tarihi gereklidir'),
  pickupTime: yup.string().required('Transfer saati gereklidir'),
  passengerCount: yup.number().min(1, 'En az 1 yolcu').required('Yolcu sayısı gereklidir'),
  baggageCount: yup.number().min(0, 'Bagaj sayısı 0 veya daha fazla olmalı').required('Bagaj sayısı gereklidir'),
  customerInfo: yup.object({
    firstName: yup.string().required('Ad gereklidir'),
    lastName: yup.string().required('Soyad gereklidir'),
    email: yup.string().email('Geçerli e-posta adresi girin').required('E-posta gereklidir'),
    phone: yup.string().required('Telefon numarası gereklidir')
  })
});

type BookingFormData = yup.InferType<typeof bookingSchema>;

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [isChangingStep, setIsChangingStep] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  
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
      vehicleType: 'standard',
      destination: searchParams.get('destination') ? {
        name: searchParams.get('destination') || '',
        lat: 0,
        lng: 0
      } : null,
      passengerCount: 2,
      baggageCount: 2,
      additionalServices: [],
      pickupDate: searchParams.get('date') || '',
      pickupTime: searchParams.get('time') || ''
    }
  });

  const watchedValues = watch();

  // Debug: Track currentStep changes
  useEffect(() => {
    console.log('🔄 Current step changed to:', currentStep);
  }, [currentStep]);

  // Calculate price when destination or vehicle type changes
  useEffect(() => {
    const calculatePricing = async () => {
      if (watchedValues.destination && watchedValues.destination.lat !== 0 && watchedValues.vehicleType) {
        console.log('💰 Calculating price...');
        console.log('📍 Destination:', watchedValues.destination);
        console.log('🚗 Vehicle:', watchedValues.vehicleType);
        setIsCalculatingPrice(true);
        try {
          const calculatedDistance = await googleMapsService.getDistanceFromAirport(watchedValues.destination);
          const price = calculateTotalPrice(calculatedDistance, watchedValues.vehicleType, []);
          
          console.log('📏 Calculated distance:', calculatedDistance);
          console.log('💰 Calculated price:', price);
          
          setDistance(calculatedDistance);
          setTotalPrice(price);
          setShowPriceDetails(true);
        } catch (error) {
          console.error('Error calculating price:', error);
          toast.error('Fiyat hesaplanırken hata oluştu');
        } finally {
          setIsCalculatingPrice(false);
        }
      } else {
        console.log('❌ Price calculation skipped - missing data');
        setShowPriceDetails(false);
      }
    };

    calculatePricing();
  }, [watchedValues.destination, watchedValues.vehicleType]);

  // Consolidated validation function for step 1
  const validateStep1 = () => {
    console.log('🔍 STEP 1 VALIDATION STARTING...');
    console.log('📍 Destination:', watchedValues.destination);
    console.log('🚗 Vehicle type:', watchedValues.vehicleType);
    console.log('📅 Date:', watchedValues.pickupDate);
    console.log('⏰ Time:', watchedValues.pickupTime);
    console.log('💰 Total price:', totalPrice);
    
    // Destination validation
    if (!watchedValues.destination?.name) {
      console.log('❌ VALIDATION FAILED: No destination name');
      toast.error('Lütfen varış noktasını seçin');
      return false;
    }
    
    if (watchedValues.destination.lat === 0) {
      console.log('❌ VALIDATION FAILED: Destination lat is 0');
      toast.error('Lütfen geçerli bir varış noktası seçin');
      return false;
    }
    
    // Vehicle type validation
    if (!watchedValues.vehicleType) {
      console.log('❌ VALIDATION FAILED: No vehicle type');
      toast.error('Lütfen araç tipini seçin');
      return false;
    }
    
    // Date validation
    if (!watchedValues.pickupDate) {
      console.log('❌ VALIDATION FAILED: No pickup date');
      toast.error('Lütfen transfer tarihini seçin');
      return false;
    }
    
    // Time validation
    if (!watchedValues.pickupTime) {
      console.log('❌ VALIDATION FAILED: No pickup time');
      toast.error('Lütfen transfer saatini seçin');
      return false;
    }
    
    // Price validation
    if (totalPrice === 0 || isCalculatingPrice) {
      console.log('❌ VALIDATION FAILED: Price not ready', { totalPrice, isCalculatingPrice });
      toast.error('Fiyat hesaplanıyor, lütfen bekleyin');
      return false;
    }
    
    console.log('✅ ALL STEP 1 VALIDATIONS PASSED!');
    return true;
  };

  // Consolidated validation function for step 2
  const validateStep2 = () => {
    console.log('🔍 STEP 2 VALIDATION STARTING...');
    console.log('👤 Customer info:', watchedValues.customerInfo);
    
    if (!watchedValues.customerInfo?.firstName || 
        !watchedValues.customerInfo?.lastName || 
        !watchedValues.customerInfo?.email || 
        !watchedValues.customerInfo?.phone) {
      console.log('❌ VALIDATION FAILED: Missing customer info fields');
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return false;
    }
    
    console.log('✅ ALL STEP 2 VALIDATIONS PASSED!');
    return true;
  };

  // Handle step navigation
  const handleNextStep = async () => {
    console.log('🚀 HANDLE NEXT STEP - Current step:', currentStep);
    
    if (isChangingStep) {
      console.log('⏳ Step change already in progress, ignoring...');
      return;
    }
    
    setIsChangingStep(true);
    
    try {
      if (currentStep === 1) {
        if (validateStep1()) {
          console.log('🎯 MOVING TO STEP 2...');
          setCurrentStep(2);
          toast.success('Adım 1 tamamlandı!');
          return;
        }
      }
      
      if (currentStep === 2) {
        if (validateStep2()) {
          console.log('🎯 MOVING TO STEP 3...');
          setCurrentStep(3);
          toast.success('Adım 2 tamamlandı!');
          return;
        }
      }
      
      if (currentStep === 3) {
        // Create reservation
        console.log('🎯 CREATING RESERVATION...');
        await handleSubmit(onSubmit)();
      }
    } catch (error) {
      console.error('Error in handleNextStep:', error);
      toast.error('Bir hata oluştu, lütfen tekrar deneyin');
    } finally {
      setIsChangingStep(false);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    console.log('🚀 FINAL FORM SUBMISSION - Creating reservation');
    console.log('📋 Form data received:', data);
    
    try {
      const reservationData = {
        ...watchedValues,
        distance,
        totalPrice
      };

      const reservationId = await createNewReservation(reservationData);
      
      if (reservationId) {
        toast.success('Rezervasyon başarıyla oluşturuldu!');
        // Redirect to success page with reservation data
        navigate(`/payment/success?order_id=${reservationId}&amount=${totalPrice}&customer=${encodeURIComponent(watchedValues.customerInfo?.firstName + ' ' + watchedValues.customerInfo?.lastName)}`);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Rezervasyon oluşturulurken hata oluştu');
    }
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    try {
      const reservationData = {
        ...watchedValues,
        distance,
        totalPrice,
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
    { number: 1, title: 'Transfer & Araç Seçimi', icon: Car },
    { number: 2, title: 'Kişisel Bilgiler', icon: Users },
    { number: 3, title: 'Onay & Ödeme', icon: CheckCircle }
  ];

  const vehicleOptions = [
    {
      type: 'standard',
      name: 'Standart Transfer',
      description: 'Ekonomik ve konforlu',
      capacity: '1-4 kişi',
      features: ['Klima', 'Müzik Sistemi', 'Temiz Araç'],
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      type: 'premium',
      name: 'Premium Transfer',
      description: 'Konfor ve kalite',
      capacity: '1-8 kişi',
      features: ['Premium İç Mekan', 'Wi-Fi', 'Su İkramı'],
      image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      type: 'luxury',
      name: 'Lüks & VIP Transfer',
      description: 'En üst düzey konfor',
      capacity: '1-6 kişi',
      features: ['Lüks Deri Döşeme', 'VIP Karşılama', 'Soğuk İçecek'],
      image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  if (showPayment && totalPrice > 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <PaymentGateway
                amount={totalPrice}
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
          <div className="text-center mb-8">
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
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-2 hidden md:block">
                    <p className={`text-xs font-medium ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-16 h-0.5 ml-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-4xl mx-auto">
              {/* Step 1: Transfer Details & Vehicle Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Transfer Detayları</h2>
                    
                    <div className="space-y-6">
                      {/* Transfer Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Transfer Türü</label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="relative">
                            <input
                              type="radio"
                              {...register('transferType')}
                              value="airport-hotel"
                              className="sr-only"
                            />
                            <div className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 text-center ${
                              watchedValues.transferType === 'airport-hotel'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}>
                              <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                              <h3 className="font-semibold text-gray-800 text-sm mb-1">Havalimanı → Otel</h3>
                              <p className="text-xs text-gray-600">AYT'den varış noktası</p>
                            </div>
                          </label>
                          
                          <label className="relative">
                            <input
                              type="radio"
                              {...register('transferType')}
                              value="hotel-airport"
                              className="sr-only"
                            />
                            <div className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 text-center ${
                              watchedValues.transferType === 'hotel-airport'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}>
                              <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                              <h3 className="font-semibold text-gray-800 text-sm mb-1">Otel → Havalimanı</h3>
                              <p className="text-xs text-gray-600">AYT'ye transfer</p>
                            </div>
                          </label>
                        </div>
                        {errors.transferType && (
                          <p className="mt-2 text-sm text-red-600">{errors.transferType.message}</p>
                        )}
                      </div>

                      {/* Vehicle Type Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Araç Tipi Seçimi</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {vehicleOptions.map((vehicle) => (
                            <label key={vehicle.type} className="relative">
                              <input
                                type="radio"
                                {...register('vehicleType')}
                                value={vehicle.type}
                                className="sr-only"
                              />
                              <div className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                watchedValues.vehicleType === vehicle.type
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}>
                                <img 
                                  src={vehicle.image} 
                                  alt={vehicle.name}
                                  className="w-full h-32 object-cover rounded-xl mb-3"
                                />
                                <h3 className="font-bold text-gray-800 mb-1">{vehicle.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{vehicle.description}</p>
                                <p className="text-xs text-blue-600 font-medium mb-2">{vehicle.capacity}</p>
                                <div className="flex flex-wrap gap-1">
                                  {vehicle.features.map((feature, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.vehicleType && (
                          <p className="mt-2 text-sm text-red-600">{errors.vehicleType.message}</p>
                        )}
                      </div>

                      {/* Destination */}
                      <LocationSearch
                        value={watchedValues.destination}
                        onChange={(value) => setValue('destination', value)}
                        label={watchedValues.transferType === 'airport-hotel' ? 'Varış Noktası (Otel/Bölge)' : 'Kalkış Noktası (Otel/Bölge)'}
                        placeholder="Otel adı veya bölge girin (örn: Kemer, Belek, Side)"
                      />
                      {errors.destination && (
                        <p className="mt-2 text-sm text-red-600">{errors.destination.message}</p>
                      )}

                      {/* Date, Time, Passengers */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Calendar className="h-4 w-4 inline mr-1 text-blue-600" />
                            Tarih
                          </label>
                          <input
                            type="date"
                            {...register('pickupDate')}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          />
                          {errors.pickupDate && (
                            <p className="mt-1 text-xs text-red-600">{errors.pickupDate.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Clock className="h-4 w-4 inline mr-1 text-blue-600" />
                            Saat
                          </label>
                          <select
                            {...register('pickupTime')}
                            className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
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
                            <p className="mt-1 text-xs text-red-600">{errors.pickupTime.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Users className="h-4 w-4 inline mr-1 text-blue-600" />
                            Yolcu
                          </label>
                          <select
                            {...register('passengerCount', { valueAsNumber: true })}
                            className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                          >
                            {[1,2,3,4,5,6,7,8].map(num => (
                              <option key={num} value={num}>{num} Kişi</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Luggage className="h-4 w-4 inline mr-1 text-blue-600" />
                            Bagaj
                          </label>
                          <select
                            {...register('baggageCount', { valueAsNumber: true })}
                            className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                          >
                            {[0,1,2,3,4,5,6,7,8].map(num => (
                              <option key={num} value={num}>{num} Bagaj</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Map Section */}
                  {showPriceDetails && (
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Price Display */}
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                            Fiyat Bilgileri
                          </h3>
                          
                          {isCalculatingPrice ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                              <span className="text-gray-600">Fiyat hesaplanıyor...</span>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 text-center">
                                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                  ${totalPrice.toFixed(2)}
                                </div>
                                <div className="text-gray-600">Toplam Transfer Ücreti</div>
                                <div className="text-sm text-gray-500 mt-2">
                                  {distance.toFixed(1)} km mesafe
                                </div>
                              </div>
                              
                              <div className="bg-green-50 rounded-xl p-4">
                                <h4 className="font-semibold text-green-800 mb-2">Fiyata Dahil Olanlar:</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                                  <div>✓ Yakıt</div>
                                  <div>✓ Sigorta</div>
                                  <div>✓ Profesyonel Şoför</div>
                                  <div>✓ 7/24 Destek</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Route Map */}
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                            Transfer Güzergahı
                          </h3>
                          <RouteMap
                            origin={watchedValues.transferType === 'airport-hotel' ? ANTALYA_AIRPORT : watchedValues.destination}
                            destination={watchedValues.transferType === 'airport-hotel' ? watchedValues.destination : ANTALYA_AIRPORT}
                            onRouteCalculated={(distance, duration) => {
                              // Route calculated callback
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Customer Info */}
              {currentStep === 2 && (
                <CustomerInfoForm
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  additionalServices={watchedValues.additionalServices || []}
                />
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
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
                          <p className="text-sm text-gray-600">Araç Tipi</p>
                          <p className="font-semibold capitalize">{watchedValues.vehicleType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Varış Noktası</p>
                          <p className="font-semibold">{watchedValues.destination?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tarih & Saat</p>
                          <p className="font-semibold">{watchedValues.pickupDate} - {watchedValues.pickupTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Yolcu & Bagaj</p>
                          <p className="font-semibold">{watchedValues.passengerCount} kişi, {watchedValues.baggageCount} bagaj</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Toplam Tutar</p>
                          <p className="font-bold text-green-600 text-lg">${totalPrice.toFixed(2)}</p>
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
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Geri
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isCalculatingPrice || isChangingStep || (currentStep === 1 && totalPrice === 0)}
                  className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(isCalculatingPrice || isChangingStep) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span>
                    {isCalculatingPrice ? 'Hesaplanıyor...' : 
                     isChangingStep ? 'İşleniyor...' :
                     currentStep === 3 ? 'Rezervasyonu Tamamla' : 'Devam Et'}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}