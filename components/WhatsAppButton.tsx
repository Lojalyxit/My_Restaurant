'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'

const WA_NUMBER = '224622365420'
const WA_URL = `https://wa.me/${WA_NUMBER}`

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const sendMessage = () => {
    const text = message.trim() || 'Bonjour Louise ! Je souhaite passer une commande.'
    window.open(`${WA_URL}?text=${encodeURIComponent(text)}`, '_blank')
    setMessage('')
    setOpen(false)
  }

  return (
    <>
      {/* Bubble de chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-6 z-50 w-80 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#075E54] px-4 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg font-bold font-serif italic">L</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Louise Restaurant</p>
                <p className="text-white/70 text-xs">Livraison · Dapompa Plateau, Conakry</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Message d'accueil */}
            <div className="bg-[#ECE5DD] px-4 py-4">
              <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm max-w-[85%]">
                <p className="text-gray-800 text-sm leading-relaxed">
                  👋 Bonjour ! Bienvenue chez <strong>Louise Restaurant</strong>.<br /><br />
                  Écrivez-nous pour passer une commande ou poser une question. Nous répondons rapidement ! 🍽️
                </p>
                <p className="text-gray-400 text-[10px] text-right mt-2">Louise</p>
              </div>
            </div>

            {/* Zone de saisie */}
            <div className="bg-[#F0F0F0] px-3 py-3 flex gap-2 items-end">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="Écrivez votre message..."
                rows={2}
                className="flex-1 bg-white rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none leading-snug"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#1ebe5d] transition-colors"
              >
                <Send size={16} className="text-white ml-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton flottant WhatsApp */}
      <motion.button
        onClick={() => setOpen(prev => !prev)}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:bg-[#1ebe5d] transition-colors"
        aria-label="Contacter sur WhatsApp"
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.675 4.8 1.849 6.79L2 30l7.41-1.824A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.46 11.46 0 0 1-5.847-1.6l-.418-.25-4.397 1.082 1.11-4.281-.273-.44A11.46 11.46 0 0 1 4.5 16C4.5 9.649 9.649 4.5 16 4.5S27.5 9.649 27.5 16 22.351 27.5 16 27.5zm6.29-8.61c-.345-.173-2.04-1.006-2.356-1.12-.316-.115-.546-.173-.776.173-.23.345-.89 1.12-1.09 1.35-.2.23-.4.26-.745.087-.345-.173-1.456-.537-2.774-1.712-1.025-.916-1.717-2.047-1.918-2.392-.2-.345-.021-.531.15-.703.155-.154.345-.402.518-.604.173-.2.23-.345.345-.575.115-.23.058-.432-.029-.604-.087-.173-.776-1.87-1.063-2.56-.28-.672-.563-.58-.776-.59l-.661-.011c-.23 0-.604.086-.92.432-.316.345-1.207 1.179-1.207 2.876s1.236 3.337 1.409 3.567c.172.23 2.434 3.716 5.897 5.211.824.356 1.467.568 1.968.728.827.263 1.58.226 2.174.137.663-.099 2.04-.833 2.327-1.638.287-.805.287-1.495.2-1.638-.086-.143-.316-.23-.661-.403z"/>
        </svg>

        {/* Badge pulse */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative w-3 h-3 bg-red-500 rounded-full" />
          </span>
        )}
      </motion.button>
    </>
  )
}
