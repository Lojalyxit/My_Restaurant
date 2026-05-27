'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'
import { getMenu, MenuItem } from '@/lib/api'

const CATEGORY_LABELS: Record<string, string> = {
  plats: 'Plats Signatures',
  grillades: 'Grillades',
  sauces: 'Sauces & Soupes',
  accompagnements: 'Accompagnements',
  desserts: 'Desserts',
  entrees: 'Entrées',
  boissons: 'Boissons',
  signatures: 'Plats Signatures',
}

function formatGNF(price: number) {
  return price.toLocaleString('fr-FR') + ' GNF'
}

function MenuCard({ item }: { item: MenuItem }) {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    setAdded(true)
    addItem({ id: item.id, name: item.name, price: item.price, quantity: 1, image_url: item.image_url })
    toast.success(`✓ ${item.name} ajouté à votre table`)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="group bg-white border border-ivory-dark hover:border-gold/50 transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
        {item.is_signature && (
          <div className="absolute top-4 left-4 bg-gold text-espresso text-xs font-semibold px-3 py-1 tracking-wider uppercase flex items-center gap-1">
            <Star size={10} fill="currentColor" /> Signature
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-playfair text-xl text-espresso mb-2">{item.name}</h3>
        <p className="text-espresso/60 text-sm leading-relaxed mb-4 font-inter">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-gold font-playfair text-xl font-bold">{formatGNF(item.price)}</span>
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
              added ? 'bg-jade text-white' : 'bg-espresso text-gold hover:bg-terracotta hover:text-white'
            }`}
          >
            <Plus size={16} />
            {added ? 'Ajouté !' : 'Ajouter'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('')

  useEffect(() => {
    getMenu()
      .then((data) => {
        const available = data.filter((i) => i.is_available)
        setMenuItems(available)
        if (available.length > 0) setActiveCategory(available[0].category)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const categories = Array.from(
    new Map(menuItems.map((i) => [i.category, CATEGORY_LABELS[i.category] || i.category])).entries()
  ).map(([key, label]) => ({ key, label }))

  const filtered = menuItems.filter((i) => i.category === activeCategory)

  return (
    <section id="menu" className="section-padding bg-espresso">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold/70 tracking-[0.3em] uppercase text-sm mb-4 font-inter">Notre Sélection</p>
          <h2 className="font-playfair text-5xl md:text-6xl text-ivory mb-6">
            La Carte de <em className="text-gold">Louise</em>
          </h2>
          <p className="text-ivory/60 max-w-2xl mx-auto font-inter">
            Spécialités guinéennes et africaines préparées chaque jour avec des ingrédients frais du marché.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <span className="text-gold text-4xl animate-spin inline-block">◌</span>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-24 text-ivory/50 font-inter">
            Le menu est temporairement indisponible.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-16">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`relative px-6 py-3 text-sm font-inter tracking-wider uppercase transition-colors duration-300 ${
                    activeCategory === cat.key ? 'text-espresso' : 'text-ivory/60 hover:text-gold'
                  }`}
                >
                  {activeCategory === cat.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gold"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filtered.map((item) => <MenuCard key={item.id} item={item} />)}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  )
}
