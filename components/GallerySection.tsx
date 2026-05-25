'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const images = [
  { src: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80', alt: 'Plat gastronomique africain' },
  { src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80', alt: 'Riz jollof élégant' },
  { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', alt: 'Grillades suya' },
  { src: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80', alt: 'Plat en sauce' },
  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', alt: 'Chef en cuisine' },
  { src: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80', alt: 'Épices africaines' },
  { src: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80', alt: 'Dessert plantain' },
  { src: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80', alt: 'Boisson bissap' },
  { src: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=800&q=80', alt: 'Poulet grillé' },
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
