import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { Search, Plus, Edit, Trash2, Car, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

export default function AdminVehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const { 
    vehicles, 
    fetchVehicles, 
    addVehicle, 
    editVehicle, 
    deleteVehicle
  } = useStore();

  // Form state for adding/editing vehicles
  const [vehicleForm, setVehicleForm] = useState({
    type: 'standard',
    name: '',
    model: '',
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
    licensePlate: '',
    passengerCapacity: 4,
    baggageCapacity: 4,
    pricePerKm: 4.5,
    features: ['Klima', 'Müzik Sistemi'],
    status: 'active',
    isActive: true
  });

  // Feature options for selection
  const featureOptions = [
    'Klima', 'Müzik Sistemi', 'Wi-Fi', 'USB Şarj', 'Deri Koltuk', 
    'Premium İç Dizayn', 'Su İkramı', 'Gazete', 'Tablet', 'VIP Karşılama'
  ];

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vehicle.licensePlate && vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddVehicle = async () => {
    if (!vehicleForm.name || !vehicleForm.model || !vehicleForm.licensePlate) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await addVehicle({
        ...vehicleForm,
        images: [vehicleForm.image]
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
    if (!selectedVehicle || !vehicleForm.name || !vehicleForm.model || !vehicleForm.licensePlate) {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await editVehicle(selectedVehicle.id, {
        ...vehicleForm,
        images: [vehicleForm.image]
      });
      
      setShowEditModal(false);
      setSelectedVehicle(null);
      toast.success('Araç başarıyla güncellendi!');
    } catch (error) {
      console.error('Error editing vehicle:', error);
      toast.error('Araç güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Bu aracı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteVehicle(id);
        toast.success('Araç başarıyla silindi!');
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        toast.error('Araç silinirken hata oluştu');
      }
    }
  };

  const openEditModal = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setVehicleForm({
      type: vehicle.type,
      name: vehicle.name,
      model: vehicle.model,
      image: vehicle.image,
      licensePlate: vehicle.licensePlate || '',
      passengerCapacity: vehicle.passengerCapacity,
      baggageCapacity: vehicle.baggageCapacity,
      pricePerKm: vehicle.pricePerKm,
      features: vehicle.features,
      status: vehicle.status || 'active',
      isActive: vehicle.isActive
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setVehicleForm({
      type: 'standard',
      name: '',
      model: '',
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
      licensePlate: '',
      passengerCapacity: 4,
      baggageCapacity: 4,
      pricePerKm: 4.5,
      features: ['Klima', 'Müzik Sistemi'],
      status: 'active',
      isActive: true
    });
  };

  const toggleFeature = (feature: string) => {
    if (vehicleForm.features.includes(feature)) {
      setVehicleForm({
        ...vehicleForm,
        features: vehicleForm.features.filter(f => f !== feature)
      });
    } else {
      setVehicleForm({
        ...vehicleForm,
        features: [...vehicleForm.features, feature]
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Araç Yönetimi</h1>
            <p className="text-gray-600">Transfer araçlarını yönetin ve yeni araç ekleyin</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Yeni Araç Ekle</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Araç adı, model veya plaka ara..."
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
                <option value="active">Aktif</option>
                <option value="maintenance">Bakımda</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-600">Araçlar yükleniyor...</span>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Araç bulunamadı</p>
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Vehicle Image */}
                <div className="relative h-48">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                      vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status === 'active' ? 'Aktif' :
                       vehicle.status === 'maintenance' ? 'Bakımda' : 'Pasif'}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
                      {vehicle.type}
                    </div>
                  </div>
                </div>
                
                {/* Vehicle Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{vehicle.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{vehicle.model}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">{vehicle.passengerCapacity} Kişi</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">{vehicle.baggageCapacity} Bagaj</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                        {feature}
                      </span>
                    ))}
                    {vehicle.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                        +{vehicle.features.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-lg font-bold text-green-600">${vehicle.pricePerKm.toFixed(2)}/km</div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(vehicle)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Vehicle Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Yeni Araç Ekle</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Araç Adı</label>
                    <input
                      type="text"
                      value={vehicleForm.name}
                      onChange={(e) => setVehicleForm({...vehicleForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Örn: Mercedes Vito"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={vehicleForm.model}
                      onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Örn: 2023 Model"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plaka</label>
                  <input
                    type="text"
                    value={vehicleForm.licensePlate}
                    onChange={(e) => setVehicleForm({...vehicleForm, licensePlate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: 07 ABC 123"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Yolcu Kapasitesi</label>
                    <input
                      type="number"
                      value={vehicleForm.passengerCapacity}
                      onChange={(e) => setVehicleForm({...vehicleForm, passengerCapacity: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="20"
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
                      max="20"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">KM Başı Fiyat ($)</label>
                  <input
                    type="number"
                    value={vehicleForm.pricePerKm}
                    onChange={(e) => setVehicleForm({...vehicleForm, pricePerKm: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    min="0.1"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
                  <input
                    type="text"
                    value={vehicleForm.image}
                    onChange={(e) => setVehicleForm({...vehicleForm, image: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Özellikler</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {featureOptions.map((feature) => (
                      <label key={feature} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={vehicleForm.features.includes(feature)}
                          onChange={() => toggleFeature(feature)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-900">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddVehicle}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Ekle'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Vehicle Modal */}
        {showEditModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Araç Düzenle</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Araç Adı</label>
                    <input
                      type="text"
                      value={vehicleForm.name}
                      onChange={(e) => setVehicleForm({...vehicleForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={vehicleForm.model}
                      onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plaka</label>
                  <input
                    type="text"
                    value={vehicleForm.licensePlate}
                    onChange={(e) => setVehicleForm({...vehicleForm, licensePlate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Yolcu Kapasitesi</label>
                    <input
                      type="number"
                      value={vehicleForm.passengerCapacity}
                      onChange={(e) => setVehicleForm({...vehicleForm, passengerCapacity: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="20"
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
                      max="20"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">KM Başı Fiyat ($)</label>
                  <input
                    type="number"
                    value={vehicleForm.pricePerKm}
                    onChange={(e) => setVehicleForm({...vehicleForm, pricePerKm: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    min="0.1"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
                  <input
                    type="text"
                    value={vehicleForm.image}
                    onChange={(e) => setVehicleForm({...vehicleForm, image: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Özellikler</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {featureOptions.map((feature) => (
                      <label key={feature} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={vehicleForm.features.includes(feature)}
                          onChange={() => toggleFeature(feature)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-900">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleEditVehicle}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Güncelle'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}