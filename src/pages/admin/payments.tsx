import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import PaymentStatus from '../../components/Payment/PaymentStatus';
import RefundManager from '../../components/Payment/RefundManager';
import { CreditCard, RefreshCw, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const paymentStats = [
    {
      title: 'Bugünkü Gelir',
      value: '$2,840',
      change: '+12%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Başarılı Ödemeler',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Bekleyen İadeler',
      value: '3',
      change: '-2',
      changeType: 'decrease',
      icon: RefreshCw,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Aylık Büyüme',
      value: '+18%',
      change: '+3%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ödeme Yönetimi</h1>
          <p className="text-gray-600">Ödemeler, iadeler ve finansal raporlar</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paymentStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Genel Bakış' },
                { id: 'transactions', label: 'İşlemler' },
                { id: 'refunds', label: 'İadeler' },
                { id: 'reports', label: 'Raporlar' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Ödeme Durumu Kontrolü</h3>
                <PaymentStatus 
                  transactionId="TXN_123456"
                  onStatusUpdate={(status) => console.log('Status updated:', status)}
                />
              </div>
            )}

            {activeTab === 'refunds' && (
              <RefundManager />
            )}

            {activeTab === 'transactions' && (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">İşlem Listesi</h3>
                <p className="text-gray-500">Tüm ödeme işlemlerini burada görüntüleyebilirsiniz.</p>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Finansal Raporlar</h3>
                <p className="text-gray-500">Detaylı finansal raporlar ve analizler yakında eklenecek.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}