import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'driver' | 'customer';
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: Date;
}

// Admin Login
export const adminLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (userDoc.exists() && userDoc.data().role === 'admin') {
      return { success: true, user: userCredential.user };
    } else {
      await signOut(auth);
      return { success: false, error: 'Admin yetkisi bulunamadı' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Driver Login
export const driverLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (userDoc.exists() && userDoc.data().role === 'driver') {
      return { success: true, user: userCredential.user };
    } else {
      await signOut(auth);
      return { success: false, error: 'Şoför yetkisi bulunamadı' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Customer Login/Register
export const customerAuth = async (email: string, password: string, isRegister: boolean = false) => {
  try {
    let userCredential;
    
    if (isRegister) {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user profile
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role: 'customer',
        createdAt: new Date()
      });
    } else {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    }
    
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Auth State Observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};