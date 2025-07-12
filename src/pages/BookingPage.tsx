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
import { CreditCard, Shield } from 'lucide-react';

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
  const [showPayment, setShowPayment] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  
  const navigate = useNavigate();
  const { createNewReservation, vehicles, extraServices, fetchVehicles, fetchExtraServices, loading } = useStore();
  
  // Fetch vehicles and extra services when component mounts
  useEffect(() => {
    fetchVehicles();
    fetchExtraServices();
  }, [fetchVehicles, fetchExtraServices]);

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

  // Calculate price when destination or vehicle type changes
  useEffect(() => {
    const calculatePricing = async () => {
      if (watchedValues.destination && watchedValues.destination.name && watchedValues.vehicleType) {
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

  const onSubmit = async (data: BookingFormData) => {
    console.log('🚀 FORM SUBMITTED - START');
    console.log('📍 Current step:', currentStep);
    console.log('📋 Form data received:', data);
    console.log('👀 Watched values:', watchedValues);
    console.log('🎯 Destination object:', watchedValues.destination);
    console.log('🚗 Vehicle type:', watchedValues.vehicleType);
    console.log('💰 Total price:', totalPrice);
    console.log('📏 Distance:', distance);
    console.log('✈️ Flight number:', watchedValues.flightNumber);
    
    try {
      if (currentStep === 1) {
        console.log('🔍 STEP 1 VALIDATION STARTING...');
        
        // Destination check
        if (!watchedValues.destination) {
          console.log('❌ VALIDATION FAILED: No destination object');
          toast.error('Lütfen varış noktasını seçin');
          return;
        }
        
        if (!watchedValues.destination.name) {
          console.log('❌ VALIDATION FAILED: No destination name');
          toast.error('Lütfen varış noktasını seçin');
          return;
        }
        
        if (watchedValues.destination.lat === 0) {
          console.log('❌ VALIDATION FAILED: Destination lat is 0');
          toast.error('Lütfen geçerli bir varış noktası seçin');
          return;
        }
        
        // Vehicle type check
        if (!watchedValues.vehicleType) {
          console.log('❌ VALIDATION FAILED: No vehicle type');
          toast.error('Lütfen araç tipini seçin');
          return;
        }
        
        // Date check
        if (!watchedValues.pickupDate) {
          console.log('❌ VALIDATION FAILED: No pickup date');
          toast.error('Lütfen transfer tarihini seçin');
          return;
        }
        
        // Time check
        if (!watchedValues.pickupTime) {
          console.log('❌ VALIDATION FAILED: No pickup time');
          toast.error('Lütfen transfer saatini seçin');
          return;
        }
        
        // Price check
        if (totalPrice === 0) {
          console.log('❌ VALIDATION FAILED: Total price is 0');
          toast.error('Fiyat hesaplanıyor, lütfen bekleyin');
          return;
        }
        
        console.log('✅ ALL VALIDATIONS PASSED!');
        console.log('🎯 MOVING TO STEP 2...');
        console.log('📍 Current step before update:', currentStep);
        setCurrentStep(2);
        console.log('📍 STEP UPDATED TO 2 - SUCCESS!');
        return;
      }
      
      if (currentStep === 2) {
        // Step 2: Validate customer info
        console.log('Validating step 2...');
        console.log('Customer info:', watchedValues.customerInfo);
        
        if (!watchedValues.customerInfo?.firstName || !watchedValues.customerInfo?.lastName || 
            !watchedValues.customerInfo?.email || !watchedValues.customerInfo?.phone) {
          toast.error('Lütfen tüm zorunlu alanları doldurun');
          return;
        }
        
        console.log('Step 2 validation passed, moving to step 3');
        setCurrentStep(3);
        return;
      }

      // Step 3: Create reservation and show success
      if (currentStep === 3) {
        console.log('Creating reservation...');
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

  const handlePayTRPayment = async () => {
    try {
      setIsCalculatingPrice(true);
      console.log('Payment initiated');
      
      // Create reservation first
      const reservationData = {
        ...watchedValues,
        distance,
        totalPrice: totalPrice * 1.18, // Include tax
        flightNumber: watchedValues.flightNumber || ''
      };

      const reservationId = await createNewReservation(reservationData);
      
      if (reservationId) {
        console.log('Reservation created:', reservationId);
        // Send booking confirmation notification
        try {
          const notificationData = {
            customerName: `${watchedValues.customerInfo?.firstName} ${watchedValues.customerInfo?.lastName}`,
            customerEmail: watchedValues.customerInfo?.email || '',
            customerPhone: watchedValues.customerInfo?.phone || '',
            bookingId: reservationId,
            transferType: watchedValues.transferType === 'airport-hotel' ? 'Havalimanı → Otel' : 'Otel → Havalimanı',
            pickupLocation: watchedValues.transferType === 'airport-hotel' ? 'Antalya Havalimanı' : watchedValues.destination?.name || '',
            dropoffLocation: watchedValues.transferType === 'airport-hotel' ? watchedValues.destination?.name || '' : 'Antalya Havalimanı',
            pickupDate: watchedValues.pickupDate || '',
            pickupTime: watchedValues.pickupTime || '',
            passengerCount: watchedValues.passengerCount?.toString() || '1',
            vehicleType: watchedValues.vehicleType || 'standard',
            totalPrice: (totalPrice * 1.18).toFixed(2),
            qrCode: `SBS-QR-${reservationId}`
          };

          const notificationResult = await notificationService.sendBookingConfirmation(
            'temp-customer-id', // In real app, this would be the actual customer ID
            reservationId,
            notificationData as any
          );

          if (notificationResult.success) {
            console.log('📧 Booking confirmation notifications sent successfully');
          } else {
            console.error('📧 Failed to send notifications:', notificationResult.errors);
          }
        } catch (notificationError) {
          console.error('📧 Notification error:', notificationError);
          // Don't fail the whole booking process if notifications fail
        }

        // Simulate PayTR payment process
        toast.success('Rezervasyon oluşturuldu! Ödeme sayfasına yönlendiriliyorsunuz...');
        
        // Simulate payment processing
        setTimeout(async () => {
          toast.success('Ödeme başarılı! Rezervasyonunuz onaylandı.');
          
          // Send payment success notification
          try {
            const paymentData = {
              customerName: `${watchedValues.customerInfo?.firstName} ${watchedValues.customerInfo?.lastName}`,
              customerEmail: watchedValues.customerInfo?.email || '',
              customerPhone: watchedValues.customerInfo?.phone || '',
              bookingId: reservationId,
              paymentId: `PAY-${Date.now()}`,
              amount: (totalPrice * 1.18).toFixed(2),
              paymentDate: new Date().toLocaleDateString('tr-TR')
            };

            await notificationService.sendPaymentSuccess(
              'temp-customer-id',
              reservationId,
              paymentData as any
            );
          } catch (paymentNotificationError) {
            console.error('📧 Payment notification error:', paymentNotificationError);
          }

          navigate(`/payment/success?order_id=${reservationId}&amount=${(totalPrice * 1.18).toFixed(2)}&customer=${encodeURIComponent(watchedValues.customerInfo?.firstName + ' ' + watchedValues.customerInfo?.lastName)}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Ödeme işlemi sırasında hata oluştu');
    } finally {
      setIsCalculatingPrice(false);
    }
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
                          {vehicles && vehicles.length > 0 ? vehicles.map((vehicle) => (
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
                          )) : vehicleOptions.map((vehicle) => (
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
                <PaymentSection
                  priceCalculation={priceCalculation}
                  bookingData={watchedValues}
                  onPaymentSuccess={(transactionId) => {
                    console.log('Payment successful, transaction ID:', transactionId);
                    // Navigate to success page
                  }}
                />
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
                  onClick={() => {
                    console.log('🚀 DIRECT BUTTON CLICK - BYPASSING FORM');
                    console.log('📍 Current step before:', currentStep);
                    
                    if (currentStep === 1) {
                      // Step 1 validation
                      if (!watchedValues.destination?.name) {
                        toast.error('Lütfen varış noktasını seçin');
                        return;
                      }
                      if (!watchedValues.vehicleType) {
                        toast.error('Lütfen araç tipini seçin');
                        return;
                      }
                      if (!watchedValues.pickupDate) {
                        toast.error('Lütfen transfer tarihini seçin');
                        return;
                      }
                      if (!watchedValues.pickupTime) {
                        toast.error('Lütfen transfer saatini seçin');
                        return;
                      }
                      if (totalPrice === 0) {
                        toast.error('Fiyat hesaplanıyor, lütfen bekleyin');
                        return;
                      }
                      
                      console.log('✅ Step 1 validation passed, moving to step 2');
                      setCurrentStep(2);
                      console.log('📍 Step updated to:', 2);
                      return;
                    }
                    
                    if (currentStep === 2) {
                      // Step 2 validation
                      if (!watchedValues.customerInfo?.firstName || !watchedValues.customerInfo?.lastName || 
                          !watchedValues.customerInfo?.email || !watchedValues.customerInfo?.phone) {
                        toast.error('Lütfen tüm zorunlu alanları doldurun');
                        return;
                      }
                      
                      console.log('✅ Step 2 validation passed, moving to step 3');
                      setCurrentStep(3);
                      console.log('📍 Step updated to:', 3);
                      return;
                    }
                    
                    if (currentStep === 3) {
                      // PayTR Payment Process
                      handlePayTRPayment();
                    }
                  }}
                  disabled={isCalculatingPrice || (currentStep === 1 && totalPrice === 0)}
                  className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {isCalculatingPrice ? 'İşleniyor...' : 
                     currentStep === 3 ? 'Ödeme Yap & Rezervasyonu Tamamla' : 'Devam Et'}
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