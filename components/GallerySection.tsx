'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const images = [
  { src: '/gallery/553930667ae0469d00c1a881bf5c70b3.jpg', alt: 'Brochettes grillées' },
  { src: '/gallery/8ee952f0165840d63e6496280cb20513.jpg', alt: 'Riz jollof poulet alloco' },
  { src: '/gallery/f35335c6e9469387f4a69c4591f2c9b1.jpg', alt: 'Sauce crabe et boule' },
  { src: '/gallery/8d538b45e278639a26785a7a6ec9f782.jpg', alt: 'Poisson braisé entier' },
  { src: '/gallery/261af8e5aa7817f724a58f1d4ddce712.jpg', alt: 'Soupe gombo aux crevettes' },
  { src: '/gallery/6760a073cda74792dcca26b77308be02.jpg', alt: 'Foufou sauce épinards' },
  { src: '/gallery/26ce13de163511463b35ee9c2a8112e1.jpg', alt: 'Nouilles sautées au bœuf' },
  { src: '/gallery/de2ab21c7a9be6d899dcd20702a029a3.jpg', alt: 'Poisson braisé sauce tomate' },
  { src: '/gallery/49bdf2bd3939250b7e233f8872bf3bb4.jpg', alt: 'Sauce rouge au poisson et riz' },
]

const gridClasses = [
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
]

export default function GallerySection() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const prev = () => setLightboxIdx((i) => (i !== null ? (i - 1 + images.length) % images.length : 0))
  const next = () => setLightboxIdx((i) => (i !== null ? (i + 1) % images.length : 0))

  return (
    <section id="galerie" className="section-padding bg-ivory-light" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4 font-inter">L&apos;Art dans l&apos;assiette</p>
          <h2 className="font-playfair text-5xl md:text-6xl text-espresso">
            Galerie <em className="text-terracotta">Louise</em>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3" style={{ gridAutoRows: '200px' }}>
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative overflow-hidden cursor-pointer group ${gridClasses[i]}`}
              onClick={() => setLightboxIdx(i)}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-all duration-300 flex items-end p-4">
                <span className="text-white font-playfair italic text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                  {img.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-espresso/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}
          >
            <button className="absolute top-6 right-6 text-gold hover:text-gold-light transition-colors" onClick={() => setLightboxIdx(null)}>
              <X size={32} />
            </button>
            <button className="absolute left-6 top-1/2 -translate-y-1/2 text-gold hover:text-gold-light transition-colors" onClick={(e) => { e.stopPropagation(); prev() }}>
              <ChevronLeft size={48} />
            </button>
            <button className="absolute right-6 top-1/2 -translate-y-1/2 text-gold hover:text-gold-light transition-colors" onClick={(e) => { e.stopPropagation(); next() }}>
              <ChevronRight size={48} />
            </button>
            <motion.div
              key={lightboxIdx}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[lightboxIdx].src} alt={images[lightboxIdx].alt} fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
