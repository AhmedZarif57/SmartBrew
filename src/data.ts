import type { Drink, IngredientInventoryItem, MachineStatus, SystemLogEntry } from './types'

export const DRINKS: Drink[] = [
  { id: 'espresso', name: 'Espresso', category: 'Coffee', price: 25, calories: 5, description: 'A concentrated, precise shot with a lasting crema.', hasCoffee: true, requiresMilk: false, supportsIced: false },
  { id: 'americano', name: 'Americano', category: 'Coffee', price: 29, calories: 10, description: 'Espresso lengthened with clean, hot water.', hasCoffee: true, requiresMilk: false, supportsIced: false },
  { id: 'cappuccino', name: 'Cappuccino', category: 'Coffee', price: 35, calories: 90, description: 'Balanced espresso, steamed milk and a soft foam cap.', hasCoffee: true, requiresMilk: true, supportsIced: false },
  { id: 'latte', name: 'Latte', category: 'Coffee', price: 39, calories: 120, description: 'Silky milk brings a gentle espresso into focus.', hasCoffee: true, requiresMilk: true, supportsIced: true },
  { id: 'flat-white', name: 'Flat White', category: 'Coffee', price: 37, calories: 100, description: 'Velvety microfoam and a bold double espresso.', hasCoffee: true, requiresMilk: true, supportsIced: false },
  { id: 'mocha', name: 'Mocha', category: 'Signature', price: 42, calories: 180, description: 'Espresso and chocolate folded into warm milk.', hasCoffee: true, requiresMilk: true, supportsIced: false },
  { id: 'caramel-latte', name: 'Caramel Latte', category: 'Signature', price: 44, calories: 170, description: 'A mellow latte with a warm caramel finish.', hasCoffee: true, requiresMilk: true, supportsIced: true },
  { id: 'iced-latte', name: 'Iced Latte', category: 'Iced', price: 42, calories: 130, description: 'Chilled espresso and milk over a bright, clean finish.', hasCoffee: true, requiresMilk: true, supportsIced: true },
  { id: 'hot-chocolate', name: 'Hot Chocolate', category: 'Other', price: 34, calories: 160, description: 'Creamy chocolate warmth, with no coffee beans.', hasCoffee: false, requiresMilk: true, supportsIced: false }
]

export const INITIAL_INVENTORY: IngredientInventoryItem[] = [
  { id: 'beans', name: 'Coffee beans', unit: 'g', quantity: 750, capacity: 1000 },
  { id: 'dairy', name: 'Dairy milk', unit: 'ml', quantity: 2000, capacity: 3000 },
  { id: 'oat', name: 'Oat milk', unit: 'ml', quantity: 1000, capacity: 2000 },
  { id: 'almond', name: 'Almond milk', unit: 'ml', quantity: 800, capacity: 2000 },
  { id: 'vanilla', name: 'Vanilla syrup', unit: 'ml', quantity: 500, capacity: 800 },
  { id: 'caramel', name: 'Caramel syrup', unit: 'ml', quantity: 400, capacity: 800 },
  { id: 'chocolate', name: 'Chocolate syrup', unit: 'ml', quantity: 400, capacity: 800 },
  { id: 'cups', name: 'Cups', unit: 'pcs', quantity: 180, capacity: 250 }
]
export const INITIAL_MACHINE: MachineStatus = { groundsFill: 22, liquidFill: 18, operational: true }
export const INITIAL_LOGS: SystemLogEntry[] = [
  { id: 'log-1', timestamp: new Date(Date.now() - 3600000).toISOString(), level: 'Info', category: 'System', message: 'SmartBrew demo station initialized.' },
  { id: 'log-2', timestamp: new Date(Date.now() - 1800000).toISOString(), level: 'Info', category: 'Inventory', message: 'Daily stock check completed.' },
  { id: 'log-3', timestamp: new Date(Date.now() - 600000).toISOString(), level: 'Warning', category: 'Maintenance', message: 'Waste levels are monitored below the service threshold.' }
]
