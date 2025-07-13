import { useState, useEffect, useMemo } from 'react';
import { Car, Loader2, Shield, Users, Luggage } from 'lucide-react';
import { db } from '../../lib/firebase'; // Adjust path as needed
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function VehicleSelection({
  selectedVehicle,
  onVehicleSelect,
  passengerCount = 1,
  baggageCount = 1,
  vehicles: providedVehicles // We'll handle both cases: externally provided vehicles or fetch them here
}) {
  const [loading, setLoading] = useState(!providedVehicles);
  const [fetchedVehicles, setFetchedVehicles] = useState([]);
  const [error, setError] = useState(null);

  // If vehicles aren't provided externally, fetch them directly
  useEffect(() => {
    if (!providedVehicles) {
      const fetchVehicles = async () => {
        try {
          setLoading(true);
          const vehiclesRef = collection(db, 'vehicles');
          // Explicitly query for active vehicles
          const activeVehiclesQuery = query(vehiclesRef, where("status", "==", "active"), where("isActive", "==", true));
          const snapshot = await getDocs(activeVehiclesQuery);
          
          const activeVehicles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          console.log("Loaded active vehicles:", activeVehicles);
          setFetchedVehicles(activeVehicles);
        } catch (err) {
          console.error("Error loading vehicles:", err);
          setError("Araçlar yüklenirken bir hata oluştu.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchVehicles();
    }
  }, [providedVehicles]);

  // Use either provided vehicles or fetched ones
  const allVehicles = providedVehicles || fetchedVehicles;
  
  // Log the vehicles we're working with for debugging
  useEffect(() => {
    console.log("Vehicle data available:", allVehicles);
    if (allVehicles?.length === 0) {
      console.warn("No vehicles available to display");
    }
  }, [allVehicles]);

  // Filter vehicles for display based on status and active flag
  const vehiclesToDisplay = useMemo(() => {
    if (!allVehicles) return [];
    
    // Ensure we properly handle both data models (with status field or isActive field)
    const filtered = allVehicles.filter(v => 
      (v.status === 'active' || v.status === undefined) && 
      (v.isActive === true || v.isActive === undefined)
    );
    
    console.log("Filtered vehicles for display:", filtered);
    return filtered;
  }, [allVehicles]);

  // Function to determine if a vehicle is suitable for the booking
  const isVehicleSuitable = (vehicle) => {
    return (
      (vehicle.passengerCapacity >= passengerCount) &&
      (vehicle.baggageCapacity >= baggageCount)
    );
  };

  // Show loader while fetching
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Araç Seçimi</h2>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Araç bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Araç Seçimi</h2>
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // If vehicles array exists but is empty, show appropriate message
  if (vehiclesToDisplay.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Araç Seçimi</h2>
        <div className="text-center py-8">
          <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Şu anda aktif araç bulunmuyor.</p>
          <p className="text-sm text-gray-400 mt-2">Lütfen daha sonra tekrar deneyin veya yönetici ile iletişime geçin.</p>
        </div>
      </div>
    );
  }

  // Main component rendering with vehicles
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Araç Seçimi</h2>
      
      {/* 3-column grid layout for horizontal minimal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehiclesToDisplay.map((vehicle) => {
          const isSuitable = isVehicleSuitable(vehicle);
          const isSelected = selectedVehicle === vehicle.type || selectedVehicle === vehicle.id;

          return (
            <div
              key={vehicle.id || vehicle.type}
              className={`relative border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                  : isSuitable
                  ? 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  : 'border-gray-200 opacity-60'
              }`}
              onClick={() => isSuitable && onVehicleSelect(vehicle.id || vehicle.type)}
            >
              {/* Content */}
              <div className="p-4">
                {/* Vehicle Image */}
                <div className="mb-3 h-24 overflow-hidden rounded-lg">
                  <img 
                    src={vehicle.image || vehicle.images?.[0] || 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                    alt={vehicle.name}
                    className="w-full h-24 object-cover"
                  />
                </div>

                {/* Package Name from admin panel */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    {vehicle.name}
                  </h3>
                  {vehicle.model && (
                    <p className="text-sm text-gray-600">{vehicle.model}</p>
                  )}
                </div>

                {/* Dynamic features from admin panel as small badges */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {vehicle.features && vehicle.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Passenger/baggage capacity with small icons from admin panel */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    vehicle.passengerCapacity >= passengerCount
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    <Users className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">{vehicle.passengerCapacity}</span>
                  </div>
                  <div className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    vehicle.baggageCapacity >= baggageCount
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    <Luggage className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">{vehicle.baggageCapacity}</span>
                  </div>
                </div>

                {/* Selection Status */}
                {isSelected && (
                  <div className="text-center">
                    <div className="text-xs font-semibold text-blue-600">
                      ✓ Seçildi
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info - minimal */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <h4 className="font-bold text-gray-800 mb-2 text-center">Tüm Araçlarda Dahil:</h4>
        <div className="flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">Sigorta</span>
          </div>
          <div className="flex items-center space-x-2">
            <Car className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-700">Yakıt</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-gray-700">Profesyonel Sürücü</span>
          </div>
        </div>
      </div>
    </div>
  );
}
