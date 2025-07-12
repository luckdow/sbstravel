import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Tag, Loader2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExtraService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'comfort' | 'assistance' | 'special';
  isActive: boolean;
  applicableVehicleTypes: ('standard' | 'premium' | 'luxury')[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock extra services data
const mockExtraServices: ExtraService[] = [
  {
    id: 'svc-001',
    name: 'Bebek Koltuğu',
    description: 'Bebekler için güvenli koltuk',
    price: 10,
    category: 'comfort',
    isActive: true,
    applicableVehicleTypes: ['standard', 'premium', 'luxury'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 'svc-002',
    name: 'Yükseltici Koltuk',
    description: 'Çocuklar için yükseltici koltuk',
    price: 8,
    category: 'comfort',
    isActive: true,
    applicableVehicleTypes: ['standard', 'premium', 'luxury'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 'svc-003',
    name: 'Karşılama Tabelası',
    description: 'İsminizle karşılama tabelası',
    price: 15,
    category: 'assistance',
    isActive: true,
    applicableVehicleTypes: ['premium', 'luxury'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 'svc-004',
    name: 'Ek Durak',
    description: 'Rota üzerinde ek durak',
    price: 20,
    category: 'special',
    isActive: true,
    applicableVehicleTypes: ['standard', 'premium', 'luxury'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 'svc-005',
    name: 'Bekleme Süresi',
    description: 'Her 30 dakika için bekleme ücreti',
    price: 25,
    category: 'special',
    isActive: true,
    applicableVehicleTypes: ['standard', 'premium', 'luxury'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 'svc-006',
    name: 'Premium Su İkramı',
    description: 'Yolculuk boyunca premium su ikramı',
    price: 5,
    category: 'comfort',
    isActive: false,
    applicableVehicleTypes: ['premium', 'luxury'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  }
];

export default function ExtraServiceManagement() {
  const [services, setServices] = useState<ExtraService[]>(mockExtraServices);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ExtraService | null>(null);
  const [formData, setFormData] = useState<Omit<ExtraService, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    price: 0,
    category: 'comfort',
    isActive: true,
    applicableVehicleTypes: ['standard', 'premium', 'luxury']
  });

  const handleAddService = async () => {
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      // Create a new service with a unique ID
      const newService: ExtraService = {
        id: `svc-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        isActive: formData.isActive,
        applicableVehicleTypes: formData.applicableVehicleTypes,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add to local state
      setServices([...services, newService]);
      
      toast.success('Ek hizmet başarıyla eklendi');
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Ek hizmet eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = async () => {
    if (!selectedService || !formData.name || !formData.description || formData.price <= 0) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      // Update service in local state
      setServices(services.map(service => 
        service.id === selectedService.id 
          ? {
              ...service,
              ...formData,
              updatedAt: new Date()
            }
          : service
      ));
      
      toast.success('Ek hizmet başarıyla güncellendi');
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Ek hizmet güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Bu ek hizmeti silmek istediğinizden emin misiniz?')) {
      setLoading(true);
      try {
        // Remove service from local state
        setServices(services.filter(service => service.id !== id));
        
        toast.success('Ek hizmet başarıyla silindi');
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Ek hizmet silinirken hata oluştu');
      } finally {
        setLoading(false);
      }
    }
  };

  const openEditModal = (service: ExtraService) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      isActive: service.isActive,
      applicableVehicleTypes: service.applicableVehicleTypes
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'comfort',
      isActive: true,
      applicableVehicleTypes: ['standard', 'premium', 'luxury']
    });
    setSelectedService(null);
  };

  const handleVehicleTypeToggle = (type: 'standard' | 'premium' | 'luxury') => {
    if (formData.applicableVehicleTypes.includes(type)) {
      setFormData({
        ...formData,
        applicableVehicleTypes: formData.applicableVehicleTypes.filter(t => t !== type)
      });
    } else {
      setFormData({
        ...formData,
        applicableVehicleTypes: [...formData.applicableVehicleTypes, type]
      });
    }
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'comfort': return 'Konfor';
      case 'assistance': return 'Yardım';
      case 'special': return 'Özel';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'comfort': return 'bg-blue-100 text-blue-800';
      case 'assistance': return 'bg-green-100 text-green-800';
      case 'special': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ek Hizmet Yönetimi</h1>
          <p className="text-gray-600">Transfer sırasında sunulan ek hizmetleri yönetin</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Yeni Ek Hizmet</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Ek hizmet ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hizmet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Araç Tipleri
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-2 text-gray-500">Ek hizmetler yükleniyor...</p>
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Arama kriterlerine uygun ek hizmet bulunamadı' : 'Henüz ek hizmet eklenmemiş'}
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 text-blue-600 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{service.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">${service.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(service.category)}`}>
                        {getCategoryLabel(service.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {service.applicableVehicleTypes.map((type) => (
                          <span key={type} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openEditModal(service)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id!)}
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

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Yeni Ek Hizmet Ekle</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hizmet Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Bebek Koltuğu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Hizmet açıklaması"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: 10"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="comfort">Konfor</option>
                  <option value="assistance">Yardım</option>
                  <option value="special">Özel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uygulanabilir Araç Tipleri</label>
                <div className="space-y-2">
                  {['standard', 'premium', 'luxury'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.applicableVehicleTypes.includes(type as any)}
                        onChange={() => handleVehicleTypeToggle(type as any)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Aktif</span>
                </label>
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
                onClick={handleAddService}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Ek Hizmet Düzenle</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hizmet Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="comfort">Konfor</option>
                  <option value="assistance">Yardım</option>
                  <option value="special">Özel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uygulanabilir Araç Tipleri</label>
                <div className="space-y-2">
                  {['standard', 'premium', 'luxury'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.applicableVehicleTypes.includes(type as any)}
                        onChange={() => handleVehicleTypeToggle(type as any)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Aktif</span>
                </label>
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
                onClick={handleEditService}
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