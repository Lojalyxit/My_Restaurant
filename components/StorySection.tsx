'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

export default function StorySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="histoire" className="section-padding bg-ivory-light" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4 font-inter">Notre Histoire</p>
            <h2 className="font-playfair text-5xl md:text-6xl text-espresso mb-8 leading-tight">
              L&apos;âme de<br />
              <em className="text-terracotta">Louise</em>
            </h2>
            <div className="w-16 h-px bg-gold mb-8" />
            <p className="text-espresso/80 text-lg leading-relaxed mb-6 font-inter">
              Louise est née dans la chaleur d&apos;une cuisine familiale, là où les femmes de la maison transmettaient, de main en main, les secrets d&apos;une Afrique sublime. Des épices soigneusement dosées, des bouillons mijotés des heures, des gestes appris dans le silence de l&apos;aube.
            </p>
            <p className="text-espresso/80 text-lg leading-relaxed mb-6 font-inter">
              Aujourd&apos;hui, nous sublisons ces recettes ancestrales avec les techniques de la grande gastronomie. Chaque assiette est une déclaration d&apos;amour : au continent, à la famille, à celles et ceux qui ont nourri notre âme avant de nourrir nos corps.
            </p>
            <p className="text-espresso/80 text-lg leading-relaxed mb-10 font-inter">
              Chez Louise, la cuisine africaine prend la place qu&apos;elle mérite — celle d&apos;une gastronomie raffinée, émouvante, et profondément humaine.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-gold" />
              <span className="font-playfair italic text-terracotta text-3xl">Louise</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[600px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
                alt="Chef Louise en cuisine"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-gold -z-10" />
            <div className="absolute bottom-8 left-8 bg-espresso/90 backdrop-blur-sm p-6">
              <p className="text-gold font-playfair text-4xl font-bold">15+</p>
              <p className="text-ivory/80 text-sm tracking-wider uppercase">Années de passion</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          {[
            { title: 'Authenticité', desc: 'Des recettes transmises de génération en génération, préservées dans leur essence.' },
            { title: 'Excellence', desc: 'Des techniques gastronomiques modernes au service de saveurs ancestrales.' },
            { title: 'Amour', desc: "Chaque plat préparé avec le soin d'une cuisine familiale, pour vous." },
          ].map((val) => (
            <div key={val.title} className="text-center p-8 border border-ivory-dark hover:border-gold transition-colors duration-300">
              <div className="w-8 h-px bg-gold mx-auto mb-6" />
              <h3 className="font-playfair text-2xl text-espresso mb-4">{val.title}</h3>
              <p className="text-espresso/70 font-inter leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
