'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'

const CATEGORIES = [
  { key: 'signatures', label: 'Plats Signatures' },
  { key: 'grillades', label: 'Grillades' },
  { key: 'sauces', label: 'Sauces & Soupes' },
  { key: 'accompagnements', label: 'Accompagnements' },
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
    id: 's1', category: 'signatures', is_signature: true, price: 120000,
    name: 'Thiéboudienne Royal',
    description: 'Riz rouge au poisson entier, carottes, aubergines et légumes confits, sauce tomate réduite — le grand classique',
    image_url: '/thieboudienne-royal.jpg',
  },
  {
    id: 's2', category: 'signatures', is_signature: true, price: 120000,
    name: 'Poulet DG & Riz Jollof',
    description: 'Poulet braisé croustillant, riz jollof épicé, alloco doré et salade fraîche — le trio incontournable',
    image_url: '/poulet-dg-jollof.jpg',
  },
  {
    id: 's3', category: 'signatures', is_signature: true, price: 100000,
    name: 'Riz Gras au Bœuf',
    description: 'Riz cuit dans un bouillon parfumé, morceaux de bœuf fondants, aubergines et légumes du marché',
    image_url: '/riz-gras-boeuf.jpg',
  },
  {
    id: 's4', category: 'signatures', is_signature: true, price: 90000,
    name: 'Sauce Feuilles & Foufou',
    description: 'Feuilles de manioc pilées, poisson fumé et viande mijotés, servis avec foufou blanc moelleux',
    image_url: '/sauce-feuilles-foufou.jpg',
  },
  // ── Grillades ──
  {
    id: 'g1', category: 'grillades', is_signature: false, price: 150000,
    name: 'Poisson Braisé Complet',
    description: 'Poisson entier grillé au feu de bois, foufou blanc, légumes sautés et sauce piment maison',
    image_url: '/poisson-braise-complet.jpg',
  },
  {
    id: 'g2', category: 'grillades', is_signature: false, price: 140000,
    name: 'Poisson Braisé & Couscous',
    description: 'Poisson braisé entier sur lit de couscous de riz, salade fraîche et sauces variées',
    image_url: '/poisson-couscous.jpg',
  },
  {
    id: 'g3', category: 'grillades', is_signature: false, price: 130000,
    name: 'Poisson Braisé & Manioc',
    description: 'Poisson épicé grillé, manioc bouilli, légumes frais et sauce tomate relevée au piment',
    image_url: '/poisson-manioc.jpg',
  },
  {
    id: 'g4', category: 'grillades', is_signature: false, price: 80000,
    name: 'Poisson Épicé en Sauce',
    description: 'Tranches de poisson marinées aux épices locales, mijotées en sauce tomate concentrée',
    image_url: '/poisson-epice.jpg',
  },
  {
    id: 'g5', category: 'grillades', is_signature: false, price: 85000,
    name: 'Brochettes de Bœuf',
    description: 'Brochettes de bœuf tendre grillées, poivrons colorés, oignons et tomates — sauce piment',
    image_url: '/brochettes-boeuf.jpg',
  },
  // ── Sauces & Soupes ──
  {
    id: 'sc1', category: 'sauces', is_signature: false, price: 100000,
    name: 'Sauce Arachide au Bœuf',
    description: 'Morceaux de bœuf fondants dans une sauce arachide veloutée, piment habanero, servi avec riz blanc',
    image_url: '/sauce-arachide.jpg',
  },
  {
    id: 'sc2', category: 'sauces', is_signature: false, price: 90000,
    name: 'Sauce Gombo aux Crevettes',
    description: 'Gombo frais, épinards, crevettes royales et viande, sauce onctueuse aux épices africaines',
    image_url: '/sauce-gombo-crevettes.jpg',
  },
  {
    id: 'sc3', category: 'sauces', is_signature: false, price: 85000,
    name: 'Sauce Gombo & Foufou',
    description: 'Sauce gombo aux fruits de mer et viande fumée, accompagnée de foufou blanc fraîchement pilé',
    image_url: '/sauce-gombo-foufou.jpg',
  },
  {
    id: 'sc4', category: 'sauces', is_signature: false, price: 90000,
    name: 'Sauce Egusi & Foufou',
    description: 'Sauce aux graines de courge pilées, légumes verts, viande et poisson fumé — goût authentique',
    image_url: '/sauce-egusi.jpg',
  },
  {
    id: 'sc5', category: 'sauces', is_signature: false, price: 95000,
    name: 'Sauce Légumes & Viande',
    description: 'Ragoût de viande aux légumes variés — carottes, gombo, tomates et épices du terroir',
    image_url: '/sauce-legumes-viande.jpg',
  },
  {
    id: 'sc6', category: 'sauces', is_signature: false, price: 95000,
    name: 'Poisson en Sauce Tomate',
    description: 'Poisson mijoté dans une sauce tomate riche aux piments, oignons confits, servi avec riz',
    image_url: '/poisson-sauce-tomate.jpg',
  },
  {
    id: 'sc7', category: 'sauces', is_signature: false, price: 80000,
    name: 'Soupe de Tripes Spéciale',
    description: 'Tripes, nids d\'abeilles et abats mijotés dans un bouillon épicé — spécialité de saison',
    image_url: '/soupe-tripes.jpg',
  },
  // ── Accompagnements ──
  {
    id: 'a1', category: 'accompagnements', is_signature: false, price: 85000,
    name: 'Nouilles Sautées au Bœuf',
    description: 'Spaghetti sautés au wok, morceaux de bœuf, poivrons rouges et verts, carottes, sauce soja',
    image_url: '/nouilles-boeuf.jpg',
  },
  {
    id: 'a2', category: 'accompagnements', is_signature: false, price: 90000,
    name: 'Ragoût Bœuf & Légumes',
    description: 'Morceaux de bœuf mijotés avec pommes de terre, tomates, carottes et épices maison',
    image_url: '/ragout-boeuf.jpg',
  },
  {
    id: 'a3', category: 'accompagnements', is_signature: false, price: 75000,
    name: 'Poivrons Farcis à la Viande',
    description: 'Poivrons farcis de viande hachée épicée, haricots et sauce tomate — plat festif',
    image_url: '/poivrons-farcis.jpg',
  },
  {
    id: 'a4', category: 'accompagnements', is_signature: false, price: 30000,
    name: 'Alloco (Plantain Frit)',
    description: 'Rondelles de banane plantain mûre frites à l\'huile, caramélisées — croustillantes et fondantes',
    image_url: '/alloco.jpg',
  },
  // ── Desserts ──
  {
    id: 'd1', category: 'desserts', is_signature: false, price: 25000,
    name: 'Glace à la Fraise',
    description: 'Boules de glace vanille et fraise, coulis de fraise maison, fraises fraîches — onctueux et frais',
    image_url: '/glace-fraise.jpg',
  },
  {
    id: 'd2', category: 'desserts', is_signature: false, price: 20000,
    name: 'Salade de Fruits à la Crème',
    description: 'Fraises, myrtilles et fruits frais nappés d\'une crème légère vanillée — douceur maison',
    image_url: '/salade-fruits-creme.jpg',
  },
  {
    id: 'd3', category: 'desserts', is_signature: false, price: 18000,
    name: 'Salade de Fruits Frais',
    description: 'Banane, orange, fraise, raisin et fruits de saison, sirop léger au citron et à la menthe',
    image_url: '/salade-fruits-frais.jpg',
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
            Spécialités guinéennes et africaines préparées chaque jour avec des ingrédients frais du marché.
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
      </div>
    </section>
  )
}
