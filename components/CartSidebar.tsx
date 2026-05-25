'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import CheckoutModal from './CheckoutModal'

const DELIVERY_FEE = 2.90
const MIN_ORDER = 20

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const subtotal = getSubtotal()
  const total = subtotal + DELIVERY_FEE

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeCart} className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50" />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-ivory z-50 flex flex-col"
            >
              <div className="bg-espresso p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-playfair italic text-gold text-2xl">Votre table chez Louise</h2>
                  <p className="text-ivory/60 text-sm font-inter mt-1">{items.length} article{items.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={closeCart} className="text-ivory/60 hover:text-gold transition-colors"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <ShoppingBag size={48} className="text-ivory-dark" />
                    <p className="font-playfair text-2xl text-espresso/50">Votre table est vide</p>
                    <p className="text-espresso/40 font-inter text-sm">Découvrez notre carte et composez votre repas</p>
                    <button onClick={closeCart} className="btn-gold mt-4">Voir le menu</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                          className="flex gap-4 bg-white p-4 border border-ivory-dark">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-playfair text-espresso text-lg leading-tight">{item.name}</h4>
                            <p className="text-gold font-inter font-semibold mt-1">{item.price.toFixed(2)} €</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 border border-espresso/30 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                                <Minus size={12} />
                              </button>
                              <span className="font-inter text-espresso font-semibold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 border border-espresso/30 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between items-end">
                            <button onClick={() => removeItem(item.id)} className="text-espresso/30 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                            <span className="font-playfair text-espresso font-bold">{(item.price * item.quantity).toFixed(2)} €</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 bg-white border-t border-ivory-dark">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-espresso/70 font-inter"><span>Sous-total</span><span>{subtotal.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-espresso/70 font-inter"><span>Livraison</span><span>{DELIVERY_FEE.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-espresso font-bold text-xl font-playfair border-t border-ivory-dark pt-3">
                      <span>Total</span><span className="text-gold">{total.toFixed(2)} €</span>
                    </div>
                  </div>
                  {subtotal < MIN_ORDER && (
                    <p className="text-terracotta text-sm font-inter text-center mb-4">
                      Minimum : {MIN_ORDER} € (encore {(MIN_ORDER - subtotal).toFixed(2)} €)
                    </p>
                  )}
                  <button
                    onClick={() => { closeCart(); setCheckoutOpen(true) }}
                    disabled={subtotal < MIN_ORDER}
                    className="btn-gold w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Passer commande
                  </button>
                  <button onClick={closeCart} className="w-full text-center text-espresso/60 text-sm font-inter mt-3 hover:text-espresso transition-colors">
                    Continuer ma sélection
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  )
}
