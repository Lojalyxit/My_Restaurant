# Louise — Gastronomie Africaine

Site gastronomique premium pour **Louise**, restaurant africain haut de gamme avec livraison à domicile.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — palette custom (terracotta, gold, espresso, ivory, jade)
- **Framer Motion** — animations fluides
- **Supabase** — menu, commandes, réservations, newsletter
- **Zustand** — panier persistant (localStorage)
- **React Hook Form + Zod** — validation formulaires
- **Sonner** — toast notifications élégantes

## Installation

```bash
npm install
```

## Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Copiez `.env.local` et renseignez vos clés :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
```

3. Exécutez le SQL ci-dessous dans **Supabase > SQL Editor**

## SQL — Tables à créer

```sql
-- Menu
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('entrees','signatures','grillades','accompagnements','desserts','boissons')),
  image_url TEXT NOT NULL,
  is_signature BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_district TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_instructions TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 2.90,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL,
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS — acces public
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read menu" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- 10 plats de demo
INSERT INTO menu_items (name, description, price, category, image_url, is_signature) VALUES
('Ndole aux Crevettes', 'Feuilles de ndole mijotees, crevettes royales grillees, noix de palme torrefies', 18.90, 'entrees', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', false),
('Thieboudienne Royal', 'Riz au poisson facon Saint-Louis, legumes confits, sauce tomate reduite', 24.90, 'signatures', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80', true),
('Mafe Agneau Confit', 'Epaule agneau confite 8h, sauce arachide veloutee, patate douce caramelisee', 27.90, 'signatures', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80', true),
('Suya de Boeuf', 'Brochettes boeuf marine epices suya, arachides concassees, oignons confits', 22.90, 'grillades', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', false),
('Jollof Rice Signature', 'Riz jollof fume tomate, epices secretes Louise, plantain dore, salade chou', 19.90, 'signatures', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', true),
('Poulet DG Grille', 'Poulet fermier grille, banane plantain sautee, legumes croquants', 23.90, 'grillades', 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=600&q=80', true),
('Attieke Frais', 'Semoule manioc fraiche, oignons tomates brunoise, vinaigrette citronnee', 8.90, 'accompagnements', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', false),
('Banane Plantain Caramelisee', 'Plantain mur snacke beurre clarifie, caramel vanille, fleur sel', 9.90, 'desserts', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80', false),
('Yassa Poulet Destructure', 'Poulet fermier emince, oignons confits citron vert, olives marines', 21.90, 'signatures', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80', false),
('Bissap Royal', 'Infusion hibiscus artisanale, gingembre frais, menthe, petales cristallises', 6.90, 'boissons', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80', false);
```

## Lancement

```bash
npm run dev    # http://localhost:3000
npm run build  # build production
npm start      # serveur production
```

## Deploiement Vercel

1. Push sur GitHub
2. Import sur vercel.com
3. Ajouter les variables d'environnement Supabase
4. Deploy !

## Structure

```
app/
  globals.css
  layout.tsx
  page.tsx
components/
  CartSidebar.tsx       Panier coulissant
  CheckoutModal.tsx     Tunnel commande 3 etapes
  ContactSection.tsx
  Footer.tsx
  GallerySection.tsx    Galerie masonry + lightbox
  HeroSection.tsx       Hero plein ecran
  Loader.tsx            Loader ouverture
  Logo.tsx              Logo SVG
  MenuSection.tsx       Menu par onglets
  Navbar.tsx            Navbar transparente -> opaque
  OrderSection.tsx      Livraison 3 etapes
  ReservationSection.tsx
  ScrollToTop.tsx
  StorySection.tsx
  TestimonialsSection.tsx
lib/
  supabase.ts
store/
  cartStore.ts          Zustand panier
types/
  database.ts
.env.local
```

## Design System

| Token        | Valeur  | Usage            |
|-------------|---------|------------------|
| terracotta  | #9B4A2F | Couleur principale |
| gold        | #D4A574 | Accents, CTA     |
| espresso    | #2A1810 | Fonds sombres    |
| ivory       | #F5EFE0 | Fonds clairs     |
| jade        | #2D5F4E | Accent secondaire |

Typographie : Playfair Display (titres, italic) + Inter (corps)
