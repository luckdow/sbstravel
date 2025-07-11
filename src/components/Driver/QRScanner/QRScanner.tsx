import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import toast from 'react-hot-toast';
import { QrCode, Camera, CheckCircle, XCircle, Scan } from 'lucide-react';
import { Reservation } from '../../../types';
import { getSafeLocationStrings } from '../../../lib/utils/location';

interface ScanResult {
  success: boolean;
  reservation?: Reservation;
  error?: string;
}

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [manualCode, setManualCode] = useState('');
  
  const { reservations, updateReservationStatus } = useStore();

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate QR code scanning
    setTimeout(() => {
      // Find a reservation to simulate scanning
      const pendingReservation = reservations.find(r => r.status === 'assigned');
      if (pendingReservation) {
        setScanResult({
          success: true,
          reservation: pendingReservation
        });
      } else {
        setScanResult({
          success: false,
          error: 'QR kod okunamadı'
        });
      }
      setIsScanning(false);
    }, 3000);
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      const reservation = reservations.find(r => 
        r.id === manualCode || r.qrCode === manualCode
      );
      
      if (reservation) {
        setScanResult({
          success: true,
          reservation
        });
      } else {
        setScanResult({
          success: false,
          error: 'Rezervasyon bulunamadı'
        });
      }
    }
  };

  const handleStartTransfer = async () => {
    if (scanResult?.reservation) {
      await updateReservationStatus(scanResult.reservation.id, 'started');
      toast.success('Transfer başlatıldı!');
    }
    setScanResult(null);
    setManualCode('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">QR Kod Okuyucu</h1>
        <p className="text-gray-600">Transfer başlatmak için müşterinin QR kodunu okutun</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Kamera ile Okut</h2>
          
          <div className="relative">
            <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
              {isScanning ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">QR kod aranıyor...</p>
                  <div className="mt-4 w-48 h-48 border-2 border-blue-500 rounded-lg animate-pulse"></div>
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Kamerayı başlatmak için butona tıklayın</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Camera className="h-5 w-5" />
              <span>{isScanning ? 'Taranıyor...' : 'Kamerayı Başlat'}</span>
            </button>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Manuel Giriş</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rezervasyon Kodu
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="RES-001 formatında girin"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <button
              onClick={handleManualEntry}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Scan className="h-5 w-5" />
              <span>Kodu Doğrula</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">Nasıl Kullanılır?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Müşteriden QR kodu göstermesini isteyin</li>
              <li>• Kamerayı QR koda doğrultun</li>
              <li>• Kod otomatik olarak okunacaktır</li>
              <li>• Sorun yaşarsanız manuel giriş yapın</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            {scanResult.success ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {scanResult.success ? 'QR Kod Başarıyla Okundu!' : 'QR Kod Okunamadı'}
              </h3>
              <p className="text-gray-600">
                {scanResult.success ? 'Transfer bilgileri aşağıda görüntülenmektedir' : 'Lütfen tekrar deneyin'}
              </p>
            </div>
          </div>

          {scanResult.success && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800">Rezervasyon ID</h4>
                  <p className="text-lg font-bold text-blue-600">{scanResult.reservation.id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800">Müşteri</h4>
                  <p className="text-lg font-bold text-gray-800">{scanResult.reservation.customerName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800">Güzergah</h4>
                  <p className="text-lg font-bold text-gray-800">
                    {(() => {
                      const { pickup, dropoff } = getSafeLocationStrings(
                        scanResult.reservation.pickupLocation, 
                        scanResult.reservation.dropoffLocation
                      );
                      return `${pickup} → ${dropoff}`;
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleStartTransfer}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Transferi Başlat</span>
                </button>
                <button
                  onClick={() => setScanResult(null)}
                  className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Scans */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Son Okutulan Kodlar</h2>
        
        <div className="space-y-3">
          {[
            { id: 'RES-001', customer: 'Ahmet Yılmaz', time: '10:30', status: 'completed' },
            { id: 'RES-002', customer: 'Sarah Johnson', time: '09:15', status: 'completed' },
            { id: 'RES-003', customer: 'Hans Mueller', time: '08:45', status: 'completed' }
          ].map((scan, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{scan.id}</p>
                  <p className="text-sm text-gray-600">{scan.customer}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{scan.time}</p>
                <p className="text-xs text-green-600">Tamamlandı</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}