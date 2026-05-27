'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import Logo from './Logo'

const navLinks = ['Accueil', 'Menu', 'Notre Histoire', 'Galerie', 'Commander', 'Réservation', 'Contact']

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setEmail('')
    setLoading(false)
    toast.success('✓ Bienvenue dans la famille Louise !')
  }

  return (
    <footer className="bg-espresso text-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-8">
        <div className="text-center mb-16">
          <Logo size="md" color="#D4A574" className="mx-auto mb-4" />
          <p className="text-ivory/60 font-playfair italic text-lg">
            "La gastronomie africaine, livrée avec amour"
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div>
            <h4 className="font-playfair text-gold text-xl mb-6">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} className="text-ivory/60 hover:text-gold transition-colors font-inter text-sm tracking-wide">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-playfair text-gold text-xl mb-6">Horaires</h4>
            <div className="space-y-2 text-ivory/60 font-inter text-sm">
              <p>Mardi – Vendredi</p>
              <p className="text-ivory/40">12h00 – 14h30 · 19h00 – 22h30</p>
              <p className="mt-3">Samedi – Dimanche</p>
              <p className="text-ivory/40">12h00 – 15h00 · 19h00 – 23h00</p>
              <p className="mt-3 text-terracotta">Lundi fermé</p>
              <p className="mt-3 text-gold">Livraison 7j/7</p>
              <p className="text-ivory/40">11h30 – 22h00</p>
            </div>
          </div>

          <div>
            <h4 className="font-playfair text-gold text-xl mb-6">Contact</h4>
            <div className="space-y-3 text-ivory/60 font-inter text-sm">
              <p>Dapompa Plateau, Rue T8<br />Tombolia, Conakry — Guinée</p>
              <a href="tel:+224622365420" className="block hover:text-gold transition-colors">+224 622 36 54 20</a>
              <a href="https://wa.me/224622365420" target="_blank" rel="noopener noreferrer" className="block hover:text-gold transition-colors">WhatsApp Livraison : +224 622 36 54 20</a>
              <a href="mailto:bonjour@restaurant-louise.com" className="block hover:text-gold transition-colors">bonjour@restaurant-louise.com</a>
            </div>
          </div>
        </div>

        <div className="border-t border-ivory/10 py-12 text-center">
          <h4 className="font-playfair text-2xl text-ivory mb-4">Recevez les nouveautés de Louise</h4>
          <p className="text-ivory/60 font-inter mb-8 text-sm">Nouvelles créations, événements, offres exclusives...</p>
          <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto">
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-1 bg-white/10 border border-ivory/20 px-4 py-3 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-colors font-inter text-sm"
            />
            <button type="submit" disabled={loading} className="bg-gold text-espresso px-6 py-3 font-semibold tracking-wider uppercase text-sm hover:bg-gold-light transition-colors disabled:opacity-50">
              {loading ? '...' : "S'abonner"}
            </button>
          </form>
        </div>

        <div className="border-t border-ivory/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-ivory/40 font-inter text-sm">
          <p>© Louise 2026 — Tous droits réservés</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-gold transition-colors">CGV</a>
            <a href="#" className="hover:text-gold transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
