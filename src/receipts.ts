import QRCode from 'qrcode'
import type { Order } from './types'

/** Generates a data URL QR image tied to a completed order. */
export async function createReceiptQr(order: Order): Promise<string> { return QRCode.toDataURL(`smartbrew://receipt/${order.id}?total=${order.total}&status=${order.paymentStatus}`, { width: 220, margin: 2 }) }
