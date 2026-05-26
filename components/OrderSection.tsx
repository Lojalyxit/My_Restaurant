'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Plus, Minus, MapPin, Clock, CheckCircle, ShoppingBag, Heart, Utensils, Droplets, Leaf } from 'lucide-react'
import { toast } from 'sonner'

type Tab = 'plats' | 'jus' | 'fruits'

const MENU: Record<Tab, { id: string; name: string; price: number; emoji: string }[]> = {
  plats: [
    { id: 'p1', name: 'Riz Gras au Poisson', price: 85000, emoji: '🍚' },
    { id: 'p2', name: 'Sauce Feuilles & Riz', price: 80000, emoji: '🥬' },
    { id: 'p3', name: 'Yassa Poulet', price: 100000, emoji: '🍗' },
    { id: 'p4', name: 'Poulet DG Grillé', price: 120000, emoji: '🔥' },
    { id: 'p5', name: 'Sauce Gombo & Foufou', price: 70000, emoji: '🍲' },
    { id: 'p6', name: 'Sauce Arachide & Riz', price: 75000, emoji: '🥜' },
    { id: 'p7', name: 'Sauce Palmiste & Riz', price: 80000, emoji: '🌴' },
    { id: 'p8', name: 'Poisson Braisé Entier', price: 150000, emoji: '🐟' },
    { id: 'p9', name: 'Brochettes de Bœuf', price: 75000, emoji: '🥩' },
    { id: 'p10', name: 'Poulet Braisé & Légumes', price: 110000, emoji: '🍖' },
  ],
  jus: [
    { id: 'j1', name: 'Bissap Maison', price: 15000, emoji: '🌺' },
    { id: 'j2', name: 'Jus de Gingembre', price: 15000, emoji: '🫚' },
    { id: 'j3', name: 'Jus de Baobab', price: 18000, emoji: '🥛' },
    { id: 'j4', name: 'Citronnade Maison', price: 12000, emoji: '🍋' },
  ],
  fruits: [
    { id: 'f1', name: 'Mangue Fraîche', price: 15000, emoji: '🥭' },
    { id: 'f2', name: 'Salade Tropicale', price: 20000, emoji: '🍍' },
    { id: 'f3', name: 'Foufou Blanc', price: 25000, emoji: '⚪' },
    { id: 'f4', name: 'Attiéké Frais', price: 30000, emoji: '🌾' },
    { id: 'f5', name: 'Plantain Grillé', price: 25000, emoji: '🍌' },
    { id: 'f6', name: 'Riz Couscous', price: 35000, emoji: '🍽️' },
  ],
}

const TIME_SLOTS = ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00']
const DELIVERY_FEE = 10000
const MIN_ORDER = 50000

function formatGNF(price: number) {
  return price.toLocaleString('fr-FR') + ' GNF'
}

const inputCls = 'w-full bg-white/5 border border-white/10 px-4 py-3 text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold transition-colors font-inter text-sm'

export default function OrderSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const [tab, setTab] = useState<Tab>('plats')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [address, setAddress] = useState('')
  const [district, setDistrict] = useState('')
  const [city, setCity] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNum, setOrderNum] = useState('')

  const allItems = [...MENU.plats, ...MENU.jus, ...MENU.fruits]
  const selectedItems = allItems.filter(item => (quantities[item.id] || 0) > 0)
  const subtotal = allItems.reduce((sum, item) => sum + (quantities[item.id] || 0) * item.price, 0)
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0)
  const itemCount = Object.values(quantities).reduce((a, b) => a + b, 0)

  const adjust = (id: string, delta: number) => {
    setQuantities(prev => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }
      if (next[id] === 0) delete next[id]
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedItems.length === 0) { toast.error('Sélectionnez au moins un article'); return }
    if (subtotal < MIN_ORDER) { toast.error(`Minimum de commande : ${formatGNF(MIN_ORDER)}`); return }
    if (!address || !city) { toast.error('Adresse de livraison requise'); return }
    if (!timeSlot) { toast.error('Choisissez un horaire de livraison'); return }
    if (!name || !phone) { toast.error('Vos coordonnées sont requises'); return }

    setLoading(true)
    const num = `LOU-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: num,
          customer_name: name,
          customer_phone: phone,
          customer_email: email || '',
          delivery_address: address,
          delivery_district: district,
          delivery_city: city,
          delivery_instructions: `Horaire souhaité : ${timeSlot}`,
          subtotal,
          delivery_fee: DELIVERY_FEE,
          total,
          status: 'pending',
          items: selectedItems.map(item => ({
            menu_item_name: item.name,
            quantity: quantities[item.id],
            unit_price: item.price,
          })),
        }),
      })
      if (!res.ok) throw new Error()
      setOrderNum(num)
      setSuccess(true)
    } catch {
      toast.error('Erreur lors de la commande, réessayez')
    }
    setLoading(false)
  }

  const reset = () => {
    setQuantities({}); setAddress(''); setDistrict(''); setCity('')
    setTimeSlot(''); setName(''); setPhone(''); setEmail('')
    setSuccess(false); setOrderNum('')
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'plats', label: 'Plats', icon: <Utensils size={14} /> },
    { key: 'jus', label: 'Jus', icon: <Droplets size={14} /> },
    { key: 'fruits', label: 'Fruits', icon: <Leaf size={14} /> },
  ]

  return (
    <section id="commander" className="section-padding bg-ivory" ref={ref}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4 font-inter">Livraison à domicile · 7j/7</p>
          <h2 className="font-playfair text-5xl md:text-6xl text-espresso mb-6">
            Commandez<br />
            <em className="text-terracotta">en ligne</em>
          </h2>
          <div className="w-16 h-px bg-gold mx-auto" />
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_480px] gap-12 xl:gap-20 items-start">

          {/* LEFT — Info + Summary */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            {/* Steps */}
            <div className="space-y-10 mb-14">
              {[
                { n: '01', title: 'Choisissez vos plats', desc: 'Sélectionnez parmi nos plats signature, jus naturels et fruits frais préparés chaque jour.' },
                { n: '02', title: 'Indiquez votre adresse', desc: 'Renseignez le lieu et l\'horaire de livraison souhaité. Nous livrons dans un rayon de 10 km.' },
                { n: '03', title: 'Savourez en 30-45 min', desc: 'Notre équipe prépare votre commande avec soin et la livre chaleureusement chez vous.' },
              ].map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.15 }}
                  className="flex gap-6 items-start group"
                >
                  <div className="flex-shrink-0 w-16 h-16 border-2 border-gold group-hover:bg-gold transition-colors duration-300 flex items-center justify-center">
                    <span className="font-playfair text-gold group-hover:text-espresso text-xl font-bold transition-colors duration-300">{step.n}</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="font-playfair text-xl text-espresso mb-2">{step.title}</h3>
                    <p className="text-espresso/60 font-inter text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-espresso text-ivory grid grid-cols-3 text-center"
            >
              {[
                { value: "30-45'", label: 'Délai livraison' },
                { value: '10 000 GNF', label: 'Frais livraison' },
                { value: '7j/7', label: 'Disponibilité' },
              ].map((info, i) => (
                <div key={info.label} className={`py-8 ${i === 1 ? 'border-x border-gold/20' : ''}`}>
                  <p className="text-gold font-playfair text-3xl font-bold mb-1">{info.value}</p>
                  <p className="text-ivory/50 text-xs uppercase tracking-widest font-inter">{info.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Live selection recap */}
            <AnimatePresence>
              {selectedItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="mt-8 border border-gold/30 p-6 bg-ivory-light"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag size={16} className="text-gold" />
                    <p className="font-playfair text-espresso text-lg">Ma sélection ({itemCount} article{itemCount > 1 ? 's' : ''})</p>
                  </div>
                  <div className="space-y-2">
                    {selectedItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center font-inter text-sm text-espresso/80">
                        <span className="flex items-center gap-2">
                          <span>{item.emoji}</span>
                          <span>{item.name} × {quantities[item.id]}</span>
                        </span>
                        <span className="text-gold font-semibold">{formatGNF(item.price * quantities[item.id])}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gold/20 mt-4 pt-4 flex justify-between items-baseline">
                    <span className="font-playfair text-espresso">Total estimé</span>
                    <span className="font-playfair text-gold text-2xl font-bold">{formatGNF(total)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT — Order form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="lg:sticky lg:top-8"
          >
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-espresso p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <Heart size={64} className="text-gold mx-auto mb-6" fill="#D4A574" />
                </motion.div>
                <h3 className="font-playfair italic text-gold text-4xl mb-3">Merci !</h3>
                <p className="text-ivory/70 font-inter mb-3">Louise prépare votre commande avec amour.</p>
                <p className="font-playfair text-2xl text-gold mb-2">N° {orderNum}</p>
                <p className="text-ivory/40 font-inter text-xs mb-10">Livraison estimée : 30-45 minutes</p>
                <button onClick={reset} className="btn-gold w-full">Nouvelle commande</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-espresso shadow-2xl">

                {/* Form header */}
                <div className="px-7 pt-7 pb-5 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-1">
                    <ShoppingBag className="text-gold" size={20} />
                    <h3 className="font-playfair italic text-gold text-2xl">Votre commande</h3>
                  </div>
                  <p className="text-ivory/40 font-inter text-xs tracking-wide">Minimum {formatGNF(MIN_ORDER)} · Livraison {formatGNF(DELIVERY_FEE)}</p>
                </div>

                {/* ── SECTION 1 : Choix des articles ── */}
                <div className="px-7 pt-6 pb-5">
                  {/* Tab buttons */}
                  <div className="grid grid-cols-3 gap-1.5 mb-5">
                    {tabs.map(t => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setTab(t.key)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-inter tracking-widest uppercase transition-all duration-200 ${
                          tab === t.key
                            ? 'bg-gold text-espresso font-bold'
                            : 'border border-white/15 text-ivory/50 hover:border-gold/50 hover:text-ivory'
                        }`}
                      >
                        {t.icon}
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Items grid */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="grid grid-cols-2 gap-2.5"
                    >
                      {MENU[tab].map(item => {
                        const qty = quantities[item.id] || 0
                        return (
                          <div
                            key={item.id}
                            className={`border p-3.5 transition-all duration-200 ${
                              qty > 0
                                ? 'border-gold bg-gold/10'
                                : 'border-white/8 bg-white/3 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-2xl leading-none">{item.emoji}</span>
                              {qty > 0 && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="bg-gold text-espresso text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                                >
                                  {qty}
                                </motion.span>
                              )}
                            </div>
                            <p className="text-ivory/90 font-inter text-[11px] leading-snug mb-1">{item.name}</p>
                            <p className="text-gold font-playfair text-sm mb-3">{formatGNF(item.price)}</p>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => adjust(item.id, -1)}
                                disabled={qty === 0}
                                className="w-6 h-6 border border-gold/30 text-gold hover:bg-gold hover:text-espresso transition-all disabled:opacity-20 flex items-center justify-center"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="text-ivory font-inter text-xs w-3 text-center tabular-nums">{qty}</span>
                              <button
                                type="button"
                                onClick={() => adjust(item.id, 1)}
                                className="w-6 h-6 border border-gold/30 text-gold hover:bg-gold hover:text-espresso transition-all flex items-center justify-center"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ── SECTION 2 : Livraison ── */}
                <div className="px-7 py-5 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="text-gold flex-shrink-0" size={15} />
                    <p className="text-ivory/70 font-inter text-xs uppercase tracking-[0.2em]">Lieu de livraison</p>
                  </div>
                  <div className="space-y-2.5">
                    <input
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Adresse complète *"
                      className={inputCls}
                    />
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        value={district}
                        onChange={e => setDistrict(e.target.value)}
                        placeholder="Quartier"
                        className={inputCls}
                      />
                      <input
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Ville *"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Time slot */}
                  <div className="flex items-center gap-2 mt-5 mb-3">
                    <Clock className="text-gold flex-shrink-0" size={15} />
                    <p className="text-ivory/70 font-inter text-xs uppercase tracking-[0.2em]">Horaire souhaité</p>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`py-2 text-[11px] font-inter transition-all duration-200 ${
                          timeSlot === slot
                            ? 'bg-gold text-espresso font-bold'
                            : 'border border-white/10 text-ivory/50 hover:border-gold/40 hover:text-ivory'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── SECTION 3 : Coordonnées ── */}
                <div className="px-7 py-5 border-t border-white/10">
                  <p className="text-ivory/70 font-inter text-xs uppercase tracking-[0.2em] mb-4">Vos coordonnées</p>
                  <div className="space-y-2.5">
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Nom complet *"
                      className={inputCls}
                    />
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Téléphone *"
                        className={inputCls}
                      />
                      <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email (optionnel)"
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                {/* ── SECTION 4 : Récapitulatif + Bouton ── */}
                <div className="px-7 pt-5 pb-7 border-t border-white/10">
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between text-ivory/50 font-inter text-sm">
                      <span>Sous-total</span>
                      <span>{formatGNF(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-ivory/50 font-inter text-sm">
                      <span>Livraison</span>
                      <span>{subtotal > 0 ? formatGNF(DELIVERY_FEE) : '—'}</span>
                    </div>
                    <div className="flex justify-between items-baseline border-t border-gold/20 pt-3 mt-3">
                      <span className="font-playfair text-ivory text-lg">Total</span>
                      <span className="font-playfair text-gold text-3xl font-bold">{formatGNF(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || selectedItems.length === 0}
                    className="w-full bg-gold text-espresso py-4 font-inter font-bold tracking-[0.15em] uppercase text-sm hover:bg-gold-light transition-colors duration-200 disabled:opacity-30 flex items-center justify-center gap-3"
                  >
                    {loading
                      ? <span className="animate-spin text-xl">◌</span>
                      : <><CheckCircle size={17} /> Commander maintenant</>
                    }
                  </button>
                  <p className="text-ivory/25 font-inter text-[10px] text-center mt-3 tracking-wide">
                    Paiement à la livraison · Cash ou Mobile Money
                  </p>
                </div>

              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
