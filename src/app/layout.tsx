import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AYT Transfer - Antalya Havalimanı Transfer Hizmeti',
  description: 'Antalya Havalimanı\'ndan otel ve tatil beldelerine güvenli, konforlu transfer hizmeti. 7/24 rezervasyon, QR kod ile doğrulama.',
  keywords: 'antalya transfer, havalimanı transfer, antalya airport transfer, kemer transfer, belek transfer, side transfer',
  authors: [{ name: 'AYT Transfer' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'AYT Transfer - Antalya Havalimanı Transfer Hizmeti',
    description: 'Antalya Havalimanı\'ndan otel ve tatil beldelerine güvenli, konforlu transfer hizmeti.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'AYT Transfer'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}