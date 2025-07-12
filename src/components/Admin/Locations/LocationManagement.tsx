import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, MapPin, Navigation, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../../../store/useStore';

interface Location {
  id: string;
  name: string;
  region: string;
  distance: number;
  lat: number;
  lng: number;
}

export default function LocationManagement() {
  const { locations, fetchLocations, addLocation, editLocation, deleteLocation } = useStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    distance: 0,
    lat: 0,
    lng: 0
  });
  
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleAddLocation = async () => {
    if (!formData.name || !formData.region || formData.distance <= 0) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await addLocation(formData);
      toast.success('Lokasyon başarıyla eklendi');
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Lokasyon eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocation = async () => {
    if (!selectedLocation || !formData.name || !formData.region || formData.distance <= 0) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await editLocation(selectedLocation.id, formData);
      
      toast.success('Lokasyon başarıyla güncellendi');
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Lokasyon güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (window.confirm('Bu lokasyonu silmek istediğinizden emin misiniz?')) {
      setLoading(true);
      try {
        await deleteLocation(id);
        
        toast.success('Lokasyon başarıyla silindi');
      } catch (error) {
        console.error('Error deleting location:', error);
        toast.error('Lokasyon silinirken hata oluştu');
      } finally {
        setLoading(false);
      }
    }
  };

  const openEditModal = (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      region: location.region || '',
      distance: location.distance || 0,
      lat: location.lat,
      lng: location.lng
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      region: '',
      distance: 0,
      lat: 0,
      lng: 0
    });
    setSelectedLocation(null);
  };

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (location.region && location.region.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lokasyon Yönetimi</h1>
          <p className="text-gray-600">Transfer lokasyonlarını yönetin</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Yeni Lokasyon</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Lokasyon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasyon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bölge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Havalimanına Mesafe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Koordinatlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-2 text-gray-500">Lokasyonlar yükleniyor...</p>
                  </td>
                </tr>
              ) : filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Arama kriterlerine uygun lokasyon bulunamadı' : 'Henüz lokasyon eklenmemiş'}
                  </td>
                </tr>
              ) : (
                filteredLocations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{location.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{location.region || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{location.distance} km</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openEditModal(location)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(location.id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
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

      {/* Add Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Yeni Lokasyon Ekle</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasyon Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Kemer - Club Med Palmiye"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bölge</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Kemer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Havalimanına Mesafe (km)</label>
                <input
                  type="number"
                  value={formData.distance}
                  onChange={(e) => setFormData({...formData, distance: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: 45"
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enlem (Latitude)</label>
                  <input
                    type="number"
                    value={formData.lat}
                    onChange={(e) => setFormData({...formData, lat: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: 36.6048"
                    step="0.0001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Boylam (Longitude)</label>
                  <input
                    type="number"
                    value={formData.lng}
                    onChange={(e) => setFormData({...formData, lng: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: 30.5606"
                    step="0.0001"
                  />
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Koordinat Bilgisi</p>
                  <p>Koordinatları Google Maps'ten alabilirsiniz. Doğru koordinatlar, harita üzerinde doğru konumlandırma için önemlidir.</p>
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
                onClick={handleAddLocation}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Location Modal */}
      {showEditModal && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Lokasyon Düzenle</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasyon Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bölge</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Havalimanına Mesafe (km)</label>
                <input
                  type="number"
                  value={formData.distance}
                  onChange={(e) => setFormData({...formData, distance: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enlem (Latitude)</label>
                  <input
                    type="number"
                    value={formData.lat}
                    onChange={(e) => setFormData({...formData, lat: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    step="0.0001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Boylam (Longitude)</label>
                  <input
                    type="number"
                    value={formData.lng}
                    onChange={(e) => setFormData({...formData, lng: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    step="0.0001"
                  />
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
                onClick={handleEditLocation}
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
  );
}