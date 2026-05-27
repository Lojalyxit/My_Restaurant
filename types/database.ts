export interface CartItem {
  id: string       // String(MenuItem.id) from Django
  name: string
  price: number    // parseFloat(MenuItem.price)
  quantity: number
  image_url: string
}
