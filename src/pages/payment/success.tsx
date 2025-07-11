import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentSuccess from '../../components/Payment/PaymentSuccess';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  
  // Mock data - in real implementation, fetch from API using transaction ID
  const paymentResult = {
    transactionId: searchParams.get('transaction_id') || 'TXN_123456',
    amount: 85.00,
    currency: 'USD',
    orderId: searchParams.get('order_id') || 'RES-001',
    timestamp: new Date().toISOString()
  };

  const reservationData = {
    id: 'RES-001',
    customerName: 'Ahmet Yılmaz',
    route: 'Antalya Havalimanı → Kemer',
    date: '2024-01-15',
    time: '14:30',
    qrCode: 'QR_' + Date.now()
  };

  return (
    <PaymentSuccess 
      paymentResult={paymentResult}
      reservationData={reservationData}
    />
  );
}