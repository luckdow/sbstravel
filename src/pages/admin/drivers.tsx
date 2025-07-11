import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { Search, Filter, User, Phone, Car, DollarSign, Star, Eye, Edit, Trash2, Plus, UserCheck, UserX } from 'lucide-react';

const mockDrivers = [
  {
    id: 'DRV-001',
    name: 'Mehmet Demir',
    email: 'mehmet@ayttransfer.com',
    phone: '+90 532 111 2233',
    vehicleType: 'premium',
    status: 'available',
    currentLocation: 'Antalya Merkez',
    rating: 4.8,
    totalEarnings: 2340,
    completedTrips: 156,
    joinDate: '2023-01-15'
  },
  {
    id: 'DRV-002',
    name: 'Ali Kaya',
    email: 'ali@ayttransfer.com',
    phone: '+90 533 222 3344',
    vehicleType: 'luxury',
    status: 'busy',
    currentLocation: 'Kemer',
    rating: 4.9,
    totalEarnings: 3120,
    completedTrips: 203,
    joinDate: '2023-02-20'
  },
  {
    id: 'DRV-003',
    name: 'Osman Çelik',
    email: 'osman@ayttransfer.com',
    phone: '+90 534 333 4455',
    vehicleType: 'standard',
    status: 'offline',
    currentLocation: 'Belek',
    rating: 4.7,
    totalEarnings: 1890,
    completedTrips: 89,
    joinDate: '2023-03-10'
  }
];

const statusColors = {
  available: 'bg-green-100 text-green-800',
  busy: 'bg-yellow-100 text-yellow-800',
  offline: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  available: 'Müsait',
  busy: 'Meşgul',
  offline: 'Çevrimdışı'
};

export default function AdminDriversPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDrivers = mockDrivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Şoför Yönetimi</h1>
            <p className="text-gray-600">Şoförleri görüntüleyin ve yönetin</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Yeni Şoför</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {mockDrivers.filter(d => d.status === 'available').length}
                </div>
                <div className="text-sm text-gray-600">Müsait Şoför</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Car className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {mockDrivers.filter(d => d.status === 'busy').length}
                </div>
                <div className="text-sm text-gray-600">Aktif Transfer</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  ${mockDrivers.reduce((sum, d) => sum + d.totalEarnings, 0).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Toplam Kazanç</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {(mockDrivers.reduce((sum, d) => sum + d.rating, 0) / mockDrivers.length).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Ortalama Puan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Şoför adı veya e-posta ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="available">Müsait</option>
                <option value="busy">Meşgul</option>
                <option value="offline">Çevrimdışı</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>Filtreler</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Şoför
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Araç & Konum
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performans
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                          <div className="text-sm text-gray-500">{driver.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.email}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {driver.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Car className="h-4 w-4 mr-1" />
                        {driver.vehicleType}
                      </div>
                      <div className="text-sm text-gray-500">{driver.currentLocation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{driver.rating}</span>
                      </div>
                      <div className="text-sm text-gray-500">{driver.completedTrips} transfer</div>
                      <div className="text-sm font-medium text-green-600">${driver.totalEarnings}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[driver.status as keyof typeof statusColors]}`}>
                        {statusLabels[driver.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}