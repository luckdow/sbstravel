import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('React Error Boundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    // Special handling for React Error #31 (object rendering)
    if (error.message && error.message.includes('Objects are not valid as a React child')) {
      console.error('🔍 React Error #31 detected - Object rendering in JSX');
      console.error('💡 This usually means an object is being rendered directly in JSX instead of a string');
      console.error('🛠️ Check location objects, ensure they are converted to strings before rendering');
    }
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Check if this is React Error #31 (object rendering)
      const isObjectRenderingError = this.state.error?.message?.includes('Objects are not valid as a React child');

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {isObjectRenderingError ? 'Veri Görüntüleme Hatası' : 'Bir şeyler ters gitti'}
              </h1>
              <p className="text-gray-600">
                {isObjectRenderingError 
                  ? 'Lokasyon verilerinde bir sorun var. Bu genellikle veri formatı sorunundan kaynaklanır.'
                  : 'Sayfa yüklenirken beklenmedik bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.'
                }
              </p>
            </div>

            {/* Special message for React Error #31 */}
            {isObjectRenderingError && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="text-sm font-semibold text-amber-800 mb-2">
                  🔍 Teknik Bilgi
                </h3>
                <p className="text-sm text-amber-700">
                  Bu hata, lokasyon nesnelerinin düzgün string'e dönüştürülememesinden kaynaklanıyor olabilir. 
                  Sayfayı yenilemek sorunu çözebilir.
                </p>
              </div>
            )}

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Hata Detayları (Development):
                </h3>
                <pre className="text-xs text-red-700 overflow-auto">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs text-red-600 mt-2 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Tekrar Dene</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="h-5 w-5" />
                <span>Ana Sayfaya Dön</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Sorun devam ederse lütfen destek ekibiyle iletişime geçin.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier use
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorHandler?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary onError={errorHandler}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}