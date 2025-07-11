import TransferHero from '@/components/sections/TransferHero'
import VehicleFleet from '@/components/sections/VehicleFleet'
import Services from '@/components/sections/Services'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <TransferHero />
      <VehicleFleet />
      <Services />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}