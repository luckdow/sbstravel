export interface CustomerSession {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const CUSTOMER_SESSION_KEY = 'sbs_customer_session';

export const setCustomerSession = (customerData: CustomerSession): void => {
  try {
    console.log('Setting customer session:', customerData);
    localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify({
      ...customerData,
      createdAt: customerData.createdAt.toISOString()
    }));
  } catch (error) {
    console.error('Error saving customer session:', error);
  }
};

export const getCustomerSession = (): CustomerSession | null => {
  try {
    const sessionData = localStorage.getItem(CUSTOMER_SESSION_KEY);
    if (!sessionData) return null;
    
    const parsed = JSON.parse(sessionData);
    console.log('Retrieved customer session:', parsed);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt)
    };
  } catch (error) {
    console.error('Error retrieving customer session:', error);
    return null;
  }
};

export const clearCustomerSession = (): void => {
  try {
    console.log('Clearing customer session');
    localStorage.removeItem(CUSTOMER_SESSION_KEY);
  } catch (error) {
    console.error('Error clearing customer session:', error);
  }
};

export const isCustomerSessionValid = (): boolean => {
  const session = getCustomerSession();
  if (!session) {
    console.log('No customer session found');
    return false;
  }

  // Check if user is authenticated with authService
  const authState = authService.getAuthState();
  if (authState.isAuthenticated && authState.user?.role === 'customer') {
    console.log('User is authenticated with authService');
    return true;
  }
  
  // Session is valid for 24 hours
  const now = new Date();
  const sessionAge = now.getTime() - session.createdAt.getTime();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  const isValid = sessionAge < maxAge;
  console.log('Customer session age:', sessionAge / (60 * 60 * 1000), 'hours, valid:', isValid);
  return isValid;
};