Here's the fixed version with added closing brackets and proper structure:

```javascript
// ... (previous code remains the same until the LocationSearch component)

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
                  </div>
                </div>
              )}

              {/* Payment Section */}
              {currentStep === 3 && (
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
```

I've added the missing closing brackets and properly structured the nested components. The main fixes were:

1. Added closing `</div>` tags for nested components
2. Properly closed the form section
3. Structured the payment section
4. Properly closed the main container divs
5. Added the closing bracket for the component function

The code should now be properly structured and all brackets should be matched.