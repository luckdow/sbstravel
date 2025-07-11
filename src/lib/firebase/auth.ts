import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
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

// Google Auth Provider Setup
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Google Sign In with Role Validation
export const signInWithGoogle = async (requiredRole?: 'admin' | 'driver' | 'customer') => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // If a specific role is required, validate it
      if (requiredRole && userData.role !== requiredRole) {
        await signOut(auth);
        return { 
          success: false, 
          error: `Bu hesap ${requiredRole} yetkisine sahip değil` 
        };
      }
      
      return { success: true, user, role: userData.role };
    } else {
      // Create new user profile with default customer role
      const newUserData: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        role: 'customer',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', user.uid), newUserData);
      
      // If a specific role other than customer is required for new users
      if (requiredRole && requiredRole !== 'customer') {
        await signOut(auth);
        return { 
          success: false, 
          error: `Yeni Google hesapları sadece müşteri olarak kaydedilebilir. ${requiredRole} yetkisi için sistem yöneticisi ile iletişime geçin.` 
        };
      }
      
      return { success: true, user, role: 'customer' };
    }
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Google ile giriş iptal edildi' };
    } else if (error.code === 'auth/popup-blocked') {
      return { success: false, error: 'Popup engellenmiş. Lütfen popup engelleyicisini devre dışı bırakın' };
    }
    return { success: false, error: error.message || 'Google ile giriş başarısız' };
  }
};