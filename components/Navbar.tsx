'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import Logo from './Logo'

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Menu', href: '#menu' },
  { label: 'Notre Histoire', href: '#histoire' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Commander', href: '#commander' },
  { label: 'Réservation', href: '#reservation' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { getTotalItems, openCart } = useCartStore()
  const totalItems = getTotalItems()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-ivory/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          <a href="#accueil">
            <Logo size="sm" color={scrolled ? '#9B4A2F' : '#D4A574'} />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wider uppercase font-inter transition-colors duration-300 gold-underline pb-1 ${
                  scrolled ? 'text-espresso hover:text-terracotta' : 'text-ivory/90 hover:text-gold'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={openCart} className="relative p-2 transition-transform hover:scale-110" aria-label="Panier">
              <ShoppingBag size={24} className={scrolled ? 'text-terracotta' : 'text-gold'} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gold text-espresso text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
            <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen
                ? <X size={24} className={scrolled ? 'text-espresso' : 'text-gold'} />
                : <Menu size={24} className={scrolled ? 'text-espresso' : 'text-gold'} />
              }
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-espresso flex flex-col items-center justify-center gap-8"
          >
            <Logo size="md" color="#D4A574" />
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-gold text-2xl font-playfair italic hover:text-gold-light transition-colors"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
