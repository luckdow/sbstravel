import { addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { commissionsRef } from './collections';
import { COMMISSION_RATES } from '../../utils/pricing';

export interface Commission {
  id?: string;
  reservationId: string;
  driverId: string;
  totalAmount: number;
  companyShare: number;
  driverShare: number;
  status: 'pending' | 'paid';
  createdAt: Date;
  paidAt?: Date;
}

export const createCommission = async (
  reservationId: string,
  driverId: string,
  totalAmount: number
) => {
  const companyShare = totalAmount * COMMISSION_RATES.company;
  const driverShare = totalAmount * COMMISSION_RATES.driver;

  const commissionData = {
    reservationId,
    driverId,
    totalAmount,
    companyShare,
    driverShare,
    status: 'pending' as const,
    createdAt: Timestamp.now()
  };

  const docRef = await addDoc(commissionsRef, commissionData);
  return docRef.id;
};

export const getDriverCommissions = async (driverId: string, status?: 'pending' | 'paid') => {
  let q = query(commissionsRef, where('driverId', '==', driverId));
  
  if (status) {
    q = query(q, where('status', '==', status));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Commission[];
};

export const calculateDriverEarnings = async (driverId: string, period?: 'week' | 'month') => {
  const commissions = await getDriverCommissions(driverId);
  
  let filteredCommissions = commissions;
  
  if (period) {
    const now = new Date();
    const startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }
    
    filteredCommissions = commissions.filter(commission => 
      commission.createdAt >= startDate
    );
  }
  
  const totalEarnings = filteredCommissions.reduce((sum, commission) => 
    sum + commission.driverShare, 0
  );
  
  const pendingEarnings = filteredCommissions
    .filter(commission => commission.status === 'pending')
    .reduce((sum, commission) => sum + commission.driverShare, 0);
  
  const paidEarnings = filteredCommissions
    .filter(commission => commission.status === 'paid')
    .reduce((sum, commission) => sum + commission.driverShare, 0);
  
  return {
    totalEarnings,
    pendingEarnings,
    paidEarnings,
    commissionCount: filteredCommissions.length
  };
};