import { INITIAL_INVENTORY, INITIAL_LOGS, INITIAL_MACHINE } from './data'
import type { CartItem, CustomerProfile, IngredientInventoryItem, MachineStatus, Order, SystemLogEntry } from './types'

const KEY = 'smartbrew-v1'
interface State { customer: CustomerProfile; inventory: IngredientInventoryItem[]; orders: Order[]; machine: MachineStatus; logs: SystemLogEntry[] }
/**
 * Creates the complete seed state used by a fresh browser.
 *
 * @returns Demo customer, inventory, order, machine, and log data.
 */
export function seedState(): State { const sampleItem: CartItem = { id: 'sample-line', drinkId: 'flat-white', customization: { strength: 'Regular', temperature: 'Hot', milk: 'Dairy', syrup: 'None', syrupShots: 0 }, quantity: 1, unitPrice: 37, calories: 190 }; const sampleOrder: Order = { id: 'SB-DEMO-001', timestamp: new Date(Date.now() - 86400000).toISOString(), items: [sampleItem], total: 37, paymentMethod: 'Digital wallet (simulated)', paymentStatus: 'Approved', identity: 'customer-1', status: 'Completed (demo brew)' }; return { customer: { id: 'customer-1', email: 'customer@smartbrew.demo', password: 'brew123', name: 'Alex Morgan', preferences: { flavor: 'Balanced', milk: 'Any', temperature: 'Any', goal: 'No preference' }, recipes: [], orders: [sampleOrder] }, inventory: structuredClone(INITIAL_INVENTORY), orders: [sampleOrder], machine: { ...INITIAL_MACHINE }, logs: [...INITIAL_LOGS] } }
/**
 * Reads persisted state, falling back to seed data when storage is missing or malformed.
 *
 * @returns The current browser-local demo state.
 */
export function loadState(): State { try { const raw = localStorage.getItem(KEY); if (!raw) return seedState(); const value = JSON.parse(raw) as State; if (!value.customer || !Array.isArray(value.inventory)) return seedState(); return value } catch { return seedState() } }
/**
 * Persists the complete demo state to browser localStorage.
 *
 * @param state - Complete mutable demo state to serialize.
 * @returns Nothing; the state is written as a side effect.
 */
export function saveState(state: State): void { localStorage.setItem(KEY, JSON.stringify(state)) }
/**
 * Replaces persisted data with a fresh seeded demo state.
 *
 * @returns The reset state that was saved.
 */
export function resetState(): State { const state = seedState(); saveState(state); return state }
