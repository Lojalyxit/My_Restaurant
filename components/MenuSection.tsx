'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { MenuItem } from '@/types/database'

const CATEGORIES = [
  { key: 'entrees', label: 'Entrées' },
  { key: 'signatures', label: 'Plats Signatures' },
  { key: 'grillades', label: 'Grillades' },
  { key: 'accompagnements', label: 'Accompagnements' },
  { key: 'desserts', label: 'Desserts' },
  { key: 'boissons', label: 'Boissons' },
] as const

const DEMO_ITEMS: MenuItem[] = [
  { id: '1', name: 'Ndolé aux Crevettes', description: 'Feuilles de ndolé mijotées, crevettes royales grillées, noix de palme torréfiées, dressage bicolore', price: 18.90, category: 'entrees', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', is_signature: false, is_available: true, created_at: '' },
  { id: '2', name: 'Thiéboudienne Royal', description: 'Riz au poisson façon Saint-Louis, légumes confits, sauce tomate réduite, poisson fumé artisanal', price: 24.90, category: 'signatures', image_url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80', is_signature: true, is_available: true, created_at: '' },
  { id: '3', name: "Mafé d'Agneau Confit", description: "Épaule d'agneau confite 8h, sauce arachide veloutée, patate douce caramélisée, gingembre frais", price: 27.90, category: 'signatures', image_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80', is_signature: true, is_available: true, created_at: '' },
  { id: '4', name: 'Suya de Bœuf', description: 'Brochettes de bœuf mariné aux épices suya, arachides concassées, oignons confits, piment doux', price: 22.90, category: 'grillades', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', is_signature: false, is_available: true, created_at: '' },
  { id: '5', name: 'Jollof Rice Signature', description: 'Riz jollof fumé à la tomate, épices secrètes de Louise, plantain doré, salade de chou', price: 19.90, category: 'signatures', image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', is_signature: true, is_available: true, created_at: '' },
  { id: '6', name: 'Poulet DG Grillé', description: 'Poulet de fermier grillé, banane plantain sautée, légumes croquants, sauce tomate relevée', price: 23.90, category: 'grillades', image_url: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=600&q=80', is_signature: true, is_available: true, created_at: '' },
  { id: '7', name: 'Attiéké Frais', description: 'Semoule de manioc fraîche, oignons et tomates en brunoise, vinaigrette citronnée', price: 8.90, category: 'accompagnements', image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', is_signature: false, is_available: true, created_at: '' },
  { id: '8', name: 'Banane Plantain Caramélisée', description: 'Plantain mûr snacké au beurre clarifié, caramel vanille bourbon, fleur de sel de Guérande', price: 9.90, category: 'desserts', image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80', is_signature: false, is_available: true, created_at: '' },
  { id: '9', name: 'Yassa Poulet Déstructuré', description: 'Poulet fermier en émincé, oignons confits au citron vert, olives marinées, riz parfumé basmati', price: 21.90, category: 'signatures', image_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80', is_signature: false, is_available: true, created_at: '' },
  { id: '10', name: 'Bissap Royal', description: "Infusion d'hibiscus artisanale, gingembre frais, menthe du jardin, sucre de canne, pétales cristallisés", price: 6.90, category: 'boissons', image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80', is_signature: false, is_available: true, created_at: '' },
]

function SkeletonCard() {
  return (
    <div className="bg-white border border-ivory-dark overflow-hidden animate-pulse">
      <div className="h-56 bg-ivory-dark" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-ivory-dark rounded w-3/4" />
        <div className="h-4 bg-ivory-dark rounded w-full" />
        <div className="h-4 bg-ivory-dark rounded w-2/3" />
        <div className="flex justify-between pt-2">
          <div className="h-8 bg-ivory-dark rounded w-20" />
          <div className="h-10 bg-ivory-dark rounded w-28" />
        </div>
      </div>
    </div>
  )
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
        <Image src={item.image_url} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-all duration-300" />
        {item.is_signature && (
          <div className="absolute top-4 left-4 bg-gold text-espresso text-xs font-semibold px-3 py-1 tracking-wider uppercase flex items-center gap-1">
            <Star size={10} fill="currentColor" /> Signature de Louise
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-playfair text-xl text-espresso mb-2">{item.name}</h3>
        <p className="text-espresso/60 text-sm leading-relaxed mb-4 font-inter">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-gold font-playfair text-2xl">{item.price.toFixed(2)} €</span>
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
  const [activeCategory, setActiveCategory] = useState('signatures')
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMenu() {
      setLoading(true)
      const { data, error } = await supabase.from('menu_items').select('*').eq('is_available', true)
      setItems(data && data.length > 0 && !error ? data : DEMO_ITEMS)
      setLoading(false)
    }
    loadMenu()
  }, [])

  const filtered = items.filter((i) => i.category === activeCategory)

  return (
    <section id="menu" className="section-padding bg-espresso">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold/70 tracking-[0.3em] uppercase text-sm mb-4 font-inter">Notre Sélection</p>
          <h2 className="font-playfair text-5xl md:text-6xl text-ivory mb-6">
            La Carte de <em className="text-gold">Louise</em>
          </h2>
          <p className="text-ivory/60 max-w-2xl mx-auto font-inter">
            Des créations inspirées des grandes tables africaines, revisitées avec l&apos;art du dressage gastronomique.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`relative px-6 py-3 text-sm font-inter tracking-wider uppercase transition-colors duration-300 ${
                activeCategory === cat.key ? 'text-espresso' : 'text-ivory/60 hover:text-gold'
              }`}
            >
              {activeCategory === cat.key && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-gold" transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
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
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.length > 0
              ? filtered.map((item) => <MenuCard key={item.id} item={item} />)
              : <p className="col-span-3 text-center text-ivory/40 font-inter py-12">Aucun plat dans cette catégorie</p>
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
