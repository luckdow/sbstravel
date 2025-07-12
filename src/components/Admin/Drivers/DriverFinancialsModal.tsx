import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Download, CheckCircle, Clock } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { Driver, DriverFinancials } from '../../../types';

interface DriverFinancialsModalProps {
  driver: Driver;
  onClose: () => void;
}

export default function DriverFinancialsModal({ driver, onClose }: DriverFinancialsModalProps) {
  const [financials, setFinancials] = useState<DriverFinancials | null>(null);
  const [loading, setLoading] = useState(true);
  const { getDriverFinancials, reservations } = useStore();

  useEffect(() => {
    const loadFinancials = async () => {
      if (driver.id) {
        const data = await getDriverFinancials(driver.id);
        setFinancials(data);
      }
      setLoading(false);
    };

    loadFinancials();
  }, [driver.id, getDriverFinancials]);

  // Get driver's completed trips
  const completedTrips = reservations.filter(
    r => r.driverId === driver.id && r.status === 'completed'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {driver.firstName?.[0]}{driver.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{driver.firstName} {driver.lastName}</h2>
                <p className="text-gray-600">Şoför Cari Hesabı</p>
              </div>
            </div>
            
            {/* IBAN Bilgisi */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h3 className="font-bold text-gray-800">Ödeme Bilgileri</h3>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-gray-800">IBAN:</div>
                <div className="p-3 bg-white rounded-lg border border-blue-200 font-mono text-blue-700">
                  {driver.iban || 'IBAN bilgisi girilmemiş'}
                </div>
                <p className="text-sm text-blue-600">
                  Bu IBAN numarasına ödeme yapabilirsiniz. Ödeme yapmadan önce şoförle iletişime geçmeniz önerilir.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <DollarSign className="h-6 w-6 text-green-600" />
                    <h3 className="font-bold text-gray-800">Toplam Kazanç</h3>
                  </div>
                  <div className="text-3xl font-bold text-green-600">${financials?.totalEarnings.toFixed(2) || '0.00'}</div>
                  <div className="text-sm text-gray-600 mt-2">{completedTrips.length} tamamlanan transfer</div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <h3 className="font-bold text-gray-800">Bekleyen Ödemeler</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">${financials?.pendingPayments.toFixed(2) || '0.00'}</div>
                  <div className="text-sm text-gray-600 mt-2">Henüz ödenmemiş tutar</div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="h-6 w-6 text-purple-600" />
                    <h3 className="font-bold text-gray-800">Bu Ayki Kazanç</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    ${financials?.monthlyEarnings[`${new Date().getMonth() + 1}-${new Date().getFullYear()}`]?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">{new Date().toLocaleString('tr-TR', { month: 'long' })} ayı</div>
                </div>
              </div>

              {/* Completed Trips */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800">Tamamlanan Transferler</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rezervasyon</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Güzergah</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şoför Payı</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {completedTrips.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-4 text-center text-gray-500">Henüz tamamlanan transfer bulunmuyor</td>
                        </tr>
                      ) : (
                        completedTrips.map((trip) => (
                          <tr key={trip.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{trip.id}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{trip.pickupDate} {trip.pickupTime}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {trip.pickupLocation} → {trip.dropoffLocation}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${trip.totalPrice.toFixed(2)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                              ${(trip.totalPrice * 0.75).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" /> Tamamlandı
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Actions */}
              <div className="flex space-x-4">
                <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Ödeme Yap</span>
                </button>
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Rapor İndir</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}