export interface OrderItem {
  name: string;
  quantity: number;
  options: string;
  price?: number;
  totalPrice?: number;
}

export interface Order {
  id: string;
  type: 'devis_boutique' | 'bon_commande_autonome';
  reference: string;
  date: string;
  clientName: string;
  companyName: string;
  email: string;
  whatsapp: string;
  industry: string;
  items: OrderItem[];
  totalAmount?: number; // Net à payer TTC for boutique, or estimated/empty for custom
  status: 'nouveau' | 'en_preparation' | 'bat_envoye' | 'valide' | 'livre';
  notes?: string;
}

// localStorage cache: used as fallback when Google Sheets is unavailable
function getLocalOrders(): Order[] {
  const stored = localStorage.getItem('nexiform_orders');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: Order[]): void {
  localStorage.setItem('nexiform_orders', JSON.stringify(orders));
}

export async function getOrders(): Promise<Order[]> {
  try {
    const sheetModule = await import('../lib/sheetStore');
    const orders = await sheetModule.getOrders();

    // Sync to localStorage cache so the app still works offline
    saveLocalOrders(orders);

    return orders;
  } catch (err) {
    console.warn('Google Sheets unavailable, using localStorage cache:', err);
    return getLocalOrders();
  }
}

export async function saveOrder(orderData: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString().split('T')[0],
    status: 'nouveau',
  };

  try {
    const sheetModule = await import('../lib/sheetStore');
    await sheetModule.saveOrder(newOrder);

    // Update localStorage cache
    const cached = getLocalOrders();
    saveLocalOrders([newOrder, ...cached]);
  } catch (err) {
    console.warn('Google Sheets unavailable, saving to localStorage only:', err);
    const cached = getLocalOrders();
    saveLocalOrders([newOrder, ...cached]);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nexiform_orders_updated'));
  }

  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const sheetModule = await import('../lib/sheetStore');
    await sheetModule.updateOrderStatus(orderId, status);

    // Update localStorage cache
    const cached = getLocalOrders();
    saveLocalOrders(cached.map(o => o.id === orderId ? { ...o, status } : o));
  } catch (err) {
    console.warn('Google Sheets unavailable, updating localStorage only:', err);
    const cached = getLocalOrders();
    saveLocalOrders(cached.map(o => o.id === orderId ? { ...o, status } : o));
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nexiform_orders_updated'));
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  try {
    const sheetModule = await import('../lib/sheetStore');
    await sheetModule.deleteOrder(orderId);

    // Update localStorage cache
    const cached = getLocalOrders();
    saveLocalOrders(cached.filter(o => o.id !== orderId));
  } catch (err) {
    console.warn('Google Sheets unavailable, deleting from localStorage only:', err);
    const cached = getLocalOrders();
    saveLocalOrders(cached.filter(o => o.id !== orderId));
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nexiform_orders_updated'));
  }
}
