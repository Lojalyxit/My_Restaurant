import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import StorySection from '@/components/StorySection'
import MenuSection from '@/components/MenuSection'
import OrderSection from '@/components/OrderSection'
import GallerySection from '@/components/GallerySection'
import TestimonialsSection from '@/components/TestimonialsSection'
import ReservationSection from '@/components/ReservationSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import CartSidebar from '@/components/CartSidebar'
import ScrollToTop from '@/components/ScrollToTop'

export default function Home() {
  return (
    <>
      <Loader />
      <Navbar />
      <main>
        <HeroSection />
        <StorySection />
        <MenuSection />
        <OrderSection />
        <GallerySection />
        <TestimonialsSection />
        <ReservationSection />
        <ContactSection />
      </main>
      <Footer />
      <CartSidebar />
      <ScrollToTop />
    </>
  )
}
