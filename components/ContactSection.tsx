'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook } from 'lucide-react'

const contacts = [
  { icon: MapPin, title: 'Adresse', content: 'Dapompa Plateau, Rue T8\nTombolia, Conakry — Guinée' },
  { icon: Phone, title: 'Téléphone', content: '+224 622 36 54 20', href: 'tel:+224622365420' },
  { icon: MessageCircle, title: 'WhatsApp Livraison', content: '+224 622 36 54 20', href: 'https://wa.me/224622365420' },
  { icon: Mail, title: 'Email', content: 'bonjour@restaurant-louise.com', href: 'mailto:bonjour@restaurant-louise.com' },
]

export default function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="contact" className="section-padding bg-ivory" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4 font-inter">Nous trouver</p>
          <h2 className="font-playfair text-5xl md:text-6xl text-espresso">
            Venez rencontrer <em className="text-terracotta">Louise</em>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }} className="space-y-8">
            {contacts.map(({ icon: Icon, title, content, href }) => (
              <div key={title} className="flex gap-4">
                <div className="w-12 h-12 border border-gold flex items-center justify-center flex-shrink-0">
                  <Icon className="text-gold" size={20} />
                </div>
                <div>
                  <h3 className="font-playfair text-xl text-espresso mb-1">{title}</h3>
                  {href ? (
                    <a href={href} className="text-espresso/70 font-inter hover:text-terracotta transition-colors whitespace-pre-line">{content}</a>
                  ) : (
                    <p className="text-espresso/70 font-inter whitespace-pre-line">{content}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 border border-gold flex items-center justify-center flex-shrink-0">
                <Clock className="text-gold" size={20} />
              </div>
              <div>
                <h3 className="font-playfair text-xl text-espresso mb-2">Horaires</h3>
                <div className="text-espresso/70 font-inter space-y-1">
                  <p>Mardi – Vendredi : 12h–14h30 · 19h–22h30</p>
                  <p>Samedi – Dimanche : 12h–15h · 19h–23h</p>
                  <p className="text-terracotta">Lundi : fermé</p>
                  <p className="text-jade mt-2">Livraison 7j/7 · 11h30 – 22h00</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 border border-espresso/20 hover:border-gold text-espresso/50 hover:text-gold transition-all flex items-center justify-center">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="relative overflow-hidden">
            <div className="h-[400px] relative">
              <iframe
                src="https://maps.google.com/maps?q=Tombolia+Conakry+Guinee&z=15&output=embed"
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Louise Restaurant — Dapompa Plateau, Tombolia, Conakry"
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-gold/30" />
            </div>
            <div className="bg-espresso p-6 flex items-start gap-4">
              <MapPin className="text-gold flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-gold font-playfair text-lg mb-1">Louise Restaurant</p>
                <p className="text-ivory/70 font-inter text-sm leading-relaxed">
                  Dapompa Plateau, Rue T8 — Commune de Tombolia<br />
                  Conakry, République de Guinée
                </p>
                <a
                  href="https://maps.google.com/maps?q=Tombolia+Conakry+Guinee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-gold border border-gold/40 px-4 py-2 text-xs font-inter tracking-widest uppercase hover:bg-gold hover:text-espresso transition-colors"
                >
                  Ouvrir dans Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
