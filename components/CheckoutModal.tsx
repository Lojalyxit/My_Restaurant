'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, CheckCircle, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCartStore } from '@/store/cartStore'
import { createOrder } from '@/lib/api'

const DELIVERY_FEE = 2.90

const step1Schema = z.object({
  name:  z.string().min(2, 'Nom requis'),
  phone: z.string().min(8, 'Téléphone requis'),
  email: z.string().email('Email invalide'),
})
const step2Schema = z.object({
  street:       z.string().min(3, 'Adresse requise'),
  neighborhood: z.string().min(2, 'Quartier requis'),
  instructions: z.string().optional(),
})
type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>

const inputCls = "w-full bg-ivory border border-ivory-dark px-4 py-3 font-inter text-espresso placeholder-espresso/40 focus:outline-none focus:border-gold transition-colors"

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2 })
}

export default function CheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [apiError, setApiError] = useState('')
  const { items, getSubtotal, clearCart } = useCartStore()
  const subtotal = getSubtotal()
  const total = subtotal + DELIVERY_FEE

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) })
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) })

  const handleStep1 = (data: Step1Data) => { setStep1Data(data); setStep(2) }
  const handleStep2 = () => setStep(3)

  const handleConfirm = async () => {
    if (!step1Data) return
    setLoading(true)
    setApiError('')
    const addr = form2.getValues()
    try {
      const order = await createOrder({
        customer_name:          step1Data.name,
        customer_phone:         step1Data.phone,
        customer_email:         step1Data.email,
        delivery_address:       addr.street,
        delivery_neighborhood:  addr.neighborhood,
        delivery_instructions:  addr.instructions || '',
        subtotal:     subtotal.toFixed(2),
        delivery_fee: DELIVERY_FEE.toFixed(2),
        total:        total.toFixed(2),
        items: items.map((i) => ({
          menu_item:  parseInt(i.id, 10),
          item_name:  i.name,
          item_price: i.price.toFixed(2),
          quantity:   i.quantity,
        })),
      })
      setOrderId(order.id)
      clearCart()
      setSuccess(true)
    } catch {
      setApiError('Une erreur est survenue. Veuillez réessayer ou nous appeler.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1); setSuccess(false); setOrderId(null); setApiError('')
    form1.reset(); form2.reset(); onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-espresso/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-ivory w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-espresso p-6 flex items-center justify-between">
              <h2 className="font-playfair italic text-gold text-2xl">Finaliser ma commande</h2>
              <button onClick={handleClose} className="text-ivory/60 hover:text-gold transition-colors">
                <X size={24} />
              </button>
            </div>

            {!success && (
              <div className="flex bg-white border-b border-ivory-dark">
                {['Coordonnées', 'Adresse', 'Confirmation'].map((s, i) => (
                  <div
                    key={s}
                    className={`flex-1 py-4 text-center text-sm font-inter uppercase tracking-wider transition-colors ${
                      step > i ? 'text-gold border-b-2 border-gold' : 'text-espresso/40'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

            <div className="p-8">
              {success ? (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <Heart size={64} className="text-gold mx-auto mb-6" fill="#D4A574" />
                  </motion.div>
                  <h3 className="font-playfair text-3xl text-espresso mb-4">Merci !</h3>
                  <p className="text-espresso/70 font-inter mb-4">Louise prépare votre commande avec amour.</p>
                  {orderId && (
                    <p className="text-gold font-playfair text-xl mb-8">Commande n° {orderId}</p>
                  )}
                  <p className="text-espresso/60 font-inter text-sm mb-8">
                    Confirmation SMS sous quelques minutes.<br />Livraison estimée : 30–45 minutes.
                  </p>
                  <button onClick={handleClose} className="btn-gold">Retour à Louise</button>
                </div>
              ) : step === 1 ? (
                <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-6">
                  <h3 className="font-playfair text-2xl text-espresso">Vos coordonnées</h3>
                  <div>
                    <input {...form1.register('name')} placeholder="Nom complet" className={inputCls} />
                    {form1.formState.errors.name && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.name.message}</p>}
                  </div>
                  <div>
                    <input {...form1.register('phone')} placeholder="Téléphone" className={inputCls} />
                    {form1.formState.errors.phone && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.phone.message}</p>}
                  </div>
                  <div>
                    <input {...form1.register('email')} placeholder="Email" className={inputCls} />
                    {form1.formState.errors.email && <p className="text-red-500 text-sm mt-1">{form1.formState.errors.email.message}</p>}
                  </div>
                  <button type="submit" className="btn-gold w-full">Continuer</button>
                </form>
              ) : step === 2 ? (
                <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-6">
                  <h3 className="font-playfair text-2xl text-espresso">Adresse de livraison</h3>
                  <div>
                    <input {...form2.register('street')} placeholder="Rue / Adresse complète" className={inputCls} />
                    {form2.formState.errors.street && <p className="text-red-500 text-sm mt-1">{form2.formState.errors.street.message}</p>}
                  </div>
                  <div>
                    <input {...form2.register('neighborhood')} placeholder="Quartier" className={inputCls} />
                    {form2.formState.errors.neighborhood && <p className="text-red-500 text-sm mt-1">{form2.formState.errors.neighborhood.message}</p>}
                  </div>
                  <textarea
                    {...form2.register('instructions')}
                    placeholder="Instructions de livraison (optionnel)"
                    rows={3}
                    className={inputCls}
                  />
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline-gold flex-1">Retour</button>
                    <button type="submit" className="btn-gold flex-1">Continuer</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <h3 className="font-playfair text-2xl text-espresso">Récapitulatif</h3>
                  <div className="bg-white p-6 border border-ivory-dark space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-espresso font-inter">
                        <span>{item.name} × {item.quantity}</span>
                        <span>{fmt(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t border-ivory-dark pt-3 space-y-1">
                      <div className="flex justify-between text-espresso/70 font-inter text-sm">
                        <span>Sous-total</span><span>{fmt(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-espresso/70 font-inter text-sm">
                        <span>Livraison</span><span>{fmt(DELIVERY_FEE)}</span>
                      </div>
                      <div className="flex justify-between text-gold font-playfair text-xl font-bold mt-2">
                        <span>Total</span><span>{fmt(total)}</span>
                      </div>
                    </div>
                  </div>

                  {apiError && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 text-red-700 font-inter text-sm">
                      <AlertCircle size={18} className="shrink-0" />
                      {apiError}
                    </div>
                  )}

                  <div className="bg-jade/10 border border-jade/30 p-4 text-center">
                    <p className="text-jade font-inter text-sm">Paiement à la livraison · Cash ou Mobile Money</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="btn-outline-gold flex-1">Retour</button>
                    <button
                      onClick={handleConfirm}
                      disabled={loading}
                      className="btn-gold flex-1 flex items-center justify-center gap-2"
                    >
                      {loading ? <span className="animate-spin">◌</span> : <><CheckCircle size={16} />Confirmer</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
