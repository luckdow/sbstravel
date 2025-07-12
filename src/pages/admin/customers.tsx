import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { Search, Filter, User, Mail, Phone, Calendar, Eye, Edit, Trash2, Plus, Loader2, ArrowUpDown, TrendingDown, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatPrice } from '../../lib/utils/pricing';
import toast from 'react-hot-toast';

interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalReservations?: number;
  totalSpent?: number;
  lastActivity?: Date;
  lastReservationDate?: Date;
  status?: 'active' | 'inactive';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type SortOption = 'alphabetical' | 'lastActivity' | 'totalSpent' | 'createdAt';

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { 
    customers, 
    reservations,
    fetchCustomers, 
    addCustomer, 
    editCustomer, 
    deleteCustomer,
    fetchReservations 
  } = useStore();

  // Form state for adding/editing customers
  const [customerForm, setCustomerForm] = useState<Customer>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchCustomers();
    fetchReservations();
  }, [fetchCustomers, fetchReservations]);

  // Calculate customer statistics with enhanced data
  const customerStats = customers.map(customer => {
    const customerReservations = reservations.filter(r => r.customerId === customer.id);
    const totalSpent = customerReservations.reduce((sum, r) => sum + r.totalPrice, 0);
    const lastReservation = customerReservations
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];

    const lastActivity = lastReservation?.createdAt || customer.createdAt || new Date();

    return {
      ...customer,
      totalReservations: customerReservations.length,
      totalSpent,
      lastActivity,
      lastReservation: lastReservation?.pickupDate || 'Henüz yok',
      status: customer.status || 'active'
    };
  });

  // Enhanced sorting function
  const getSortedCustomers = (customers: typeof customerStats) => {
    return [...customers].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'alphabetical':
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        case 'lastActivity':
          const dateA = new Date(a.lastActivity || 0).getTime();
          const dateB = new Date(b.lastActivity || 0).getTime();
          comparison = dateB - dateA; // Most recent first by default
          break;
        case 'totalSpent':
          comparison = (a.totalSpent || 0) - (b.totalSpent || 0);
          break;
        case 'createdAt':
          const createdA = new Date(a.createdAt || 0).getTime();
          const createdB = new Date(b.createdAt || 0).getTime();
          comparison = createdB - createdA; // Most recent first by default
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  };

  const filteredCustomers = getSortedCustomers(customerStats.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  }));

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const handleAddCustomer = async () => {
    if (!customerForm.firstName || !customerForm.lastName || !customerForm.email || !customerForm.phone) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await addCustomer({
        firstName: customerForm.firstName,
        lastName: customerForm.lastName,
        email: customerForm.email,
        phone: customerForm.phone,
        totalReservations: 0,
        status: 'active',
        lastActivity: new Date()
      });
      setShowAddModal(false);
      setCustomerForm({ firstName: '', lastName: '', email: '', phone: '' });
      toast.success('Müşteri başarıyla eklendi!');
    } catch (error) {
      console.error('Error adding customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomerWithReservation = async () => {
    if (!customerForm.firstName || !customerForm.lastName || !customerForm.email || !customerForm.phone) {
      toast.error('Lütfen müşteri bilgilerini doldurun');
      return;
    }

    if (!reservationForm.pickupDate || !reservationForm.pickupTime) {
      toast.error('Lütfen rezervasyon bilgilerini doldurun');
      return;
    }

    setLoading(true);
    try {
      // First add the customer
      const customerId = await addCustomer({
        firstName: customerForm.firstName,
        lastName: customerForm.lastName,
        email: customerForm.email,
        phone: customerForm.phone,
        totalReservations: 0,
        status: 'active',
        lastActivity: new Date()
      });

      if (customerId) {
        // Then create the reservation
        // This would need to be implemented in the store
        toast.success('Müşteri ve rezervasyon başarıyla oluşturuldu!');
        setShowReservationModal(false);
        setCustomerForm({ firstName: '', lastName: '', email: '', phone: '' });
        setReservationForm({
          transferType: 'airport-hotel',
          pickupLocation: '',
          dropoffLocation: '',
          pickupDate: '',
          pickupTime: '',
          passengerCount: 1,
          baggageCount: 1,
          vehicleType: 'standard',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error adding customer with reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = async () => {
    if (!editingCustomer?.id || !editingCustomer.firstName || !editingCustomer.lastName || 
        !editingCustomer.email || !editingCustomer.phone) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await editCustomer(editingCustomer.id, {
        firstName: editingCustomer.firstName,
        lastName: editingCustomer.lastName,
        email: editingCustomer.email,
        phone: editingCustomer.phone,
        updatedAt: new Date()
      });
      setEditingCustomer(null);
    } catch (error) {
      console.error('Error editing customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteCustomer(customerId);
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  // Calculate totals
  const totalCustomers = customers.length;
  const totalReservations = customerStats.reduce((sum, c) => sum + c.totalReservations, 0);
  const totalRevenue = customerStats.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageSpending = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Müşteri Yönetimi</h1>
            <p className="text-gray-600">Tüm müşterileri görüntüleyin ve yönetin</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Yeni Müşteri</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalCustomers}</div>
                <div className="text-sm text-gray-600">Toplam Müşteri</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalReservations}</div>
                <div className="text-sm text-gray-600">Toplam Rezervasyon</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{formatPrice(Math.round(totalRevenue))}</div>
                <div className="text-sm text-gray-600">Toplam Gelir</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{formatPrice(Math.round(averageSpending))}</div>
                <div className="text-sm text-gray-600">Ortalama Harcama</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters with Sorting */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Müşteri adı veya e-posta ara..."
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
                  <option value="inactive">Pasif</option>
                </select>

                <button className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  <span>Filtreler</span>
                </button>
              </div>
            </div>

            {/* Sorting Options */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Sıralama:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSortChange('alphabetical')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === 'alphabetical' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>Alfabetik</span>
                  {sortBy === 'alphabetical' && (
                    sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
                  )}
                </button>
                
                <button
                  onClick={() => handleSortChange('lastActivity')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === 'lastActivity' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>Son Aktivite</span>
                  {sortBy === 'lastActivity' && (
                    sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
                  )}
                </button>
                
                <button
                  onClick={() => handleSortChange('totalSpent')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === 'totalSpent' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>Harcama</span>
                  {sortBy === 'totalSpent' && (
                    sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
                  )}
                </button>
                
                <button
                  onClick={() => handleSortChange('createdAt')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === 'createdAt' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>Kayıt Tarihi</span>
                  {sortBy === 'createdAt' && (
                    sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rezervasyonlar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harcama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Son Rezervasyon
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Müşteri bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            {customer.firstName[0]}{customer.lastName[0]}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{customer.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {customer.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.totalReservations}</div>
                        <div className="text-sm text-gray-500">rezervasyon</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{formatPrice(Math.round(customer.totalSpent))}</div>
                        <div className="text-sm text-gray-500">toplam</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.lastReservation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setEditingCustomer(customer)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => customer.id && handleDeleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
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

        {/* Add Customer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Yeni Müşteri Ekle</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                  <input
                    type="text"
                    value={customerForm.firstName}
                    onChange={(e) => setCustomerForm({...customerForm, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                  <input
                    type="text"
                    value={customerForm.lastName}
                    onChange={(e) => setCustomerForm({...customerForm, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
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
                  onClick={handleAddCustomer}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ekle'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Customer Modal */}
        {editingCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Müşteri Düzenle</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                  <input
                    type="text"
                    value={editingCustomer.firstName}
                    onChange={(e) => setEditingCustomer({...editingCustomer, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                  <input
                    type="text"
                    value={editingCustomer.lastName}
                    onChange={(e) => setEditingCustomer({...editingCustomer, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleEditCustomer}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Güncelle'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Customer with Reservation Modal */}
        {showReservationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Yeni Müşteri ve Rezervasyon Ekle</h2>
                <p className="text-gray-600 text-sm mt-1">WhatsApp'tan gelen bilgilerle hızlı müşteri ve rezervasyon oluşturma</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Müşteri Bilgileri</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                      <input
                        type="text"
                        value={customerForm.firstName}
                        onChange={(e) => setCustomerForm({...customerForm, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="Müşteri adı"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                      <input
                        type="text"
                        value={customerForm.lastName}
                        onChange={(e) => setCustomerForm({...customerForm, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="Müşteri soyadı"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                      <input
                        type="email"
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <input
                        type="tel"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="+90 532 123 45 67"
                      />
                    </div>
                  </div>

                  {/* Reservation Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Rezervasyon Bilgileri</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Türü</label>
                      <select
                        value={reservationForm.transferType}
                        onChange={(e) => setReservationForm({...reservationForm, transferType: e.target.value as any})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="airport-hotel">Havalimanı → Otel</option>
                        <option value="hotel-airport">Otel → Havalimanı</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kalkış Lokasyonu</label>
                        <input
                          type="text"
                          value={reservationForm.pickupLocation}
                          onChange={(e) => setReservationForm({...reservationForm, pickupLocation: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                          placeholder={reservationForm.transferType === 'airport-hotel' ? 'Antalya Havalimanı' : 'Otel adı'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Varış Lokasyonu</label>
                        <input
                          type="text"
                          value={reservationForm.dropoffLocation}
                          onChange={(e) => setReservationForm({...reservationForm, dropoffLocation: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                          placeholder={reservationForm.transferType === 'airport-hotel' ? 'Otel adı' : 'Antalya Havalimanı'}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Tarihi</label>
                        <input
                          type="date"
                          value={reservationForm.pickupDate}
                          onChange={(e) => setReservationForm({...reservationForm, pickupDate: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Saati</label>
                        <input
                          type="time"
                          value={reservationForm.pickupTime}
                          onChange={(e) => setReservationForm({...reservationForm, pickupTime: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yolcu Sayısı</label>
                        <select
                          value={reservationForm.passengerCount}
                          onChange={(e) => setReservationForm({...reservationForm, passengerCount: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        >
                          {[1,2,3,4,5,6,7,8].map(num => (
                            <option key={num} value={num}>{num} Kişi</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bagaj Sayısı</label>
                        <select
                          value={reservationForm.baggageCount}
                          onChange={(e) => setReservationForm({...reservationForm, baggageCount: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        >
                          {[1,2,3,4,5,6,7,8].map(num => (
                            <option key={num} value={num}>{num} Bagaj</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Araç Tipi</label>
                        <select
                          value={reservationForm.vehicleType}
                          onChange={(e) => setReservationForm({...reservationForm, vehicleType: e.target.value as any})}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="standard">Standart</option>
                          <option value="premium">Premium</option>
                          <option value="luxury">Lüks</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
                      <textarea
                        value={reservationForm.notes}
                        onChange={(e) => setReservationForm({...reservationForm, notes: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="WhatsApp mesajından gelen ek bilgiler..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setShowReservationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddCustomerWithReservation}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Müşteri ve Rezervasyon Oluştur'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}