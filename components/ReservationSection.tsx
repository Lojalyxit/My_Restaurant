'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createReservation } from '@/lib/api'
import { CheckCircle, AlertCircle } from 'lucide-react'

const schema = z.object({
  name:    z.string().min(2, 'Nom requis'),
  email:   z.string().email('Email invalide'),
  phone:   z.string().min(8, 'Téléphone requis'),
  date:    z.string().min(1, 'Date requise'),
  time:    z.string().min(1, 'Heure requise'),
  guests:  z.coerce.number().min(1).max(20),
  message: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const inputCls = "w-full bg-white border border-ivory-dark px-4 py-3 font-inter text-espresso placeholder-espresso/40 focus:outline-none focus:border-gold transition-colors"

const TIMES = ['12:00', '12:30', '13:00', '13:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']

export default function ReservationSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { guests: 2 },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setApiError('')
    try {
      await createReservation({
        nom:              data.name,
        email:            data.email,
        telephone:        data.phone,
        date_reservation: data.date,
        heure:            data.time.length === 5 ? `${data.time}:00` : data.time,
        nombre_personnes: data.guests,
        message:          data.message || '',
      })
      setSuccess(true)
      reset()
    } catch {
      setApiError('Une erreur est survenue. Veuillez réessayer ou nous appeler.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="reservation" className="section-padding bg-espresso" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold/70 tracking-[0.3em] uppercase text-sm mb-4 font-inter">Dîner chez Louise</p>
          <h2 className="font-playfair text-5xl text-ivory mb-6">
            Réservez votre<br /><em className="text-gold">table</em>
          </h2>
          <p className="text-ivory/60 font-inter">Pour une expérience sur place inoubliable, réservez à l&apos;avance.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-ivory p-10"
        >
          {success ? (
            <div className="text-center py-8">
              <CheckCircle size={64} className="text-gold mx-auto mb-6" />
              <h3 className="font-playfair text-3xl text-espresso mb-4">Réservation reçue !</h3>
              <p className="text-espresso/70 font-inter">
                Nous vous confirmerons par email sous 24h.<br />
                Au plaisir de vous accueillir chez Louise.
              </p>
              <button onClick={() => setSuccess(false)} className="btn-gold mt-8">
                Nouvelle réservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input {...register('name')} placeholder="Nom complet *" className={inputCls} />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input {...register('email')} type="email" placeholder="Email *" className={inputCls} />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input {...register('phone')} placeholder="Téléphone *" className={inputCls} />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <input {...register('guests')} type="number" min="1" max="20" placeholder="Personnes *" className={inputCls} />
                  {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input {...register('date')} type="date" className={inputCls} />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <select {...register('time')} className={inputCls}>
                    <option value="">Heure *</option>
                    {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
                </div>
              </div>
              <textarea
                {...register('message')}
                placeholder="Allergies, occasion spéciale... (optionnel)"
                rows={4}
                className={inputCls}
              />

              {apiError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 text-red-700 font-inter text-sm">
                  <AlertCircle size={18} className="shrink-0" />
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                {loading ? <span className="animate-spin">◌</span> : 'Réserver ma table'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
