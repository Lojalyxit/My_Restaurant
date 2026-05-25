import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Louise — La gastronomie africaine, livrée avec amour',
  description: 'Cuisine africaine gastronomique, dressée comme dans un restaurant étoilé, livrée chez vous avec amour.',
  keywords: 'restaurant africain, livraison, gastronomie, jollof, mafé, thiéboudienne',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-inter bg-ivory antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#2A1810',
              color: '#D4A574',
              border: '1px solid #D4A574',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </body>
    </html>
  )
}
