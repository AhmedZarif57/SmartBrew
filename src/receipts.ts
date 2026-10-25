import QRCode from 'qrcode'
import type { Order } from './types'

/**
 * Generates a QR image data URL tied to a completed simulated order.
 *
 * @param order - Approved order whose ID and status are encoded in the QR payload.
 * @returns A promise resolving to a browser image data URL.
 */
export async function createReceiptQr(order: Order): Promise<string> { return QRCode.toDataURL(`smartbrew://receipt/${order.id}?total=${order.total}&status=${order.paymentStatus}`, { width: 220, margin: 2 }) }
