import React, { useState } from 'react';
import { X, Upload, User, Car, Lock, FileText, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDriverAdded: (driver: any) => void;
}

interface DriverFormData {
  // Personal Info
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  identityNumber: string;
  dateOfBirth: string;
  address: string;
  
  // Driving Info
  licenseNumber: string;
  licenseExpiry: string;
  experienceYears: number;
  vehicleTypes: string[];
  
  // Account Info
  username: string;
  password: string;
  confirmPassword: string;
  
  // Documents
  licensePhoto: File | null;
  identityPhoto: File | null;
  profilePhoto: File | null;
}

const initialFormData: DriverFormData = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  identityNumber: '',
  dateOfBirth: '',
  address: '',
  licenseNumber: '',
  licenseExpiry: '',
  experienceYears: 0,
  vehicleTypes: [],
  username: '',
  password: '',
  confirmPassword: '',
  licensePhoto: null,
  identityPhoto: null,
  profilePhoto: null
};

const vehicleTypeOptions = [
  'Standard',
  'Premium',
  'Luxury',
  'VIP',
  'Minibus'
];

export default function AddDriverModal({ isOpen, onClose, onDriverAdded }: AddDriverModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DriverFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<DriverFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof DriverFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (field: 'licensePhoto' | 'identityPhoto' | 'profilePhoto', file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleVehicleTypeToggle = (vehicleType: string) => {
    setFormData(prev => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(vehicleType)
        ? prev.vehicleTypes.filter(t => t !== vehicleType)
        : [...prev.vehicleTypes, vehicleType]
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Partial<DriverFormData> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'Ad gerekli';
      if (!formData.lastName) newErrors.lastName = 'Soyad gerekli';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Telefon gerekli';
      if (!formData.email) newErrors.email = 'E-posta gerekli';
      if (!formData.identityNumber) newErrors.identityNumber = 'Kimlik numarası gerekli';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Doğum tarihi gerekli';
      if (!formData.address) newErrors.address = 'Adres gerekli';
    } else if (step === 2) {
      if (!formData.licenseNumber) newErrors.licenseNumber = 'Ehliyet numarası gerekli';
      if (!formData.licenseExpiry) newErrors.licenseExpiry = 'Ehliyet geçerlilik tarihi gerekli';
      if (formData.experienceYears < 1) newErrors.experienceYears = 'En az 1 yıl deneyim gerekli';
      if (formData.vehicleTypes.length === 0) newErrors.vehicleTypes = 'En az bir araç tipi seçin';
    } else if (step === 3) {
      if (!formData.username) newErrors.username = 'Kullanıcı adı gerekli';
      if (!formData.password) newErrors.password = 'Şifre gerekli';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Şifreler eşleşmiyor';
      if (formData.password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalı';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      // Create driver object with Firebase-compatible structure
      const driverData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        licenseNumber: formData.licenseNumber,
        vehicleType: formData.vehicleTypes[0] || 'standard', // Use first selected type as primary
        status: 'available' as const,
        rating: 5.0,
        totalEarnings: 0,
        completedTrips: 0,
        isActive: true,
        // Additional fields
        identityNumber: formData.identityNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        licenseExpiry: formData.licenseExpiry,
        experienceYears: formData.experienceYears,
        vehicleTypes: formData.vehicleTypes,
        username: formData.username,
        joinDate: new Date(),
        documents: {
          licensePhoto: formData.licensePhoto?.name || null,
          identityPhoto: formData.identityPhoto?.name || null,
          profilePhoto: formData.profilePhoto?.name || null
        }
      };

      // Call the onDriverAdded callback which uses the store
      await onDriverAdded(driverData);
      
      // Reset form
      setFormData(initialFormData);
      setCurrentStep(1);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting driver form:', error);
      // Error handling is done in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Kişisel Bilgiler', icon: User },
    { number: 2, title: 'Sürücü Bilgileri', icon: Car },
    { number: 3, title: 'Hesap Bilgileri', icon: Lock },
    { number: 4, title: 'Belgeler', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Yeni Şoför Kaydı</h2>
            <p className="text-gray-600">Detaylı şoför bilgilerini girin</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3">
                  <div className={`font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Kişisel Bilgiler</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Adınızı girin"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soyad *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Soyadınızı girin"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="+90 5XX XXX XX XX"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="ornek@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kimlik Numarası *</label>
                  <input
                    type="text"
                    value={formData.identityNumber}
                    onChange={(e) => handleInputChange('identityNumber', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.identityNumber ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="12345678901"
                  />
                  {errors.identityNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.identityNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Tam adresinizi girin"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Driving Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Sürücü Bilgileri</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ehliyet Numarası *</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.licenseNumber ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Ehliyet numaranızı girin"
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ehliyet Geçerlilik Tarihi *</label>
                  <input
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.licenseExpiry ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.licenseExpiry && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.licenseExpiry}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deneyim (Yıl) *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.experienceYears}
                    onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.experienceYears ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Kaç yıl deneyiminiz var?"
                  />
                  {errors.experienceYears && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.experienceYears}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Araç Tipleri *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {vehicleTypeOptions.map((type) => (
                    <label
                      key={type}
                      className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.vehicleTypes.includes(type)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.vehicleTypes.includes(type)}
                        onChange={() => handleVehicleTypeToggle(type)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center ${
                        formData.vehicleTypes.includes(type)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.vehicleTypes.includes(type) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.vehicleTypes && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.vehicleTypes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Account Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Hesap Bilgileri</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.username ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Kullanıcı adı"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifre *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="En az 6 karakter"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrar *</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Şifreyi tekrar girin"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Belgeler</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { key: 'licensePhoto', label: 'Ehliyet Fotoğrafı', required: true },
                  { key: 'identityPhoto', label: 'Kimlik Fotoğrafı', required: true },
                  { key: 'profilePhoto', label: 'Profil Fotoğrafı', required: false }
                ].map((doc) => (
                  <div key={doc.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {doc.label} {doc.required && '*'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Dosya seçin veya sürükleyip bırakın
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(doc.key as any, file);
                          }
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {formData[doc.key as keyof DriverFormData] && (
                        <p className="mt-2 text-sm text-green-600 flex items-center justify-center">
                          <Check className="h-4 w-4 mr-1" />
                          {(formData[doc.key as keyof DriverFormData] as File)?.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Belge Yükleme Kuralları:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Dosyalar JPG, PNG veya PDF formatında olmalıdır</li>
                      <li>Maksimum dosya boyutu 5MB</li>
                      <li>Belgeler net ve okunabilir olmalıdır</li>
                      <li>Ehliyet ve kimlik fotoğrafları zorunludur</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Geri
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                İleri
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Şoför Kaydını Tamamla</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}