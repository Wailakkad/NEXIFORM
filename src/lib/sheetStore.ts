import { Order } from '../utils/orderStore';

// Uses Vite proxy (dev) or Vercel rewrites (prod) to avoid CORS issues
const WEB_APP_URL = '/api/exec';

async function fetchApi(action: string, params?: Record<string, string>): Promise<any> {
  const base = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://script.google.com';
  const query = new URLSearchParams({ action, ...params });
  const res = await fetch(`${base}${WEB_APP_URL}?${query}`);

  if (!res.ok) {
    throw new Error(`Google Sheets API error: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  const data = JSON.parse(text);
  if (data.error) throw new Error(data.error);
  return data;
}

function normalizeOrder(row: any): Order {
  return {
    id: String(row.id || ''),
    type: row.type || 'devis_boutique',
    reference: String(row.reference || ''),
    date: String(row.date || ''),
    clientName: String(row.clientName || ''),
    companyName: String(row.companyName || ''),
    email: String(row.email || ''),
    whatsapp: String(row.whatsapp || ''),
    industry: String(row.industry || ''),
    status: row.status || 'nouveau',
    notes: row.notes || undefined,
    items: Array.isArray(row.items) ? row.items : [],
    totalAmount: row.totalAmount ? Number(row.totalAmount) : undefined,
  };
}

export async function getOrders(): Promise<Order[]> {
  const data = await fetchApi('getAll');
  return (data || []).map(normalizeOrder);
}

export async function saveOrder(
  orderData: Omit<Order, 'id' | 'date' | 'status'>
): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString().split('T')[0],
    status: 'nouveau',
  };

  await fetchApi('save', { order: JSON.stringify(newOrder) });
  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<void> {
  await fetchApi('updateStatus', { id: orderId, status });
}

export async function deleteOrder(orderId: string): Promise<void> {
  await fetchApi('delete', { id: orderId });
}
