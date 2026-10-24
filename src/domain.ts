import type { CartItem, Customization, Drink, IngredientInventoryItem, Order, Preferences, SystemLogEntry } from './types'

export const BEAN_GRAMS = { Mild: 14, Regular: 18, Strong: 22 }

/** Returns a stable unique identifier for demo records. */
export function makeId(prefix: string): string { return `${prefix}-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}` }
/** Calculates one customized drink's price from the catalog and options. */
export function calculatePrice(drink: Drink, customization: Customization): number { return drink.price + customization.syrupShots * 3 + (customization.milk === 'Oat' ? 4 : customization.milk === 'Almond' ? 3 : 0) }
/** Calculates one customized drink's illustrative calorie estimate. */
export function calculateCalories(drink: Drink, customization: Customization): number { const milk = drink.requiresMilk ? (customization.milk === 'Dairy' ? 90 : customization.milk === 'Oat' ? 70 : customization.milk === 'Almond' ? 35 : 0) : 0; return drink.calories + milk + customization.syrupShots * 20 }
/** Computes ingredient requirements for one drink. */
export function requirements(drink: Drink, customization: Customization, quantity = 1): Record<string, number> { const result: Record<string, number> = { cups: quantity }; if (drink.hasCoffee) result.beans = BEAN_GRAMS[customization.strength] * quantity; if (drink.requiresMilk && customization.milk !== 'None') result[customization.milk.toLowerCase()] = 150 * quantity; if (customization.syrup !== 'None' && customization.syrupShots) result[customization.syrup.toLowerCase()] = customization.syrupShots * 10 * quantity; return result }
/** Returns human-readable inventory shortages for a requested recipe. */
export function stockShortages(drink: Drink, customization: Customization, inventory: IngredientInventoryItem[], quantity = 1): string[] { const needed = requirements(drink, customization, quantity); return Object.entries(needed).filter(([id, amount]) => (inventory.find(item => item.id === id)?.quantity ?? 0) < amount).map(([id, amount]) => { const item = inventory.find(entry => entry.id === id); return `${item?.name ?? id} needs ${amount}${item?.unit ?? ''}` }) }
/** Deducts a validated recipe from inventory without allowing negative values. */
export function deductStock(inventory: IngredientInventoryItem[], drink: Drink, customization: Customization, quantity = 1): IngredientInventoryItem[] { const shortages = stockShortages(drink, customization, inventory, quantity); if (shortages.length) throw new Error(shortages.join(', ')); const needed = requirements(drink, customization, quantity); return inventory.map(item => ({ ...item, quantity: item.quantity - (needed[item.id] ?? 0) })) }
/** Calculates the total value of cart lines. */
export function cartTotal(cart: CartItem[]): number { return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) }
type Recommendation = { drink: Drink; reason: string; score: number }
type RecommendationInventory = IngredientInventoryItem[]

const BASE_RECOMMENDATION_ORDER: Record<string, string[]> = {
  'Balanced|Iced|No preference': ['iced-latte', 'cappuccino', 'flat-white'],
  'Balanced|Iced|Lower calorie': ['iced-latte', 'americano', 'espresso'],
  'Balanced|Any|No preference': ['cappuccino', 'flat-white', 'americano'],
  'Balanced|Any|Lower calorie': ['americano', 'espresso', 'cappuccino'],
  'Balanced|Hot|No preference': ['cappuccino', 'flat-white', 'latte'],
  'Balanced|Hot|Lower calorie': ['americano', 'espresso', 'cappuccino'],
  'Sweet|Iced|No preference': ['mocha', 'caramel-latte', 'iced-latte'],
  'Sweet|Iced|Lower calorie': ['iced-latte', 'latte', 'caramel-latte'],
  'Sweet|Any|No preference': ['mocha', 'caramel-latte', 'hot-chocolate'],
  'Sweet|Any|Lower calorie': ['latte', 'iced-latte', 'caramel-latte'],
  'Sweet|Hot|No preference': ['caramel-latte', 'mocha', 'hot-chocolate'],
  'Sweet|Hot|Lower calorie': ['latte', 'caramel-latte', 'mocha'],
  'Strong|Iced|No preference': ['iced-latte', 'espresso', 'americano'],
  'Strong|Iced|Lower calorie': ['espresso', 'americano', 'iced-latte'],
  'Strong|Any|No preference': ['espresso', 'americano', 'flat-white'],
  'Strong|Any|Lower calorie': ['espresso', 'americano', 'flat-white'],
  'Strong|Hot|No preference': ['espresso', 'flat-white', 'americano'],
  'Strong|Hot|Lower calorie': ['espresso', 'americano', 'flat-white'],
}

const TASTE_MATCHES: Record<Preferences['flavor'], string[]> = {
  Balanced: ['americano', 'cappuccino', 'latte', 'flat-white', 'iced-latte'],
  Sweet: ['mocha', 'caramel-latte', 'hot-chocolate'],
  Strong: ['espresso', 'americano', 'flat-white'],
}

/** Returns the explicit baseline order for one taste, temperature, and calorie combination. */
export function getBaseRecommendationOrder(preferences: Preferences): string[] {
  return BASE_RECOMMENDATION_ORDER[`${preferences.flavor}|${preferences.temperature}|${preferences.goal}`] ?? []
}

/** Returns whether a catalog drink is served in the selected temperature style. */
function matchesTemperature(drink: Drink, temperature: Preferences['temperature']): boolean {
  if (temperature === 'Any') return true
  return temperature === 'Iced' ? drink.id === 'iced-latte' : drink.id !== 'iced-latte'
}

/** Builds one factual explanation for a recommendation and its compromises. */
export function buildRecommendationReason(drink: Drink, preferences: Preferences, temperature: number | null): string {
  const tasteMatch = TASTE_MATCHES[preferences.flavor].includes(drink.id)
  const temperatureMatch = matchesTemperature(drink, preferences.temperature)
  const calorieMatch = preferences.goal === 'No preference' || drink.calories <= 100
  if (preferences.temperature === 'Iced' && temperatureMatch) return 'Your closest iced match in the current menu.'
  if (preferences.goal === 'Lower calorie' && calorieMatch && tasteMatch) return `A ${preferences.flavor.toLowerCase()} and lower-calorie choice.`
  if (preferences.goal === 'Lower calorie' && !calorieMatch) return `A ${tasteMatch ? preferences.flavor.toLowerCase() : 'close'} match, but higher in estimated calories.`
  if (temperatureMatch && tasteMatch && temperature === null) return `A ${preferences.flavor.toLowerCase()} choice served at your preferred temperature.`
  if (temperatureMatch && tasteMatch && temperature !== null && temperature <= 8) return 'A warm option that suits today\'s cooler weather.'
  if (temperatureMatch && tasteMatch) return `A ${preferences.flavor.toLowerCase()} option for your preferences.`
  if (tasteMatch) return `A ${preferences.flavor.toLowerCase()} match with a temperature compromise.`
  if (temperatureMatch) return 'A close alternative for your selected temperature.'
  return 'A close alternative from the current menu.'
}

/** Applies a maximum one-position weather nudge without changing the baseline tie order. */
export function applyWeatherAdjustment(order: string[], drinks: Drink[], temperature: number | null): string[] {
  if (temperature === null || (temperature > 8 && temperature < 20)) return order
  const catalog = new Map(drinks.map(drink => [drink.id, drink]))
  const targetId = order.find(id => temperature <= 8 ? catalog.get(id)?.id !== 'iced-latte' : catalog.get(id)?.id === 'iced-latte')
  if (!targetId) return order
  const index = order.indexOf(targetId)
  if (index <= 0) return order
  const adjusted = [...order]
  adjusted.splice(index, 1)
  adjusted.splice(index - 1, 0, targetId)
  return adjusted
}

/** Ranks three unique, available catalog drinks from the deterministic preference table. */
export function rankRecommendations(drinks: Drink[], preferences: Preferences, _orders: Order[] = [], temperature: number | null = null, inventory?: RecommendationInventory): Recommendation[] {
  const catalog = new Map(drinks.map(drink => [drink.id, drink]))
  const defaultCustomization = (drink: Drink): Customization => ({ strength: 'Regular', temperature: drink.id === 'iced-latte' ? 'Iced' : 'Hot', milk: drink.requiresMilk ? 'Dairy' : 'None', syrup: 'None', syrupShots: 0 })
  const available = (drink: Drink): boolean => !inventory || stockShortages(drink, defaultCustomization(drink), inventory).length === 0
  const baseline = getBaseRecommendationOrder(preferences)
  const weatherOrder = applyWeatherAdjustment(baseline, drinks, temperature)
  const orderedIds = [...weatherOrder, ...drinks.map(drink => drink.id)].filter((id, index, values) => values.indexOf(id) === index)
  const selected = orderedIds.map(id => catalog.get(id)).filter((drink): drink is Drink => Boolean(drink)).filter(available).slice(0, 3)
  return selected.map((drink, index) => ({ drink, reason: buildRecommendationReason(drink, preferences, temperature), score: selected.length - index }))
}

/** Describes why weather changed or did not change the recommendation baseline. */
export function recommendationWeatherMessage(city: string, temperature: number | null, unavailable: boolean, loading = false): string {
  if (loading) return `Checking the weather in ${city}…`
  if (unavailable || temperature === null) return 'Weather is unavailable right now. Recommendations still use your preferences.'
  if (temperature <= 8) return `A chilly day in ${city} — warm drinks get a little extra love.`
  if (temperature >= 20) return `A warm day in ${city} — iced drinks get a little extra love.`
  return `Mild weather in ${city}. Your drink preferences lead the way.`
}
/** Appends a timestamped system log entry. */
export function addLog(logs: SystemLogEntry[], level: SystemLogEntry['level'], category: string, message: string): SystemLogEntry[] { return [{ id: makeId('log'), timestamp: new Date().toISOString(), level, category, message }, ...logs] }
