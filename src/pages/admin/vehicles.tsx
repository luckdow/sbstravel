import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { Search, Filter, Car, Users, Luggage, DollarSign, Eye, Edit, Trash2, Plus, Upload, X, Loader2, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

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
    totalKm: 45000,
    image: '/api/placeholder/300/200',
    images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
    extraServices: ['wifi', 'water', 'magazines']
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
    totalKm: 32000,
    image: '/api/placeholder/300/200',
    images: ['/api/placeholder/300/200'],
    extraServices: ['vip-service', 'refreshments', 'wifi']
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
    totalKm: 67000,
    image: '/api/placeholder/300/200',
    images: ['/api/placeholder/300/200'],
    extraServices: ['basic-comfort']
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
  luxury: 'bg-yellow-100 text-yellow-800'
};

// Mock extra services data
const availableExtraServices = [
  { id: 'wifi', name: 'Wi-Fi', description: 'Ücretsiz internet bağlantısı', price: 5 },
  { id: 'water', name: 'Su İkramı', description: 'Soğuk su ve içecek servisi', price: 3 },
  { id: 'magazines', name: 'Dergi/Gazete', description: 'Güncel dergi ve gazeteler', price: 2 },
  { id: 'vip-service', name: 'VIP Hizmet', description: 'Özel karşılama ve hizmet', price: 25 },
  { id: 'refreshments', name: 'İkramlar', description: 'Atıştırmalık ve içecek', price: 8 },
  { id: 'basic-comfort', name: 'Temel Konfor', description: 'Klima ve müzik sistemi', price: 0 },
  { id: 'child-seat', name: 'Çocuk Koltuğu', description: 'Güvenli çocuk koltuğu', price: 10 },
  { id: 'phone-charger', name: 'Telefon Şarjı', description: 'USB ve kablosuz şarj', price: 3 }
];

interface VehicleForm {
  name: string;
  type: 'standard' | 'premium' | 'luxury';
  model: string;
  licensePlate: string;
  passengerCapacity: number;
  baggageCapacity: number;
  pricePerKm: number;
  features: string[];
  extraServices: string[];
  status: 'active' | 'maintenance' | 'inactive';
  images: File[];
  imageUrls: string[];
}

export default function AdminVehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showExtraServicesModal, setShowExtraServicesModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [viewingVehicle, setViewingVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { addVehicle, editVehicle, deleteVehicle } = useStore();

  const [vehicleForm, setVehicleForm] = useState<VehicleForm>({
    name: '',
    type: 'standard',
    model: '',
    licensePlate: '',
    passengerCapacity: 4,
    baggageCapacity: 4,
    pricePerKm: 4.5,
    features: [],
    extraServices: [],
    status: 'active',
    images: [],
    imageUrls: []
  });

  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files);
      setVehicleForm(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setVehicleForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleAddVehicle = async () => {
    if (!vehicleForm.name || !vehicleForm.model || !vehicleForm.licensePlate) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await addVehicle({
        name: vehicleForm.name,
        type: vehicleForm.type,
        model: vehicleForm.model,
        image: vehicleForm.imageUrls[0] || '/api/placeholder/300/200',
        images: vehicleForm.imageUrls,
        licensePlate: vehicleForm.licensePlate,
        passengerCapacity: vehicleForm.passengerCapacity,
        baggageCapacity: vehicleForm.baggageCapacity,
        pricePerKm: vehicleForm.pricePerKm,
        features: vehicleForm.features,
        extraServices: vehicleForm.extraServices,
        status: vehicleForm.status,
        isActive: vehicleForm.status === 'active',
        totalKilometers: 0,
        lastMaintenance: new Date()
      });

      setShowAddModal(false);
      resetForm();
      toast.success('Araç başarıyla eklendi!');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Araç eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVehicle = async () => {
    if (!editingVehicle?.id) return;

    setLoading(true);
    try {
      await editVehicle(editingVehicle.id, {
        name: vehicleForm.name,
        type: vehicleForm.type,
        model: vehicleForm.model,
        licensePlate: vehicleForm.licensePlate,
        passengerCapacity: vehicleForm.passengerCapacity,
        baggageCapacity: vehicleForm.baggageCapacity,
        pricePerKm: vehicleForm.pricePerKm,
        features: vehicleForm.features,
        extraServices: vehicleForm.extraServices,
        status: vehicleForm.status,
        images: vehicleForm.imageUrls,
        updatedAt: new Date()
      });

      setShowEditModal(false);
      setEditingVehicle(null);
      resetForm();
      toast.success('Araç başarıyla güncellendi!');
    } catch (error) {
      console.error('Error editing vehicle:', error);
      toast.error('Araç güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteVehicle(vehicleId);
        toast.success('Araç silindi!');
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        toast.error('Araç silinirken hata oluştu');
      }
    }
  };

  const handleViewVehicle = (vehicle: any) => {
    setViewingVehicle(vehicle);
    setShowViewModal(true);
  };

  const handleEditClick = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setVehicleForm({
      name: vehicle.name,
      type: vehicle.type,
      model: vehicle.model,
      licensePlate: vehicle.plate,
      passengerCapacity: vehicle.capacity,
      baggageCapacity: vehicle.baggage,
      pricePerKm: vehicle.pricePerKm,
      features: [],
      extraServices: vehicle.extraServices || [],
      status: vehicle.status,
      images: [],
      imageUrls: vehicle.images || []
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setVehicleForm({
      name: '',
      type: 'standard',
      model: '',
      licensePlate: '',
      passengerCapacity: 4,
      baggageCapacity: 4,
      pricePerKm: 4.5,
      features: [],
      extraServices: [],
      status: 'active',
      images: [],
      imageUrls: []
    });
  };

  const toggleExtraService = (serviceId: string) => {
    setVehicleForm(prev => ({
      ...prev,
      extraServices: prev.extraServices.includes(serviceId)
        ? prev.extraServices.filter(id => id !== serviceId)
        : [...prev.extraServices, serviceId]
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Araç Yönetimi</h1>
            <p className="text-gray-600">Araç filosunu görüntüleyin ve yönetin</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Yeni Araç</span>
            </button>
            <button 
              onClick={() => setShowExtraServicesModal(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Settings className="h-5 w-5" />
              <span>Ekstra Hizmetler</span>
            </button>
          </div>
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
                        <button 
                          onClick={() => handleViewVehicle(vehicle)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(vehicle)}
                          className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Sil"
                        >
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

        {/* Add Vehicle Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Yeni Araç Ekle</h2>
                <p className="text-gray-600 text-sm mt-1">Araç bilgilerini doldurun ve resim yükleyin</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Temel Bilgiler</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Araç Adı *</label>
                      <input
                        type="text"
                        value={vehicleForm.name}
                        onChange={(e) => setVehicleForm({...vehicleForm, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="Mercedes Vito Premium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                      <input
                        type="text"
                        value={vehicleForm.model}
                        onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="Mercedes Vito 2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plaka *</label>
                      <input
                        type="text"
                        value={vehicleForm.licensePlate}
                        onChange={(e) => setVehicleForm({...vehicleForm, licensePlate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="07 ABC 123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Araç Tipi</label>
                      <select
                        value={vehicleForm.type}
                        onChange={(e) => setVehicleForm({...vehicleForm, type: e.target.value as any})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="standard">Standart</option>
                        <option value="premium">Premium</option>
                        <option value="luxury">Lüks</option>
                      </select>
                    </div>
                  </div>

                  {/* Capacity and Pricing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Kapasite ve Fiyat</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yolcu Kapasitesi</label>
                        <input
                          type="number"
                          value={vehicleForm.passengerCapacity}
                          onChange={(e) => setVehicleForm({...vehicleForm, passengerCapacity: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bagaj Kapasitesi</label>
                        <input
                          type="number"
                          value={vehicleForm.baggageCapacity}
                          onChange={(e) => setVehicleForm({...vehicleForm, baggageCapacity: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="12"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat ($/km)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={vehicleForm.pricePerKm}
                        onChange={(e) => setVehicleForm({...vehicleForm, pricePerKm: parseFloat(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                      <select
                        value={vehicleForm.status}
                        onChange={(e) => setVehicleForm({...vehicleForm, status: e.target.value as any})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Aktif</option>
                        <option value="maintenance">Bakımda</option>
                        <option value="inactive">Pasif</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Araç Resimleri</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-lg font-medium text-gray-700 mb-2">Resim Yükle</div>
                      <div className="text-sm text-gray-500 mb-4">
                        PNG, JPG veya JPEG formatında, maksimum 5MB
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Resim Seç
                      </label>
                    </div>
                    {(vehicleForm.images.length > 0 || vehicleForm.imageUrls.length > 0) && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {vehicleForm.imageUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Vehicle ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        {vehicleForm.images.map((file, index) => (
                          <div key={`file-${index}`} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(vehicleForm.imageUrls.length + index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Extra Services Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Ekstra Hizmetler</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableExtraServices.map((service) => (
                      <label key={service.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={vehicleForm.extraServices.includes(service.id)}
                          onChange={() => toggleExtraService(service.id)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500">${service.price}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddVehicle}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Araç Ekle'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Vehicle Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Araç Düzenle</h2>
                <p className="text-gray-600 text-sm mt-1">Araç bilgilerini güncelleyin</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Temel Bilgiler</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Araç Adı *</label>
                      <input
                        type="text"
                        value={vehicleForm.name}
                        onChange={(e) => setVehicleForm({...vehicleForm, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                      <input
                        type="text"
                        value={vehicleForm.model}
                        onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plaka *</label>
                      <input
                        type="text"
                        value={vehicleForm.licensePlate}
                        onChange={(e) => setVehicleForm({...vehicleForm, licensePlate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Araç Tipi</label>
                      <select
                        value={vehicleForm.type}
                        onChange={(e) => setVehicleForm({...vehicleForm, type: e.target.value as any})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="standard">Standart</option>
                        <option value="premium">Premium</option>
                        <option value="luxury">Lüks</option>
                      </select>
                    </div>
                  </div>

                  {/* Capacity and Pricing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Kapasite ve Fiyat</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yolcu Kapasitesi</label>
                        <input
                          type="number"
                          value={vehicleForm.passengerCapacity}
                          onChange={(e) => setVehicleForm({...vehicleForm, passengerCapacity: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bagaj Kapasitesi</label>
                        <input
                          type="number"
                          value={vehicleForm.baggageCapacity}
                          onChange={(e) => setVehicleForm({...vehicleForm, baggageCapacity: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                          min="1"
                          max="12"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat ($/km)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={vehicleForm.pricePerKm}
                        onChange={(e) => setVehicleForm({...vehicleForm, pricePerKm: parseFloat(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                      <select
                        value={vehicleForm.status}
                        onChange={(e) => setVehicleForm({...vehicleForm, status: e.target.value as any})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Aktif</option>
                        <option value="maintenance">Bakımda</option>
                        <option value="inactive">Pasif</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Extra Services Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Ekstra Hizmetler</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableExtraServices.map((service) => (
                      <label key={service.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={vehicleForm.extraServices.includes(service.id)}
                          onChange={() => toggleExtraService(service.id)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500">${service.price}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => { setShowEditModal(false); setEditingVehicle(null); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleEditVehicle}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Güncelle'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Vehicle Modal */}
        {showViewModal && viewingVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">{viewingVehicle.name} Detayları</h2>
                <p className="text-gray-600 text-sm mt-1">Araç bilgileri ve özellikleri</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vehicle Images */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Araç Resimleri</h3>
                    <div className="space-y-3">
                      {viewingVehicle.images?.map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${viewingVehicle.name} ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )) || (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">Resim bulunmuyor</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Araç Bilgileri</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{viewingVehicle.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plaka:</span>
                        <span className="font-medium">{viewingVehicle.plate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tip:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${typeColors[viewingVehicle.type as keyof typeof typeColors]}`}>
                          {viewingVehicle.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Yolcu Kapasitesi:</span>
                        <span className="font-medium">{viewingVehicle.capacity} kişi</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bagaj Kapasitesi:</span>
                        <span className="font-medium">{viewingVehicle.baggage} bagaj</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fiyat:</span>
                        <span className="font-medium text-green-600">${viewingVehicle.pricePerKm}/km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durum:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[viewingVehicle.status as keyof typeof statusColors]}`}>
                          {statusLabels[viewingVehicle.status as keyof typeof statusLabels]}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Toplam KM:</span>
                        <span className="font-medium">{viewingVehicle.totalKm?.toLocaleString()} km</span>
                      </div>
                      {viewingVehicle.driverName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Atanan Şoför:</span>
                          <span className="font-medium">{viewingVehicle.driverName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Extra Services */}
                {viewingVehicle.extraServices && viewingVehicle.extraServices.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ekstra Hizmetler</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingVehicle.extraServices.map((serviceId: string) => {
                        const service = availableExtraServices.find(s => s.id === serviceId);
                        return service ? (
                          <span key={serviceId} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {service.name} ${service.price}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => { setShowViewModal(false); setViewingVehicle(null); }}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Extra Services Management Modal */}
        {showExtraServicesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Ekstra Hizmetler Yönetimi</h2>
                <p className="text-gray-600 text-sm mt-1">Mevcut ekstra hizmetleri görüntüleyin ve yönetin</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {availableExtraServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <p className="text-sm font-medium text-green-600">${service.price}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-2 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-2 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center justify-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Yeni Ekstra Hizmet Ekle
                  </button>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowExtraServicesModal(false)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}