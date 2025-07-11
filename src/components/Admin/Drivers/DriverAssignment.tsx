import React, { useState } from 'react';
import { User, MapPin, Clock, Car, Phone, Star, UserPlus, Check } from 'lucide-react';

const pendingReservations = [
  {
    id: 'RES-003',
    customer: 'Hans Mueller',
    route: 'AYT → Side',
    date: '2024-01-15',
    time: '18:15',
    vehicle: 'Standard',
    price: '$65',
    passengers: 3,
    distance: '45 km'
  },
  {
    id: 'RES-006',
    customer: 'Elena Popov',
    route: 'AYT → Belek',
    date: '2024-01-16',
    time: '10:30',
    vehicle: 'Premium',
    price: '$85',
    passengers: 4,
    distance: '35 km'
  },
  {
    id: 'RES-007',
    customer: 'Ahmed Hassan',
    route: 'Kemer → AYT',
    date: '2024-01-16',
    time: '14:00',
    vehicle: 'Luxury',
    price: '$120',
    passengers: 2,
    distance: '50 km'
  }
];

const availableDrivers = [
  {
    id: 1,
    name: 'Mehmet Demir',
    phone: '+90 532 123 4567',
    rating: 4.8,
    completedTrips: 156,
    vehicleType: 'Premium',
    location: 'Antalya Merkez',
    status: 'available',
    earnings: '$2,340'
  },
  {
    id: 2,
    name: 'Ali Kaya',
    phone: '+90 533 234 5678',
    rating: 4.9,
    completedTrips: 203,
    vehicleType: 'Luxury',
    location: 'Kemer',
    status: 'available',
    earnings: '$3,120'
  },
  {
    id: 3,
    name: 'Osman Çelik',
    phone: '+90 534 345 6789',
    rating: 4.7,
    completedTrips: 89,
    vehicleType: 'Standard',
    location: 'Belek',
    status: 'available',
    earnings: '$1,890'
  },
  {
    id: 4,
    name: 'Fatih Özkan',
    phone: '+90 535 456 7890',
    rating: 4.6,
    completedTrips: 134,
    vehicleType: 'Premium',
    location: 'Side',
    status: 'available',
    earnings: '$2,560'
  }
];

export default function DriverAssignment() {
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const handleAssignment = () => {
    if (selectedReservation && selectedDriver) {
      alert(`${selectedDriver.name} şoförü ${selectedReservation.id} rezervasyonuna atandı!`);
      setSelectedReservation(null);
      setSelectedDriver(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Şoför Atama</h1>
        <p className="text-gray-600">Bekleyen rezervasyonlara şoför atayın</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Reservations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Bekleyen Rezervasyonlar</h2>
            <p className="text-sm text-gray-600">Şoför ataması bekleyen transferler</p>
          </div>
          
          <div className="p-6 space-y-4">
            {pendingReservations.map((reservation) => (
              <div 
                key={reservation.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedReservation?.id === reservation.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedReservation(reservation)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-gray-800">{reservation.id}</div>
                  <div className="text-lg font-bold text-green-600">{reservation.price}</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <User className="h-4 w-4 mr-2" />
                    {reservation.customer}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-4 w-4 mr-2" />
                    {reservation.route} ({reservation.distance})
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-2" />
                    {reservation.date} - {reservation.time}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Car className="h-4 w-4 mr-2" />
                    {reservation.vehicle} - {reservation.passengers} kişi
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Drivers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Müsait Şoförler</h2>
            <p className="text-sm text-gray-600">Atama yapılabilecek şoförler</p>
          </div>
          
          <div className="p-6 space-y-4">
            {availableDrivers.map((driver) => (
              <div 
                key={driver.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedDriver?.id === driver.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDriver(driver)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{driver.name}</div>
                      <div className="text-sm text-gray-500">{driver.vehicleType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{driver.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">{driver.completedTrips} transfer</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-4 w-4 mr-2" />
                    {driver.phone}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-4 w-4 mr-2" />
                    {driver.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bu ay kazanç:</span>
                    <span className="font-semibold text-green-600">{driver.earnings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assignment Panel */}
      {selectedReservation && selectedDriver && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Atama Onayı</h3>
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="font-medium">Hazır</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Rezervasyon</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">ID:</span> {selectedReservation.id}</div>
                <div><span className="font-medium">Müşteri:</span> {selectedReservation.customer}</div>
                <div><span className="font-medium">Güzergah:</span> {selectedReservation.route}</div>
                <div><span className="font-medium">Tarih/Saat:</span> {selectedReservation.date} - {selectedReservation.time}</div>
                <div><span className="font-medium">Fiyat:</span> {selectedReservation.price}</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Şoför</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Ad:</span> {selectedDriver.name}</div>
                <div><span className="font-medium">Telefon:</span> {selectedDriver.phone}</div>
                <div><span className="font-medium">Araç Tipi:</span> {selectedDriver.vehicleType}</div>
                <div><span className="font-medium">Puan:</span> {selectedDriver.rating}/5</div>
                <div><span className="font-medium">Konum:</span> {selectedDriver.location}</div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={handleAssignment}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Atamayı Onayla</span>
            </button>
            <button 
              onClick={() => {
                setSelectedReservation(null);
                setSelectedDriver(null);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}