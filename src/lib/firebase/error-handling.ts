import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';

export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2
};

export class FirebaseErrorHandler {
  static getErrorMessage(error: any): string {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'unavailable':
          return 'Firebase servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
        case 'permission-denied':
          return 'Bu işlem için yetkiniz bulunmuyor.';
        case 'not-found':
          return 'İstenen veri bulunamadı.';
        case 'already-exists':
          return 'Bu veri zaten mevcut.';
        case 'failed-precondition':
          return 'Veri tutarlılık sorunu. Lütfen sayfayı yenileyin.';
        case 'deadline-exceeded':
          return 'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.';
        case 'resource-exhausted':
          return 'Servis kapasitesi aşıldı. Lütfen daha sonra tekrar deneyin.';
        case 'unauthenticated':
          return 'Kimlik doğrulama gerekli. Lütfen giriş yapın.';
        default:
          return `Firebase hatası: ${error.message}`;
      }
    }
    
    if (error.message?.includes('timeout')) {
      return 'Bağlantı zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.';
    }
    
    if (error.message?.includes('network')) {
      return 'Ağ bağlantı sorunu. İnternet bağlantınızı kontrol edin.';
    }
    
    return error.message || 'Bilinmeyen bir hata oluştu.';
  }

  static withRetry = async <T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {},
    context: string = 'Firebase işlemi'
  ): Promise<T> => {
    const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: any;
    
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === config.maxRetries) {
          break;
        }
        
        // Don't retry on permission errors or invalid data
        if (error instanceof FirebaseError) {
          if (['permission-denied', 'invalid-argument', 'not-found'].includes(error.code)) {
            break;
          }
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffFactor, attempt),
          config.maxDelay
        );
        
        console.warn(`${context} başarısız (deneme ${attempt + 1}/${config.maxRetries + 1}), ${delay}ms sonra tekrar deneniyor:`, error);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    const errorMessage = this.getErrorMessage(lastError);
    console.error(`${context} ${config.maxRetries + 1} denemeden sonra başarısız:`, lastError);
    toast.error(errorMessage);
    throw lastError;
  }

  static withTimeout = async <T>(
    operation: () => Promise<T>,
    timeoutMs: number = 10000,
    timeoutMessage: string = 'İşlem zaman aşımına uğradı'
  ): Promise<T> => {
    const timeoutPromise = new Promise<never>((resolve, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    });
    
    return Promise.race([operation(), timeoutPromise]);
  }

  static createLoadingToast(message: string): string {
    return toast.loading(message);
  }

  static updateToast(toastId: string, message: string, type: 'success' | 'error' = 'success'): void {
    if (type === 'success') {
      toast.success(message, { id: toastId });
    } else {
      toast.error(message, { id: toastId });
    }
  }
}

export const withFirebaseErrorHandling = FirebaseErrorHandler.withRetry;
export const withTimeout = FirebaseErrorHandler.withTimeout;