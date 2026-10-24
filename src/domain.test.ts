import { describe, expect, it } from 'vitest'
import { applyWeatherAdjustment, calculateCalories, calculatePrice, deductStock, getBaseRecommendationOrder, rankRecommendations, requirements, stockShortages } from './domain'
import { DRINKS, INITIAL_INVENTORY } from './data'
import type { Customization } from './types'

const latte = DRINKS.find(drink => drink.id === 'latte')!
const custom: Customization = { strength: 'Strong', temperature: 'Hot', milk: 'Oat', syrup: 'Vanilla', syrupShots: 2 }

describe('SmartBrew domain rules', () => {
  it('calculates price and illustrative calories centrally', () => { expect(calculatePrice(latte, custom)).toBe(49); expect(calculateCalories(latte, custom)).toBe(230) })
  it('calculates multiplied requirements and shortages', () => { expect(requirements(latte, custom, 2)).toEqual({ cups: 2, beans: 44, oat: 300, vanilla: 40 }); expect(stockShortages(latte, custom, [{ ...INITIAL_INVENTORY[0], quantity: 10 }])).toContain('Coffee beans needs 22g') })
  it('never deducts stock when a request is invalid', () => { expect(() => deductStock([{ ...INITIAL_INVENTORY[0], quantity: 1 }], latte, custom)).toThrow(); expect(deductStock(INITIAL_INVENTORY, latte, custom).find(item => item.id === 'beans')?.quantity).toBe(728) })
  it('defines a stable unique top three for all 18 preference combinations', () => {
    const flavors = ['Balanced', 'Sweet', 'Strong'] as const
    const temperatures = ['Iced', 'Any', 'Hot'] as const
    const goals = ['No preference', 'Lower calorie'] as const
    flavors.forEach(flavor => temperatures.forEach(temperature => goals.forEach(goal => {
      const preferences = { flavor, temperature, goal, milk: 'Any' as const }
      const result = rankRecommendations(DRINKS, preferences, [], null)
      expect(result).toHaveLength(3)
      expect(new Set(result.map(item => item.drink.id)).size).toBe(3)
      expect(result.map(item => item.drink.id)).toEqual(getBaseRecommendationOrder(preferences))
    })))
  })
  it('keeps low-calorie explanations truthful and filters unavailable drinks', () => {
    const preferences = { flavor: 'Sweet' as const, temperature: 'Any' as const, goal: 'Lower calorie' as const, milk: 'Any' as const }
    const result = rankRecommendations(DRINKS, preferences, [], null, INITIAL_INVENTORY)
    expect(result.every(item => item.drink.calories <= 100 || !item.reason.toLowerCase().includes('lower-calorie'))).toBe(true)
    const unavailable = INITIAL_INVENTORY.map(item => item.id === 'beans' ? { ...item, quantity: 0 } : item)
    expect(rankRecommendations(DRINKS, { ...preferences, flavor: 'Strong' }, [], null, unavailable).every(item => item.drink.id !== 'espresso' && item.drink.id !== 'americano' && item.drink.id !== 'flat-white')).toBe(true)
  })
  it('nudges weather-suitable drinks by at most one position', () => {
    const baseline = ['espresso', 'americano', 'flat-white']
    expect(applyWeatherAdjustment(baseline, DRINKS, null)).toEqual(baseline)
    expect(applyWeatherAdjustment(baseline, DRINKS, 12)).toEqual(baseline)
    expect(applyWeatherAdjustment(['espresso', 'iced-latte', 'americano'], DRINKS, 22)).toEqual(['iced-latte', 'espresso', 'americano'])
    expect(applyWeatherAdjustment(['espresso', 'americano', 'iced-latte'], DRINKS, 22)).toEqual(['espresso', 'iced-latte', 'americano'])
  })
})
