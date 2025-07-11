import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { Search, Filter, Car, Users, Luggage, DollarSign, Eye, Edit, Trash2, Plus } from 'lucide-react';

const mockVehicles = [
  {
    id: 'VEH-001',
    name: 'Mercedes Vito Premium',
    type: 'premium',
    model: 'Mercedes Vito 2023',
    plate: '07 ABC 123',
    capacity: 8,
    baggage: 8,
    pricePerKm: 6.5,
    status: 'active',
    driverId: 'DRV-001',
    driverName: 'Mehmet Demir',
    lastMaintenance: '2024-01-01',
    totalKm: 45000
  },
  {
    id: 'VEH-002',
    name: 'BMW X7 Luxury',
    type: 'luxury',
    model: 'BMW X7 2024',
    plate: '07 DEF 456',
    capacity: 6,
    baggage: 6,
    pricePerKm: 8.5,
    status: 'active',
    driverId: 'DRV-002',
    driverName: 'Ali Kaya',
    lastMaintenance: '2023-12-15',
    totalKm: 32000
  },
  {
    id: 'VEH-003',
    name: 'Volkswagen Caddy',
    type: 'standard',
    model: 'Volkswagen Caddy 2022',
    plate: '07 GHI 789',
    capacity: 4,
    baggage: 4,
    pricePerKm: 4.5,
    status: 'maintenance',
    driverId: null,
    driverName: null,
    lastMaintenance: '2024-01-10',
    totalKm: 67000
  }
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-red-100 text-red-800'
};

const statusLabels = {
  active: 'Aktif',
  maintenance: 'Bakımda',
  inactive: 'Pasif'
};

const typeColors = {
  standard: 'bg-blue-100 text-blue-800',
  premium: 'bg-purple-100 text-purple-800',
  luxury: 'bg-gold-100 text-gold-800'
};

export default function AdminVehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Araç Yönetimi</h1>
            <p className="text-gray-600">Araç filosunu görüntüleyin ve yönetin</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Yeni Araç</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Car className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {mockVehicles.filter(v => v.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Aktif Araç</div>
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
                  {mockVehicles.filter(v => v.status === 'maintenance').length}
                </div>
                <div className="text-sm text-gray-600">Bakımda</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {mockVehicles.reduce((sum, v) => sum + v.capacity, 0)}
                </div>
                <div className="text-sm text-gray-600">Toplam Kapasite</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  ${(mockVehicles.reduce((sum, v) => sum + v.pricePerKm, 0) / mockVehicles.length).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Ortalama Fiyat/KM</div>
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
                placeholder="Araç adı veya plaka ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">Tüm Tipler</option>
                <option value="standard">Standart</option>
                <option value="premium">Premium</option>
                <option value="luxury">Lüks</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="maintenance">Bakımda</option>
                <option value="inactive">Pasif</option>
              </select>

              <button className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>Filtreler</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Araç
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip & Kapasite
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Şoför
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat & KM
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
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                        <div className="text-sm text-gray-500">{vehicle.model}</div>
                        <div className="text-sm text-gray-500 font-mono">{vehicle.plate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[vehicle.type as keyof typeof typeColors]}`}>
                          {vehicle.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {vehicle.capacity}
                        </div>
                        <div className="flex items-center">
                          <Luggage className="h-4 w-4 mr-1" />
                          {vehicle.baggage}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehicle.driverName ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">{vehicle.driverName}</div>
                          <div className="text-sm text-gray-500">{vehicle.driverId}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Atanmamış</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">${vehicle.pricePerKm}/km</div>
                      <div className="text-sm text-gray-500">{vehicle.totalKm.toLocaleString()} km</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[vehicle.status as keyof typeof statusColors]}`}>
                        {statusLabels[vehicle.status as keyof typeof statusLabels]}
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