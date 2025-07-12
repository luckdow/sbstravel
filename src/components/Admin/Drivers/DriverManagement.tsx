import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, User, Car, Star, Phone, MapPin, Calendar, MoreVertical, Edit, Trash2, Eye, AlertTriangle, DollarSign, TrendingUp, TrendingDown, CreditCard, Loader2 } from 'lucide-react';
import AddDriverModal from './AddDriverModal';
import { useStore } from '../../../store/useStore';
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
  isProblemDriver?: boolean;
  problemNotes?: string;
  financials?: {
    totalEarnings: number;
    currentBalance: number;
    receivables: number;
    payables: number;
    lastPayment?: Date;
    pendingPayments: number;
    monthlyEarnings: Record<string, number>;
  };
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
    earnings: '₺2,340',
    experienceYears: 8,
    isProblemDriver: false,
    financials: {
      totalEarnings: 25600,
      currentBalance: 1200,
      receivables: 800,
      payables: 200,
      lastPayment: new Date('2024-01-05'),
      pendingPayments: 3,
      monthlyEarnings: {
        '2024-01': 2340,
        '2023-12': 2100,
        '2023-11': 1950
      }
    }
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
    earnings: '₺3,120',
    experienceYears: 12,
    isProblemDriver: false,
    financials: {
      totalEarnings: 38400,
      currentBalance: 2100,
      receivables: 1200,
      payables: 0,
      lastPayment: new Date('2024-01-08'),
      pendingPayments: 1,
      monthlyEarnings: {
        '2024-01': 3120,
        '2023-12': 2800,
        '2023-11': 2900
      }
    }
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
    earnings: '₺1,890',
    experienceYears: 5,
    isProblemDriver: true,
    problemNotes: 'Müşteri şikayeti - geç gelme problemi',
    financials: {
      totalEarnings: 15200,
      currentBalance: -300,
      receivables: 500,
      payables: 800,
      lastPayment: new Date('2023-12-28'),
      pendingPayments: 2,
      monthlyEarnings: {
        '2024-01': 1890,
        '2023-12': 1650,
        '2023-11': 1400
      }
    }
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
    earnings: '₺2,560',
    experienceYears: 7,
    isProblemDriver: false,
    financials: {
      totalEarnings: 22800,
      currentBalance: 950,
      receivables: 600,
      payables: 150,
      lastPayment: new Date('2024-01-03'),
      pendingPayments: 2,
      monthlyEarnings: {
        '2024-01': 2560,
        '2023-12': 2200,
        '2023-11': 2000
      }
    }
  }
];

export default function DriverManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { drivers, addDriver, editDriver, deleteDriver, fetchDrivers } = useStore();

  // Fetch drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicleTypes: [] as string[],
    experienceYears: 0,
    isProblemDriver: false,
    problemNotes: ''
  });

  const filteredDrivers = (drivers || []).filter(driver => {
    const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddDriver = async (newDriver: any) => {
    const driverWithFinancials = {
      ...newDriver,
      financials: {
        totalEarnings: 0,
        currentBalance: 0,
        receivables: 0,
        payables: 0,
        pendingPayments: 0,
        monthlyEarnings: {}
      }
    };
    
    // Use the store addDriver function
    const result = await addDriver(driverWithFinancials);
    if (result) {
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteDriver = async (driverId: string) => {
    if (window.confirm('Bu şoförü silmek istediğinizden emin misiniz?')) {
      await deleteDriver(driverId);
      setShowActionMenu(null);
    }
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setEditForm({
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      phone: driver.phone,
      vehicleTypes: driver.vehicleTypes,
      experienceYears: driver.experienceYears || 0,
      isProblemDriver: driver.isProblemDriver || false,
      problemNotes: driver.problemNotes || ''
    });
    setShowEditModal(true);
    setShowActionMenu(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedDriver) return;

    setLoading(true);
    try {
      const updatedDriver = {
        ...selectedDriver,
        ...editForm
      };

      await editDriver(selectedDriver.id, editForm);

      setShowEditModal(false);
      setSelectedDriver(null);
    } catch (error) {
      console.error('Error updating driver:', error);
      toast.error('Güncelleme sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDetailModal(true);
    setShowActionMenu(null);
  };

  const toggleProblemStatus = async (driverId: string, isProblem: boolean, notes?: string) => {
    await editDriver(driverId, { 
      isProblemDriver: isProblem, 
      problemNotes: notes || '' 
    });
    toast.success(isProblem ? 'Şoför problemli olarak işaretlendi' : 'Problem işareti kaldırıldı');
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
          { title: 'Toplam Şoför', value: (drivers || []).length, color: 'blue', icon: User },
          { title: 'Müsait', value: (drivers || []).filter(d => d.status === 'available').length, color: 'green', icon: User },
          { title: 'Meşgul', value: (drivers || []).filter(d => d.status === 'busy').length, color: 'yellow', icon: User },
          { title: 'Ortalama Puan', value: (drivers && drivers.length > 0) ? ((drivers || []).reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(1) : '0.0', color: 'purple', icon: Star }
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
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {driver.firstName[0]}{driver.lastName[0]}
                        </div>
                        {driver.isProblemDriver && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-gray-900">
                            {driver.firstName} {driver.lastName}
                          </div>
                          {driver.isProblemDriver && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              Problemli
                            </span>
                          )}
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
                    {driver.financials && (
                      <div className={`text-xs ${driver.financials.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Bakiye: ₺{Math.round(driver.financials.currentBalance)}
                      </div>
                    )}
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
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
                          <div className="border-t border-gray-200"></div>
                          <button
                            onClick={() => toggleProblemStatus(driver.id, !driver.isProblemDriver, 
                              driver.isProblemDriver ? '' : 'Problem şoför olarak işaretlendi')}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center ${
                              driver.isProblemDriver ? 'text-green-600' : 'text-orange-600'
                            }`}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            {driver.isProblemDriver ? 'Problem İşaretini Kaldır' : 'Problemli Olarak İşaretle'}
                          </button>
                          <div className="border-t border-gray-200"></div>
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

      {/* Driver Detail Modal */}
      {showDetailModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedDriver.firstName[0]}{selectedDriver.lastName[0]}
                    </div>
                    {selectedDriver.isProblemDriver && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedDriver.firstName} {selectedDriver.lastName}
                    </h2>
                    <p className="text-gray-600">{selectedDriver.id} • {selectedDriver.email}</p>
                    {selectedDriver.isProblemDriver && (
                      <div className="mt-2">
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Problemli Şoför
                        </span>
                        {selectedDriver.problemNotes && (
                          <p className="text-sm text-red-600 mt-1">{selectedDriver.problemNotes}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Kişisel Bilgiler</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telefon:</span>
                        <span className="font-medium">{selectedDriver.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">E-posta:</span>
                        <span className="font-medium">{selectedDriver.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lokasyon:</span>
                        <span className="font-medium">{selectedDriver.location || 'Belirtilmemiş'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Katılım Tarihi:</span>
                        <span className="font-medium">{new Date(selectedDriver.joinDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deneyim:</span>
                        <span className="font-medium">{selectedDriver.experienceYears} yıl</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Performans</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Değerlendirme:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{selectedDriver.rating}/5.0</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tamamlanan Transfer:</span>
                        <span className="font-medium">{selectedDriver.completedTrips}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durum:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedDriver.status)}`}>
                          {getStatusLabel(selectedDriver.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Araç Tipleri</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDriver.vehicleTypes.map((type, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Cari Hesap Bilgileri
                    </h3>
                    {selectedDriver.financials ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-green-600 text-sm">Toplam Kazanç</div>
                            <div className="text-xl font-bold text-green-700">
                              ₺{selectedDriver.financials.totalEarnings.toLocaleString()}
                            </div>
                          </div>
                          <div className={`p-4 rounded-lg ${
                            selectedDriver.financials.currentBalance >= 0 ? 'bg-blue-50' : 'bg-red-50'
                          }`}>
                            <div className={`text-sm ${
                              selectedDriver.financials.currentBalance >= 0 ? 'text-blue-600' : 'text-red-600'
                            }`}>
                              Mevcut Bakiye
                            </div>
                            <div className={`text-xl font-bold ${
                              selectedDriver.financials.currentBalance >= 0 ? 'text-blue-700' : 'text-red-700'
                            }`}>
                              ₺{Math.round(selectedDriver.financials.currentBalance)}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Alacaklar:</span>
                              <span className="font-medium text-green-600">
                                ₺{Math.round(selectedDriver.financials.receivables)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Borçlar:</span>
                              <span className="font-medium text-red-600">
                                ₺{Math.round(selectedDriver.financials.payables)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bekleyen Ödeme:</span>
                              <span className="font-medium">
                                {selectedDriver.financials.pendingPayments} adet
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-2">Son Ödeme:</div>
                            <div className="font-medium">
                              {selectedDriver.financials.lastPayment 
                                ? new Date(selectedDriver.financials.lastPayment).toLocaleDateString('tr-TR')
                                : 'Henüz ödeme yok'
                              }
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-md font-semibold text-gray-800 mb-3">Aylık Kazanç Geçmişi</h4>
                          <div className="space-y-2">
                            {Object.entries(selectedDriver.financials.monthlyEarnings)
                              .sort(([a], [b]) => b.localeCompare(a))
                              .slice(0, 3)
                              .map(([month, earnings]) => (
                              <div key={month} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium">
                                  {new Date(month + '-01').toLocaleDateString('tr-TR', { 
                                    year: 'numeric', 
                                    month: 'long' 
                                  })}
                                </span>
                                <span className="text-green-600 font-semibold">₺{Math.round(earnings)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-center py-8">
                        Finansal bilgi bulunamadı
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEditDriver(selectedDriver);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Düzenle
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {showEditModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedDriver.firstName} {selectedDriver.lastName} - Düzenle
              </h2>
              <p className="text-gray-600 text-sm mt-1">Şoför bilgilerini güncelleyin</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deneyim (Yıl)</label>
                <input
                  type="number"
                  value={editForm.experienceYears}
                  onChange={(e) => setEditForm({...editForm, experienceYears: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Araç Tipleri</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Standard', 'Premium', 'Luxury', 'VIP', 'Minibus'].map((type) => (
                    <label key={type} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.vehicleTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditForm({...editForm, vehicleTypes: [...editForm.vehicleTypes, type]});
                          } else {
                            setEditForm({...editForm, vehicleTypes: editForm.vehicleTypes.filter(t => t !== type)});
                          }
                        }}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="problemDriver"
                    checked={editForm.isProblemDriver}
                    onChange={(e) => setEditForm({...editForm, isProblemDriver: e.target.checked})}
                    className="h-4 w-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="problemDriver" className="text-sm font-medium text-gray-700">
                    Problemli şoför olarak işaretle
                  </label>
                </div>

                {editForm.isProblemDriver && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Problem Notları</label>
                    <textarea
                      value={editForm.problemNotes}
                      onChange={(e) => setEditForm({...editForm, problemNotes: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Problem detaylarını açıklayın..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDriver(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDriverAdded={handleAddDriver}
      />
    </div>
  );
}