'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Star, UtensilsCrossed } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'

const CATEGORIES = [
  { key: 'signatures', label: 'Plats Signatures' },
  { key: 'grillades', label: 'Grillades' },
  { key: 'sauces', label: 'Sauces & Soupes' },
  { key: 'accompagnements', label: 'Accompagnements' },
  { key: 'boissons', label: 'Boissons' },
  { key: 'desserts', label: 'Desserts' },
] as const

type Category = typeof CATEGORIES[number]['key']

interface Plat {
  id: string
  name: string
  description: string
  price: number
  category: Category
  image_url: string
  is_signature: boolean
}

const PLATS: Plat[] = [
  // ── Plats Signatures ──
  {
    id: 's1', name: 'Riz Gras au Poisson', category: 'signatures', is_signature: true, price: 85000,
    description: 'Riz cuit dans un bouillon riche, poisson fumé artisanal, légumes du marché, sauce tomate maison',
    image_url: '',
  },
  {
    id: 's2', name: 'Sauce Feuilles & Riz', category: 'signatures', is_signature: true, price: 80000,
    description: 'Feuilles de manioc pilées, poisson ou viande mijoté, riz blanc parfumé, piment doux',
    image_url: '',
  },
  {
    id: 's3', name: 'Yassa Poulet', category: 'signatures', is_signature: true, price: 100000,
    description: 'Poulet mariné aux oignons et citron vert, grillé puis mijoté, servi avec riz basmati',
    image_url: '',
  },
  {
    id: 's4', name: 'Poulet DG Grillé', category: 'signatures', is_signature: true, price: 120000,
    description: 'Poulet de fermier grillé au feu de bois, banane plantain sautée, sauce tomate relevée aux épices',
    image_url: '',
  },
  // ── Grillades ──
  {
    id: 'g1', name: 'Poisson Braisé Entier', category: 'grillades', is_signature: false, price: 150000,
    description: 'Poisson frais entier mariné aux épices locales, grillé sur braises, servi avec oignons confits et citron',
    image_url: '',
  },
  {
    id: 'g2', name: 'Brochettes de Bœuf', category: 'grillades', is_signature: false, price: 75000,
    description: 'Morceaux de bœuf tendre marinés, épices suya, oignons et poivrons grillés, sauce arachide',
    image_url: '',
  },
  {
    id: 'g3', name: 'Poulet Braisé & Légumes', category: 'grillades', is_signature: false, price: 110000,
    description: 'Demi-poulet braisé lentement, légumes de saison, sauce piment maison, riz ou attiéké',
    image_url: '',
  },
  // ── Sauces & Soupes ──
  {
    id: 'sc1', name: 'Sauce Gombo & Foufou', category: 'sauces', is_signature: false, price: 70000,
    description: 'Gombo frais mijoté avec viande ou poisson, épices locales, servi avec foufou de manioc',
    image_url: '',
  },
  {
    id: 'sc2', name: 'Sauce Arachide & Riz', category: 'sauces', is_signature: false, price: 75000,
    description: 'Pâte d\'arachide grillée, viande de bœuf ou mouton, tomates fraîches, épices guinéennes',
    image_url: '',
  },
  {
    id: 'sc3', name: 'Sauce Palmiste & Riz', category: 'sauces', is_signature: false, price: 80000,
    description: 'Noix de palme fraîche mijotée, poisson fumé et viande, assaisonnement traditionnel guinéen',
    image_url: '',
  },
  // ── Accompagnements ──
  {
    id: 'a1', name: 'Foufou Blanc', category: 'accompagnements', is_signature: false, price: 25000,
    description: 'Foufou de manioc fraîchement pilé, texture lisse et aérienne, accompagnement idéal',
    image_url: '',
  },
  {
    id: 'a2', name: 'Attiéké Frais', category: 'accompagnements', is_signature: false, price: 30000,
    description: 'Semoule de manioc fraîche, oignons et tomates en brunoise, vinaigrette citronnée légère',
    image_url: '',
  },
  {
    id: 'a3', name: 'Riz Couscous', category: 'accompagnements', is_signature: false, price: 35000,
    description: 'Couscous de riz à la vapeur, moelleux et parfumé, idéal avec toutes nos sauces',
    image_url: '',
  },
  {
    id: 'a4', name: 'Plantain Grillé', category: 'accompagnements', is_signature: false, price: 25000,
    description: 'Banane plantain mûre grillée au beurre, légèrement caramélisée, sucrée et fondante',
    image_url: '',
  },
  // ── Boissons ──
  {
    id: 'b1', name: 'Bissap Maison', category: 'boissons', is_signature: false, price: 15000,
    description: 'Infusion d\'hibiscus artisanale, gingembre frais, menthe, sucre de canne naturel',
    image_url: '',
  },
  {
    id: 'b2', name: 'Jus de Gingembre', category: 'boissons', is_signature: false, price: 15000,
    description: 'Gingembre frais pressé, citron vert, miel naturel, eau fraîche — vivifiant et sain',
    image_url: '',
  },
  {
    id: 'b3', name: 'Jus de Baobab', category: 'boissons', is_signature: false, price: 18000,
    description: 'Pulpe de baobab fraîche, lait de coco, sucre naturel — riche en vitamine C',
    image_url: '',
  },
  {
    id: 'b4', name: 'Citronnade Maison', category: 'boissons', is_signature: false, price: 12000,
    description: 'Citrons frais pressés, sucre de canne, eau pétillante ou plate, menthe fraîche',
    image_url: '',
  },
  // ── Desserts ──
  {
    id: 'd1', name: 'Salade de Fruits Tropicaux', category: 'desserts', is_signature: false, price: 20000,
    description: 'Mangue, ananas, papaye, pastèque, citron vert, sucre vanillé et menthe fraîche',
    image_url: '',
  },
  {
    id: 'd2', name: 'Mangue Fraîche & Citron', category: 'desserts', is_signature: false, price: 15000,
    description: 'Mangues mûres des vergers locaux, zeste de citron vert, piment doux, fleur de sel',
    image_url: '',
  },
]

function formatGNF(price: number) {
  return price.toLocaleString('fr-FR') + ' GNF'
}

function MenuCard({ item }: { item: Plat }) {
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
      <div className="relative h-56 overflow-hidden bg-espresso flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-espresso via-espresso-light to-terracotta/30" />
        <div className="relative z-10 flex flex-col items-center gap-3 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
          <UtensilsCrossed size={40} className="text-gold" />
          <p className="text-gold font-playfair italic text-sm">Photo à venir</p>
        </div>
        {item.is_signature && (
          <div className="absolute top-4 left-4 bg-gold text-espresso text-xs font-semibold px-3 py-1 tracking-wider uppercase flex items-center gap-1 z-10">
            <Star size={10} fill="currentColor" /> Signature de Louise
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-playfair text-xl text-espresso mb-2">{item.name}</h3>
        <p className="text-espresso/60 text-sm leading-relaxed mb-4 font-inter">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-gold font-playfair text-xl">{formatGNF(item.price)}</span>
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
  const [activeCategory, setActiveCategory] = useState<Category>('signatures')

  const filtered = PLATS.filter(i => i.category === activeCategory)

  return (
    <section id="menu" className="section-padding bg-espresso">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold/70 tracking-[0.3em] uppercase text-sm mb-4 font-inter">Notre Sélection</p>
          <h2 className="font-playfair text-5xl md:text-6xl text-ivory mb-6">
            La Carte de <em className="text-gold">Louise</em>
          </h2>
          <p className="text-ivory/60 max-w-2xl mx-auto font-inter">
            Des spécialités guinéennes et africaines préparées chaque jour avec des ingrédients frais du marché.
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
            {filtered.map((item) => <MenuCard key={item.id} item={item} />)}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
