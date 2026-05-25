'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  { name: 'Aminata D.', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80', text: 'Le mafé d\'agneau était une expérience hors du commun. Le dressage m\'a coupé le souffle — c\'était comme au restaurant, chez moi. Louise, c\'est la magie de l\'Afrique sublimée.' },
  { name: 'Jean-Paul M.', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', text: 'Je n\'avais jamais mangé africain avant Louise. Maintenant je comprends pourquoi cette cuisine mérite sa place au panthéon de la gastronomie. Livraison parfaite, plats divins.' },
  { name: 'Coumba S.', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80', text: 'Ma grand-mère fait le thiéboudienne le meilleur du monde. Mais Louise m\'en a fait redécouvrir la saveur avec une présentation à couper le souffle. Respectueux et magnifique.' },
  { name: 'Thomas K.', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', text: 'Commandé pour un dîner romantique. Ma compagne a pleuré tellement c\'était beau. Le service est d\'une gentillesse rare. Louise, on revient chaque semaine maintenant.' },
  { name: 'Fatou B.', photo: 'https://images.unsplash.com/photo-1560087637-bf797bc7796a?w=100&q=80', text: 'L\'attiéké est exactement celui que ma maman faisait à Abidjan. Cette saveur d\'authenticité dans un écrin moderne, c\'est ce que Louise réussit à merveille. Bravo !' },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [paused])

  return (
    <section className="section-padding bg-terracotta/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4 font-inter">Témoignages</p>
          <h2 className="font-playfair text-5xl md:text-6xl text-espresso">
            Ils ont aimé <em className="text-terracotta">Louise</em>
          </h2>
        </div>

        <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-10 md:p-16 text-center"
            >
              <div className="flex justify-center mb-6">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={20} className="text-gold" fill="#D4A574" />)}
              </div>
              <p className="font-playfair italic text-espresso/80 text-xl md:text-2xl leading-relaxed mb-10">
                &ldquo;{testimonials[current].text}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image src={testimonials[current].photo} alt={testimonials[current].name} fill className="object-cover" />
                </div>
                <span className="font-playfair text-espresso text-lg">{testimonials[current].name}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center gap-6 mt-8">
            <button onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)} className="w-10 h-10 border border-gold text-gold hover:bg-gold hover:text-espresso transition-all flex items-center justify-center">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`h-2 transition-all duration-300 ${i === current ? 'bg-gold w-6' : 'bg-gold/30 w-2'}`} />
              ))}
            </div>
            <button onClick={() => setCurrent((c) => (c + 1) % testimonials.length)} className="w-10 h-10 border border-gold text-gold hover:bg-gold hover:text-espresso transition-all flex items-center justify-center">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
