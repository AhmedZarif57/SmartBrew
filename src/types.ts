export type Category = 'Coffee' | 'Signature' | 'Iced' | 'Other'
export type Strength = 'Mild' | 'Regular' | 'Strong'
export type Milk = 'Dairy' | 'Oat' | 'Almond' | 'None'
export type Temperature = 'Hot' | 'Iced'
export type Syrup = 'None' | 'Vanilla' | 'Caramel' | 'Chocolate'
export type UserRole = 'customer' | 'technician' | 'guest'

export interface Drink {
  id: string; name: string; category: Category; description: string
  price: number; calories: number; hasCoffee: boolean; requiresMilk: boolean; supportsIced: boolean
}
export interface Customization { strength: Strength; temperature: Temperature; milk: Milk; syrup: Syrup; syrupShots: number }
export interface IngredientInventoryItem { id: string; name: string; unit: string; quantity: number; capacity: number }
export interface Preferences { flavor: 'Balanced' | 'Sweet' | 'Strong'; milk: 'Any' | 'Dairy-free' | 'Dairy'; temperature: 'Any' | Temperature; goal: 'No preference' | 'Lower calorie' }
export interface CustomerProfile { id: string; email: string; password: string; name: string; preferences: Preferences; recipes: SavedRecipe[]; orders: Order[] }
export interface SavedRecipe { id: string; name: string; drinkId: string; customization: Customization }
export interface CartItem { id: string; drinkId: string; customization: Customization; quantity: number; unitPrice: number; calories: number }
export interface Order { id: string; timestamp: string; items: CartItem[]; total: number; paymentMethod: string; paymentStatus: 'Approved' | 'Declined'; identity: string; status: string }
export interface Receipt { orderId: string; choice: 'QR code' | 'Email' | 'No receipt'; email?: string }
export interface MachineStatus { groundsFill: number; liquidFill: number; operational: boolean }
export interface SystemLogEntry { id: string; timestamp: string; level: 'Info' | 'Warning' | 'Error'; category: string; message: string }
export interface Weather { city: string; temperature: number; condition: string }
