import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { ArrowRight, Plane, Users, Calendar, Clock, MapPin, Car, CreditCard, Building2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocationSearch from '../components/Booking/LocationSearch';
import VehicleSelection from '../components/Booking/VehicleSelection';
import CustomerInfoForm from '../components/Booking/CustomerInfoForm';
import PaymentSection from '../components/Payment/PaymentSection';
import RouteMap from '../components/Booking/RouteMap';
import { useStore } from '../store/useStore';
import { calculatePrice } from '../utils/pricing';
import { generateQRCode } from '../utils/qrCode';

const bookingSchema = z.object({
  transferType: z.enum(['airport-hotel', 'hotel-airport']),
  destination: z.object({
    name: z.string(),
    type: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  }),
  vehicleType: z.string().min(1, 'Araç tipi seçiniz'),
  pickupDate: z.string().min(1, 'Tarih seçiniz'),
  pickupTime: z.string().min(1, 'Saat seçiniz'),
  passengerCount: z.number().min(1).max(8),
  luggageCount: z.number().min(0).max(10),
  customerInfo: z.object({
    firstName: z.string().min(2, 'Ad en az 2 karakter olmalı'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
    email: z.string().email('Geçerli email adresi girin'),
    phone: z.string().min(10, 'Geçerli telefon numarası girin'),
    flightNumber: z.string().optional(),
    specialRequests: z.string().optional()
  }),
  extraServices: z.array(z.string()).default([]),
  paymentMethod: z.enum(['credit-card', 'bank-transfer'])
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [priceCalculation, setPriceCalculation] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  
  const { vehicles, extraServices, settings, createNewReservation, addCustomer, fetchVehicles, fetchExtraServices } = useStore();

  // Fetch vehicles and extra services when component mounts
  useEffect(() => {
    // Initialize demo data first, then try to fetch from Firestore
    const { initializeMockData } = useStore.getState();
    initializeMockData();
    
    fetchVehicles();
    fetchExtraServices();
  }, [fetchVehicles, fetchExtraServices]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      transferType: 'airport-hotel',
      passengerCount: 1,
      luggageCount: 1,
      extraServices: [],
      paymentMethod: 'credit-card'
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    const calculatePricing = async () => {
      if (watchedValues.destination?.name && watchedValues.vehicleType && 
          watchedValues.pickupDate && watchedValues.pickupTime) {
        setIsCalculatingPrice(true);
        
        try {
          const calculation = await calculatePrice({
            destination: watchedValues.destination.name,
            vehicleType: watchedValues.vehicleType,
            passengerCount: watchedValues.passengerCount,
            luggageCount: watchedValues.luggageCount,
            extraServices: watchedValues.extraServices || [],
            transferType: watchedValues.transferType
          });
          
          setPriceCalculation(calculation);
          setTotalPrice(calculation.total);
        } catch (error) {
          console.error('Fiyat hesaplama hatası:', error);
          toast.error('Fiyat hesaplanırken hata oluştu');
        } finally {
          setIsCalculatingPrice(false);
        }
      }
    };

    calculatePricing();
  }, [
    watchedValues.destination,
    watchedValues.vehicleType,
    watchedValues.passengerCount,
    watchedValues.luggageCount,
    watchedValues.extraServices,
    watchedValues.transferType
  ]);

  const handlePayTRPayment = async () => {
    try {
      toast.success('Test modunda rezervasyon oluşturuldu!');
      console.log('Rezervasyon verileri:', watchedValues);
    } catch (error) {
      toast.error('Ödeme sırasında hata oluştu');
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    console.log('onSubmit called with data:', data);
    setIsSubmitting(true);
    
    try {
      // Generate QR code for the reservation
      const qrCode = generateQRCode();
      
      // Create customer record first
      console.log('Creating customer record...');
      const customerId = await addCustomer({
        firstName: data.customerInfo.firstName,
        lastName: data.customerInfo.lastName,
        email: data.customerInfo.email,
        phone: data.customerInfo.phone
      });

      if (!customerId) {
        throw new Error('Müşteri kaydı oluşturulamadı');
      }

      console.log('Customer created successfully:', customerId);

      // Prepare reservation data
      const reservationData = {
        ...data,
        customerId,
        customerName: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
        customerEmail: data.customerInfo.email,
        customerPhone: data.customerInfo.phone,
        pickupLocation: data.transferType === 'airport-hotel' ? 'Antalya Havalimanı' : data.destination.name,
        dropoffLocation: data.transferType === 'airport-hotel' ? data.destination.name : 'Antalya Havalimanı',
        distance: priceCalculation?.distance || 0,
        basePrice: priceCalculation?.basePrice || 0,
        additionalServices: data.extraServices?.map(serviceId => {
          const service = extraServices.find(s => s.id === serviceId);
          return {
            id: serviceId,
            name: service?.name || '',
            price: service?.price || 0
          };
        }) || [],
        totalPrice: priceCalculation?.totalPrice || totalPrice,
        qrCode,
        paymentStatus: 'pending' as const,
        status: 'pending' as const
      };

      console.log('Creating reservation with data:', reservationData);

      // Create reservation
      const reservationId = await createNewReservation(reservationData);

      if (!reservationId) {
        throw new Error('Rezervasyon oluşturulamadı');
      }

      console.log('Reservation created successfully:', reservationId);

      // Store reservation ID and QR code for payment step
      setReservationId(reservationId);
      setQrCode(qrCode);

      // Show success message
      toast.success('Rezervasyon başarıyla oluşturuldu! Ödeme sayfasına yönlendiriliyorsunuz...');
      
      // Move to payment step
      console.log('Moving to payment step...');
      setCurrentStep(3);
      
    } catch (error) {
      console.error('Rezervasyon oluşturma hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Rezervasyon oluşturulurken hata oluştu';
      toast.error(errorMessage);
      // Don't change step on error, stay on current step
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Transfer Detayları'}
                    {step === 2 && 'Yolcu Bilgileri'}
                    {step === 3 && 'Ödeme'}
                  </span>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-4 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Step 1: Transfer Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Transfer Detayları</h2>
                  
                  {/* Transfer Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Transfer Tipi
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="relative">
                        <input
                          type="radio"
                          value="airport-hotel"
                          {...register('transferType')}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          watchedValues.transferType === 'airport-hotel'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <Plane className="h-6 w-6 text-blue-600" />
                            <div>
                              <div className="font-semibold">Havalimanı → Otel</div>
                              <div className="text-sm text-gray-500">Havalimanından otele transfer</div>
                            </div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="relative">
                        <input
                          type="radio"
                          value="hotel-airport"
                          {...register('transferType')}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          watchedValues.transferType === 'hotel-airport'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-6 w-6 text-blue-600" />
                            <div>
                              <div className="font-semibold">Otel → Havalimanı</div>
                              <div className="text-sm text-gray-500">Otelden havalimanına transfer</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Destination */}
                  <div>
                    <LocationSearch
                      value={watchedValues.destination}
                      onChange={(value) => setValue('destination', value)}
                      label={watchedValues.transferType === 'airport-hotel' ? 'Varış Noktası (Otel/Bölge)' : 'Kalkış Noktası (Otel/Bölge)'}
                      placeholder="Otel adı veya bölge girin (örn: Kemer, Belek, Side)"
                    />
                    {errors.destination && (
                      <p className="mt-2 text-sm text-red-600">{errors.destination.message}</p>
                    )}
                  </div>

                  {/* Route Map */}
                  {watchedValues.destination?.name && (
                    <div>
                      <RouteMap
                        origin={watchedValues.transferType === 'airport-hotel' ? 'Antalya Airport' : watchedValues.destination.name}
                        destination={watchedValues.transferType === 'airport-hotel' ? watchedValues.destination.name : 'Antalya Airport'}
                        onRouteCalculated={(distance, duration) => {
                          // Update pricing calculation when route is calculated
                          console.log('Route calculated:', { distance, duration });
                        }}
                      />
                    </div>
                  )}

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Transfer Tarihi
                      </label>
                      <input
                        type="date"
                        {...register('pickupDate')}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.pickupDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.pickupDate.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline h-4 w-4 mr-1" />
                        Transfer Saati
                      </label>
                      <select
                        {...register('pickupTime')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Saat seçin</option>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <React.Fragment key={i}>
                              <option value={`${hour}:00`}>{hour}:00</option>
                              <option value={`${hour}:30`}>{hour}:30</option>
                            </React.Fragment>
                          );
                        })}
                      </select>
                      {errors.pickupTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.pickupTime.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Passenger and Luggage Count */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="inline h-4 w-4 mr-1" />
                        Yolcu Sayısı
                      </label>
                      <select
                        {...register('passengerCount', { valueAsNumber: true })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num} Yolcu</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bagaj Sayısı
                      </label>
                      <select
                        {...register('luggageCount', { valueAsNumber: true })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num} Bagaj</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Vehicle Selection */}
                  <VehicleSelection
                    vehicles={vehicles}
                    selectedVehicle={watchedValues.vehicleType}
                    onVehicleSelect={(vehicleId) => setValue('vehicleType', vehicleId)}
                    passengerCount={watchedValues.passengerCount}
                  />
                  {errors.vehicleType && (
                    <p className="mt-2 text-sm text-red-600">{errors.vehicleType.message}</p>
                  )}

                  {/* Price Display */}
                  {(totalPrice > 0 || (watchedValues.destination?.name && watchedValues.vehicleType && watchedValues.pickupDate && watchedValues.pickupTime)) && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Toplam Tutar:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {isCalculatingPrice ? 'Hesaplanıyor...' : totalPrice > 0 ? `$${totalPrice}` : '$63'}
                        </span>
                      </div>
                      {totalPrice === 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          * Kemer - Antalya Havalimanı arası standart transfer
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Customer Information */}
              {currentStep === 2 && (
                <CustomerInfoForm
                  register={register}
                  errors={errors}
                  watchedValues={watchedValues}
                  setValue={setValue}
                  extraServices={extraServices}
                />
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <PaymentSection
                  priceCalculation={priceCalculation}
                  bookingData={{...watchedValues, qrCode}}
                  reservationId={reservationId}
                  onPaymentSuccess={(transactionId) => {
                    console.log('Payment successful, transaction ID:', transactionId);
                    toast.success('Ödeme başarıyla tamamlandı!');
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
                  onClick={async () => {
                    console.log('Step navigation clicked:', { currentStep, watchedValues });
                    
                    if (currentStep === 1) {
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
                      
                      console.log('Step 1 validation passed, moving to step 2');
                      setCurrentStep(2);
                      return;
                    }
                    
                    if (currentStep === 2) {
                      console.log('Step 2 validation starting...');
                      
                      // Validate customer info fields
                      const isValid = await trigger(['customerInfo.firstName', 'customerInfo.lastName', 'customerInfo.email', 'customerInfo.phone']);
                      
                      console.log('Step 2 validation result:', isValid);
                      
                      if (!isValid) {
                        toast.error('Lütfen tüm zorunlu alanları doğru şekilde doldurun');
                        return;
                      }
                      
                      // Instead of calling handleSubmit directly, just move to step 3
                      // The reservation creation will happen in the payment step
                      console.log('Step 2 validation passed, moving to step 3');
                      
                      try {
                        // Create reservation before moving to payment step
                        console.log('Creating reservation...');
                        await handleSubmit(onSubmit)();
                        // If successful, onSubmit will handle moving to step 3
                      } catch (error) {
                        console.error('Reservation creation error:', error);
                        toast.error('Rezervasyon oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
                      }
                      return;
                    }
                    
                    if (currentStep === 3) {
                      handlePayTRPayment();
                    }
                  }}
                  disabled={isCalculatingPrice || isSubmitting || (currentStep === 1 && !watchedValues.destination?.name && totalPrice === 0)}
                  className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {isCalculatingPrice ? 'İşleniyor...' : 
                     isSubmitting ? 'Rezervasyon oluşturuluyor...' :
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