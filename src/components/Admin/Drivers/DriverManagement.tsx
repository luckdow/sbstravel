import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, User, Car, Star, Phone, MapPin, Calendar, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import AddDriverModal from './AddDriverModal';
import toast from 'react-hot-toast';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  completedTrips: number;
  vehicleTypes: string[];
  joinDate: string;
  location?: string;
  earnings?: string;
  experienceYears?: number;
}

const mockDrivers: Driver[] = [
  {
    id: 'DRV-001',
    firstName: 'Mehmet',
    lastName: 'Demir',
    email: 'mehmet.demir@sbstravel.com',
    phone: '+90 532 123 4567',
    status: 'available',
    rating: 4.8,
    completedTrips: 156,
    vehicleTypes: ['Standard', 'Premium'],
    joinDate: '2023-06-15',
    location: 'Antalya Merkez',
    earnings: '$2,340',
    experienceYears: 8
  },
  {
    id: 'DRV-002',
    firstName: 'Ali',
    lastName: 'Kaya',
    email: 'ali.kaya@sbstravel.com',
    phone: '+90 533 234 5678',
    status: 'busy',
    rating: 4.9,
    completedTrips: 203,
    vehicleTypes: ['Luxury', 'VIP'],
    joinDate: '2023-03-20',
    location: 'Kemer',
    earnings: '$3,120',
    experienceYears: 12
  },
  {
    id: 'DRV-003',
    firstName: 'Osman',
    lastName: 'Çelik',
    email: 'osman.celik@sbstravel.com',
    phone: '+90 534 345 6789',
    status: 'available',
    rating: 4.7,
    completedTrips: 89,
    vehicleTypes: ['Standard'],
    joinDate: '2023-09-10',
    location: 'Belek',
    earnings: '$1,890',
    experienceYears: 5
  },
  {
    id: 'DRV-004',
    firstName: 'Fatih',
    lastName: 'Özkan',
    email: 'fatih.ozkan@sbstravel.com',
    phone: '+90 535 456 7890',
    status: 'offline',
    rating: 4.6,
    completedTrips: 134,
    vehicleTypes: ['Premium', 'Minibus'],
    joinDate: '2023-07-05',
    location: 'Side',
    earnings: '$2,560',
    experienceYears: 7
  }
];

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const filteredDrivers = drivers.filter(driver => {
    const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddDriver = (newDriver: any) => {
    setDrivers(prev => [...prev, newDriver]);
  };

  const handleDeleteDriver = (driverId: string) => {
    if (window.confirm('Bu şoförü silmek istediğinizden emin misiniz?')) {
      setDrivers(prev => prev.filter(d => d.id !== driverId));
      toast.success('Şoför başarıyla silindi');
      setShowActionMenu(null);
    }
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowActionMenu(null);
    // In real app, this would open edit modal
    toast.info('Düzenleme özelliği yakında eklenecek');
  };

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowActionMenu(null);
    // In real app, this would open driver detail modal
    toast.info('Detay görüntüleme özelliği yakında eklenecek');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'offline':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Müsait';
      case 'busy':
        return 'Meşgul';
      case 'offline':
        return 'Çevrimdışı';
      default:
        return 'Belirsiz';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Şoför Yönetimi</h1>
          <p className="text-gray-600">Transfer şoförlerini yönetin ve yeni şoför ekleyin</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Yeni Şoför Ekle</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Toplam Şoför', value: drivers.length, color: 'blue', icon: User },
          { title: 'Müsait', value: drivers.filter(d => d.status === 'available').length, color: 'green', icon: User },
          { title: 'Meşgul', value: drivers.filter(d => d.status === 'busy').length, color: 'yellow', icon: User },
          { title: 'Ortalama Puan', value: (drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(1), color: 'purple', icon: Star }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Şoför adı, telefon veya ID ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
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
                  Durum
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performans
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Araç Tipleri
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kazanç
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Şoför bulunamadı
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {driver.firstName[0]}{driver.lastName[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {driver.firstName} {driver.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{driver.id}</div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Katılım: {new Date(driver.joinDate).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {driver.phone}
                    </div>
                    <div className="text-sm text-gray-500">{driver.email}</div>
                    {driver.location && (
                      <div className="text-xs text-gray-400 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {driver.location}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(driver.status)}`}>
                      {getStatusLabel(driver.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{driver.rating}</span>
                    </div>
                    <div className="text-sm text-gray-500">{driver.completedTrips} transfer</div>
                    {driver.experienceYears && (
                      <div className="text-xs text-gray-400">{driver.experienceYears} yıl deneyim</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {driver.vehicleTypes.map((type, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {driver.earnings || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Bu ay</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === driver.id ? null : driver.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {showActionMenu === driver.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => handleViewDriver(driver)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Detayları Görüntüle
                          </button>
                          <button
                            onClick={() => handleEditDriver(driver)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(driver.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Sil
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDriverAdded={handleAddDriver}
      />
    </div>
  );
}