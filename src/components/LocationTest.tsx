import React from 'react';
import { safeLocationToString, formatRoute } from '../lib/utils/location-utils';

// Test data to simulate the problematic scenarios
const testData = [
  {
    pickupLocation: 'Antalya Havalimanı (AYT)',
    dropoffLocation: 'Kemer - Club Med Palmiye'
  },
  {
    pickupLocation: { name: 'Antalya Havalimanı (AYT)', lat: 36.8969, lng: 30.7133 },
    dropoffLocation: { name: 'Belek - Regnum Carya', lat: 36.8625, lng: 31.0556 }
  },
  {
    pickupLocation: null,
    dropoffLocation: undefined
  },
  {
    pickupLocation: { formatted_address: 'Antalya Airport Terminal, 07100 Antalya', lat: 36.8969, lng: 30.7133 },
    dropoffLocation: { name: 'Side Palace Hotel', formatted_address: 'Side, Antalya', lat: 36.7673, lng: 31.3890 }
  }
];

export default function LocationTest() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Location Rendering Test</h1>
      <p className="mb-4 text-gray-600">
        This page tests the safe location rendering utilities to prevent React Error #31.
      </p>

      <div className="space-y-4">
        {testData.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-2">Test Case {index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raw Pickup Data:
                </label>
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                  {JSON.stringify(item.pickupLocation, null, 2)}
                </pre>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raw Dropoff Data:
                </label>
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                  {JSON.stringify(item.dropoffLocation, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Safe Pickup Rendering:
                </label>
                <div className="bg-white p-2 rounded border">
                  {safeLocationToString(item.pickupLocation)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Safe Dropoff Rendering:
                </label>
                <div className="bg-white p-2 rounded border">
                  {safeLocationToString(item.dropoffLocation)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Route Formatting:
                </label>
                <div className="bg-white p-2 rounded border font-medium">
                  {formatRoute(item.pickupLocation, item.dropoffLocation)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">✅ Success!</h3>
        <p className="text-green-700">
          If you can see this page without any React Error #31, the location rendering fix is working correctly!
        </p>
      </div>
    </div>
  );
}