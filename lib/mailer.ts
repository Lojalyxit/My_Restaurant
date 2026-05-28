import { Resend } from 'resend'
import type { CreateOrderInput, CreateReservationInput } from '@/types/api'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO = process.env.MANAGER_EMAIL!

function fmt(amount: string | number): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount
  return isNaN(n) ? String(amount) : n.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €'
}

export async function sendOrderEmail(order: CreateOrderInput & { order_number?: string | number }) {
  const itemsHtml = order.items.map(i => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #EAE0CC;font-family:Georgia,serif;">${i.item_name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #EAE0CC;text-align:center;">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #EAE0CC;text-align:right;color:#D4A574;font-weight:bold;">${fmt(parseFloat(i.item_price) * i.quantity)}</td>
    </tr>`).join('')

  await resend.emails.send({
    from: 'Louise Restaurant <onboarding@resend.dev>',
    to: TO,
    subject: `🍽️ Commande ${order.order_number ?? 'N/A'} — ${order.customer_name} (${fmt(order.total)})`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5EFE0;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:#2A1810;padding:32px;text-align:center;">
    <h1 style="margin:0;color:#D4A574;font-family:Georgia,serif;font-style:italic;font-size:42px;font-weight:400;">Louise</h1>
    <p style="margin:8px 0 0;color:#F5EFE0;font-size:13px;letter-spacing:3px;text-transform:uppercase;">Nouvelle commande reçue</p>
  </div>
  <div style="background:#9B4A2F;padding:16px;text-align:center;">
    <p style="margin:0;color:#fff;font-size:18px;font-weight:bold;letter-spacing:2px;">${order.order_number ?? 'N/A'}</p>
  </div>
  <div style="padding:32px;">
    <h2 style="color:#2A1810;font-family:Georgia,serif;font-size:20px;margin:0 0 16px;border-bottom:2px solid #D4A574;padding-bottom:8px;">Client</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#666;width:140px;">Nom</td><td style="padding:6px 0;color:#2A1810;font-weight:bold;">${order.customer_name}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Téléphone</td><td style="padding:6px 0;"><a href="tel:${order.customer_phone}" style="color:#9B4A2F;font-weight:bold;">${order.customer_phone}</a></td></tr>
      ${order.customer_email ? `<tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;color:#2A1810;">${order.customer_email}</td></tr>` : ''}
    </table>

    <h2 style="color:#2A1810;font-family:Georgia,serif;font-size:20px;margin:24px 0 16px;border-bottom:2px solid #D4A574;padding-bottom:8px;">Livraison</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#666;width:140px;">Adresse</td><td style="padding:6px 0;color:#2A1810;">${order.delivery_address}</td></tr>
      ${order.delivery_neighborhood ? `<tr><td style="padding:6px 0;color:#666;">Quartier</td><td style="padding:6px 0;color:#2A1810;">${order.delivery_neighborhood}</td></tr>` : ''}
      ${order.delivery_instructions ? `<tr><td style="padding:6px 0;color:#666;">Instructions</td><td style="padding:6px 0;color:#9B4A2F;">${order.delivery_instructions}</td></tr>` : ''}
    </table>

    <h2 style="color:#2A1810;font-family:Georgia,serif;font-size:20px;margin:24px 0 16px;border-bottom:2px solid #D4A574;padding-bottom:8px;">Commande</h2>
    <table style="width:100%;border-collapse:collapse;background:#F5EFE0;">
      <thead>
        <tr style="background:#2A1810;">
          <th style="padding:10px 12px;color:#D4A574;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Plat</th>
          <th style="padding:10px 12px;color:#D4A574;text-align:center;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Qté</th>
          <th style="padding:10px 12px;color:#D4A574;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Prix</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      <tr><td style="padding:6px 0;color:#666;text-align:right;">Sous-total</td><td style="padding:6px 0;text-align:right;width:160px;">${fmt(order.subtotal)}</td></tr>
      <tr><td style="padding:6px 0;color:#666;text-align:right;">Livraison</td><td style="padding:6px 0;text-align:right;">${fmt(order.delivery_fee)}</td></tr>
      <tr style="background:#2A1810;">
        <td style="padding:12px 16px;color:#D4A574;text-align:right;font-family:Georgia,serif;font-size:18px;">TOTAL</td>
        <td style="padding:12px 16px;color:#D4A574;text-align:right;font-family:Georgia,serif;font-size:22px;font-weight:bold;">${fmt(order.total)}</td>
      </tr>
    </table>
    <div style="margin-top:20px;background:#2D5F4E;padding:12px;text-align:center;border-radius:4px;">
      <p style="margin:0;color:#fff;font-size:13px;">Paiement à la livraison · Cash ou Mobile Money</p>
    </div>
  </div>
  <div style="background:#2A1810;padding:20px;text-align:center;">
    <p style="margin:0;color:#D4A574;font-size:12px;letter-spacing:1px;">© Louise 2026 · La gastronomie africaine, livrée avec amour</p>
  </div>
</div>
</body></html>`,
  })
}

export async function sendReservationEmail(reservation: CreateReservationInput) {
  const guests = reservation.nombre_personnes
  await resend.emails.send({
    from: 'Louise Restaurant <onboarding@resend.dev>',
    to: TO,
    subject: `📅 Réservation — ${reservation.nom} · ${reservation.date_reservation} à ${reservation.heure} (${guests} pers.)`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5EFE0;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:#2A1810;padding:32px;text-align:center;">
    <h1 style="margin:0;color:#D4A574;font-family:Georgia,serif;font-style:italic;font-size:42px;font-weight:400;">Louise</h1>
    <p style="margin:8px 0 0;color:#F5EFE0;font-size:13px;letter-spacing:3px;text-transform:uppercase;">Nouvelle réservation</p>
  </div>
  <div style="background:#9B4A2F;padding:16px;text-align:center;">
    <p style="margin:0;color:#fff;font-size:20px;font-weight:bold;">${reservation.date_reservation} à ${reservation.heure} · ${guests} personne${guests > 1 ? 's' : ''}</p>
  </div>
  <div style="padding:32px;">
    <h2 style="color:#2A1810;font-family:Georgia,serif;font-size:20px;margin:0 0 16px;border-bottom:2px solid #D4A574;padding-bottom:8px;">Détails</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#666;width:140px;">Nom</td><td style="padding:8px 0;color:#2A1810;font-weight:bold;font-size:18px;">${reservation.nom}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Téléphone</td><td style="padding:8px 0;"><a href="tel:${reservation.telephone}" style="color:#9B4A2F;font-weight:bold;font-size:16px;">${reservation.telephone}</a></td></tr>
      <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;color:#2A1810;">${reservation.email}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Date</td><td style="padding:8px 0;color:#2A1810;font-weight:bold;">${reservation.date_reservation}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Heure</td><td style="padding:8px 0;color:#2A1810;font-weight:bold;">${reservation.heure}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Personnes</td><td style="padding:8px 0;color:#2A1810;font-weight:bold;">${guests}</td></tr>
      ${reservation.message ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top;">Message</td><td style="padding:8px 0;color:#9B4A2F;font-style:italic;">${reservation.message}</td></tr>` : ''}
    </table>
  </div>
  <div style="background:#2A1810;padding:20px;text-align:center;">
    <p style="margin:0;color:#D4A574;font-size:12px;letter-spacing:1px;">© Louise 2026 · La gastronomie africaine, livrée avec amour</p>
  </div>
</div>
</body></html>`,
  })
}
