import React, { useState } from 'react';
import { RefreshCw, DollarSign, AlertCircle, CheckCircle, XCircle, Calendar, User } from 'lucide-react';

interface RefundRequest {
  id: string;
  transactionId: string;
  originalAmount: number;
  refundAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestDate: string;
  customerName: string;
  customerEmail: string;
  reservationId: string;
}

const mockRefunds: RefundRequest[] = [
  {
    id: 'REF-001',
    transactionId: 'TXN-123456',
    originalAmount: 85.00,
    refundAmount: 85.00,
    reason: 'Müşteri talebi - Transfer iptal',
    status: 'pending',
    requestDate: '2024-01-15',
    customerName: 'Ahmet Yılmaz',
    customerEmail: 'ahmet@email.com',
    reservationId: 'RES-001'
  },
  {
    id: 'REF-002',
    transactionId: 'TXN-123457',
    originalAmount: 120.00,
    refundAmount: 60.00,
    reason: 'Kısmi iade - Hizmet değişikliği',
    status: 'approved',
    requestDate: '2024-01-14',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@email.com',
    reservationId: 'RES-002'
  },
  {
    id: 'REF-003',
    transactionId: 'TXN-123458',
    originalAmount: 95.00,
    refundAmount: 95.00,
    reason: 'Şoför problemi',
    status: 'completed',
    requestDate: '2024-01-13',
    customerName: 'Hans Mueller',
    customerEmail: 'hans@email.com',
    reservationId: 'RES-003'
  }
];

export default function RefundManager() {
  const [refunds, setRefunds] = useState<RefundRequest[]>(mockRefunds);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-100', label: 'Beklemede' };
      case 'approved':
        return { icon: CheckCircle, color: 'text-blue-600 bg-blue-100', label: 'Onaylandı' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600 bg-red-100', label: 'Reddedildi' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-100', label: 'Tamamlandı' };
      default:
        return { icon: AlertCircle, color: 'text-gray-600 bg-gray-100', label: 'Bilinmiyor' };
    }
  };

  const handleStatusChange = (refundId: string, newStatus: string) => {
    setRefunds(refunds.map(refund => 
      refund.id === refundId ? { ...refund, status: newStatus as any } : refund
    ));
    setSelectedRefund(null);
  };

  const filteredRefunds = refunds.filter(refund => 
    filterStatus === 'all' || refund.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">İade Yönetimi</h1>
          <p className="text-gray-600">Ödeme iadelerini yönetin ve takip edin</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Beklemede</option>
            <option value="approved">Onaylandı</option>
            <option value="rejected">Reddedildi</option>
            <option value="completed">Tamamlandı</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Toplam İade', value: refunds.length, color: 'from-blue-500 to-blue-600' },
          { label: 'Beklemede', value: refunds.filter(r => r.status === 'pending').length, color: 'from-yellow-500 to-yellow-600' },
          { label: 'Onaylandı', value: refunds.filter(r => r.status === 'approved').length, color: 'from-green-500 to-green-600' },
          { label: 'Tamamlandı', value: refunds.filter(r => r.status === 'completed').length, color: 'from-purple-500 to-purple-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl mb-4`}>
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">İade Talepleri</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İade Bilgileri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRefunds.map((refund) => {
                const statusConfig = getStatusConfig(refund.status);
                return (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{refund.id}</div>
                        <div className="text-sm text-gray-500">İşlem: {refund.transactionId}</div>
                        <div className="text-sm text-gray-500">Rezervasyon: {refund.reservationId}</div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {refund.requestDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">
                          {refund.customerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{refund.customerName}</div>
                          <div className="text-sm text-gray-500">{refund.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          İade: ${refund.refundAmount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Orijinal: ${refund.originalAmount.toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <statusConfig.icon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedRefund(refund)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Detay
                      </button>
                      {refund.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(refund.id, 'approved')}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => handleStatusChange(refund.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reddet
                          </button>
                        </>
                      )}
                      {refund.status === 'approved' && (
                        <button
                          onClick={() => handleStatusChange(refund.id, 'completed')}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Tamamla
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Detail Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">İade Detayları</h2>
                <button 
                  onClick={() => setSelectedRefund(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Refund Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">İade Bilgileri</h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div><span className="font-medium">İade ID:</span> {selectedRefund.id}</div>
                      <div><span className="font-medium">İşlem ID:</span> {selectedRefund.transactionId}</div>
                      <div><span className="font-medium">Rezervasyon:</span> {selectedRefund.reservationId}</div>
                      <div><span className="font-medium">Tarih:</span> {selectedRefund.requestDate}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Tutar Bilgileri</h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div><span className="font-medium">Orijinal Tutar:</span> ${selectedRefund.originalAmount.toFixed(2)}</div>
                      <div><span className="font-medium">İade Tutarı:</span> ${selectedRefund.refundAmount.toFixed(2)}</div>
                      <div><span className="font-medium">İade Oranı:</span> {((selectedRefund.refundAmount / selectedRefund.originalAmount) * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Müşteri Bilgileri</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div><span className="font-medium">Ad:</span> {selectedRefund.customerName}</div>
                  <div><span className="font-medium">E-posta:</span> {selectedRefund.customerEmail}</div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">İade Sebebi</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  {selectedRefund.reason}
                </div>
              </div>

              {/* Actions */}
              {selectedRefund.status === 'pending' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleStatusChange(selectedRefund.id, 'approved')}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    İadeyi Onayla
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedRefund.id, 'rejected')}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    İadeyi Reddet
                  </button>
                </div>
              )}
              
              {selectedRefund.status === 'approved' && (
                <button
                  onClick={() => handleStatusChange(selectedRefund.id, 'completed')}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  İadeyi Tamamla
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}