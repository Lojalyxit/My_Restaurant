'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook } from 'lucide-react'

const contacts = [
  { icon: MapPin, title: 'Adresse', content: '12 Rue de la Gastronomie\n75011 Paris, France' },
  { icon: Phone, title: 'Téléphone', content: '+33 1 42 00 00 00', href: 'tel:+33142000000' },
  { icon: MessageCircle, title: 'WhatsApp Livraison', content: '+33 1 42 00 00 01', href: 'https://wa.me/33142000001' },
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

          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="h-[500px] relative overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.3522219!3d48.8566101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sen!2s!4v1234567890"
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Louise Restaurant"
            />
            <div className="absolute inset-0 pointer-events-none border-2 border-gold/30" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
