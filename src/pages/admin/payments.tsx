import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { CreditCard, RefreshCw, DollarSign, TrendingUp, Search, Filter, Calendar, User, CheckCircle, XCircle, Eye, Download } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Bekleyen Ödemeler',
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
      color: 'from-green-500 to-purple-600'
    }
  ];

  // Mock payment data
  const payments = [
    {
      id: 'PAY-001',
      reservationId: 'RES-001',
      customerName: 'Ahmet Yılmaz',
      amount: 85.00,
      date: '2024-01-15',
      status: 'completed',
      method: 'credit-card'
    },
    {
      id: 'PAY-002',
      reservationId: 'RES-002',
      customerName: 'Sarah Johnson',
      amount: 120.00,
      date: '2024-01-15',
      status: 'completed',
      method: 'credit-card'
    },
    {
      id: 'PAY-003',
      reservationId: 'RES-003',
      customerName: 'Hans Mueller',
      amount: 95.00,
      date: '2024-01-16',
      status: 'pending',
      method: 'bank-transfer'
    },
    {
      id: 'PAY-004',
      reservationId: 'RES-004',
      customerName: 'Maria Garcia',
      amount: 75.00,
      date: '2024-01-16',
      status: 'failed',
      method: 'credit-card'
    },
    {
      id: 'PAY-005',
      reservationId: 'RES-005',
      customerName: 'John Smith',
      amount: 150.00,
      date: '2024-01-17',
      status: 'refunded',
      method: 'credit-card'
    }
  ];

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reservationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && payment.date === '2024-01-15') ||
                       (dateFilter === 'yesterday' && payment.date === '2024-01-14') ||
                       (dateFilter === 'week' && ['2024-01-15', '2024-01-16', '2024-01-17'].includes(payment.date));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Beklemede';
      case 'failed':
        return 'Başarısız';
      case 'refunded':
        return 'İade Edildi';
      default:
        return status;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'credit-card':
        return 'Kredi Kartı';
      case 'bank-transfer':
        return 'Banka Havalesi';
      default:
        return method;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Ödeme Yönetimi</h1>
            <p className="text-gray-600">Ödemeler, iadeler ve finansal raporlar</p>
          </div>
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
                { id: 'transactions', label: 'İşlemler' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
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
                <h3 className="text-lg font-bold text-gray-800">Ödeme Özeti</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Ödeme Dağılımı</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Tamamlanan</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">$3,240</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Bekleyen</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">$420</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Başarısız</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">$150</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">İade Edilen</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">$320</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Ödeme Yöntemleri</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Kredi Kartı</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">78%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Banka Havalesi</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">22%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Son İşlemler</h4>
                  <div className="space-y-3">
                    {payments.slice(0, 3).map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                            <div className="text-xs text-gray-500">{payment.id} • {payment.date}</div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">${payment.amount.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Müşteri adı veya işlem ID ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex items-center space-x-4">
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      <option value="all">Tüm Tarihler</option>
                      <option value="today">Bugün</option>
                      <option value="yesterday">Dün</option>
                      <option value="week">Bu Hafta</option>
                    </select>
                    
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      <option value="all">Tüm Durumlar</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="pending">Beklemede</option>
                      <option value="failed">Başarısız</option>
                      <option value="refunded">İade Edildi</option>
                    </select>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlem ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Müşteri
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tutar
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tarih
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Yöntem
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
                        {filteredPayments.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                              İşlem bulunamadı
                            </td>
                          </tr>
                        ) : (
                          filteredPayments.map((payment, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                                <div className="text-xs text-gray-500">{payment.reservationId}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                    {payment.customerName.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">${payment.amount.toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{payment.date}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{getMethodLabel(payment.method)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                  {getStatusIcon(payment.status)}
                                  <span className="ml-1">{getStatusLabel(payment.status)}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button className="text-purple-600 hover:text-purple-900">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="text-green-600 hover:text-green-900">
                                    <Download className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}