'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ClipboardList, MapPin, Heart } from 'lucide-react'

const steps = [
  { number: '01', icon: ClipboardList, title: 'Composez votre table', desc: 'Parcourez notre carte et sélectionnez vos plats. Chaque création est disponible à la livraison.' },
  { number: '02', icon: MapPin, title: 'Indiquez votre adresse', desc: 'Renseignez votre adresse de livraison. Nous livrons dans un rayon de 10 km autour de Louise.' },
  { number: '03', icon: Heart, title: 'Savourez en 30-45 min', desc: 'Notre équipe prépare votre commande avec soin et la livre chaleureusement chez vous.' },
]

export default function OrderSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="commander" className="section-padding bg-ivory" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4 font-inter">Livraison à domicile</p>
          <h2 className="font-playfair text-5xl md:text-6xl text-espresso mb-6">
            Louise chez vous,<br />
            <em className="text-terracotta">en 3 étapes</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="text-center group"
            >
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 border-2 border-gold group-hover:bg-gold transition-colors duration-300 flex items-center justify-center mx-auto">
                  <step.icon className="text-gold group-hover:text-espresso transition-colors duration-300" size={32} />
                </div>
                <span className="absolute -top-4 -right-4 font-playfair text-5xl text-ivory-dark font-bold select-none">
                  {step.number}
                </span>
              </div>
              <h3 className="font-playfair text-2xl text-espresso mb-4">{step.title}</h3>
              <p className="text-espresso/70 font-inter leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-espresso text-ivory p-12 grid md:grid-cols-3 gap-8 text-center"
        >
          {[
            { value: "30-45'", label: 'Délai de livraison' },
            { value: '2,90 €', label: 'Frais de livraison' },
            { value: '20 €', label: 'Minimum de commande' },
          ].map((info, i) => (
            <div key={info.label} className={i === 1 ? 'md:border-x border-gold/30' : ''}>
              <p className="text-gold font-playfair text-4xl font-bold mb-2">{info.value}</p>
              <p className="text-ivory/70 tracking-wider uppercase text-sm">{info.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <a href="#menu" className="btn-gold">Composer ma commande</a>
        </div>
      </div>
    </section>
  )
}
