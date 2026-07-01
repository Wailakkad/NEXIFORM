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

const DEFAULT_MOCK_ORDERS: Order[] = [
  {
    id: 'ord-101',
    type: 'devis_boutique',
    reference: 'DEVIS-2026-94821',
    date: '2026-06-28',
    clientName: 'Yassine Benjelloun',
    companyName: 'Clinique Internationale d\'Anfa',
    email: 'y.benjelloun@clinique-anfa.ma',
    whatsapp: '+212 6 61 45 82 93',
    industry: 'Médical / Santé',
    items: [
      {
        name: 'Blouse Médicale Soft-Touch Pro',
        quantity: 120,
        options: 'Blanc Pur | Broderie Logo Coeur (+35 DH)',
        price: 185,
        totalPrice: 26400
      },
      {
        name: 'Pantalon de Clinique Flex Comfort',
        quantity: 120,
        options: 'Bleu Marine | Aucun Marquage',
        price: 140,
        totalPrice: 16800
      }
    ],
    totalAmount: 51840, // (26400+16800)*1.2 TTC
    status: 'en_preparation',
    notes: 'Livraison urgente demandée avant le 15 Juillet pour inauguration de l\'aile Est.'
  },
  {
    id: 'ord-102',
    type: 'bon_commande_autonome',
    reference: 'BC-2026-3841',
    date: '2026-06-29',
    clientName: 'Ghita El Alami',
    companyName: 'Royal Mansour Marrakech',
    email: 'alami.g@royalmansour.ma',
    whatsapp: '+212 6 62 88 11 44',
    industry: 'Hôtellerie de Luxe',
    items: [
      {
        name: 'Vestes de Réception Signature Or',
        quantity: 45,
        options: 'Broderie double fil or premium sur col'
      },
      {
        name: 'Gilets de Service Haute Couture',
        quantity: 60,
        options: 'Sérigraphie logo discret'
      }
    ],
    status: 'nouveau',
    notes: 'Nous souhaitons recevoir des échantillons physiques des tissus avant validation définitive.'
  },
  {
    id: 'ord-103',
    type: 'devis_boutique',
    reference: 'DEVIS-2026-47109',
    date: '2026-06-30',
    clientName: 'Karim Tazi',
    companyName: 'Atlas Security Maroc',
    email: 'k.tazi@atlas-security.com',
    whatsapp: '+212 6 60 19 28 37',
    industry: 'Sécurité',
    items: [
      {
        name: 'Ensemble de Patrouille Tech-Comfort',
        quantity: 80,
        options: 'Noir Tactique | Sérigraphie Dos Réfléchissante (+32 DH)',
        price: 245,
        totalPrice: 22160
      }
    ],
    totalAmount: 26592, // 22160 * 1.2
    status: 'bat_envoye',
    notes: 'Logo haute définition transmis par e-mail.'
  },
  {
    id: 'ord-104',
    type: 'bon_commande_autonome',
    reference: 'BC-2026-7732',
    date: '2026-07-01',
    clientName: 'Amine Chraïbi',
    companyName: 'Air Maroc Logistics',
    email: 'a.chraibi@airmaroc-logistics.co.ma',
    whatsapp: '+212 6 75 92 01 12',
    industry: 'Logistique / Transport',
    items: [
      {
        name: 'Combinaisons de Protection Renforcées',
        quantity: 150,
        options: 'Gris Industriel | Logo Sérigraphié Manche Droite'
      }
    ],
    status: 'nouveau',
    notes: 'Tissus anti-abrasion indispensables.'
  }
];

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return DEFAULT_MOCK_ORDERS;
  
  const stored = localStorage.getItem('nexiform_orders');
  if (!stored) {
    localStorage.setItem('nexiform_orders', JSON.stringify(DEFAULT_MOCK_ORDERS));
    return DEFAULT_MOCK_ORDERS;
  }
  
  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error('Error parsing orders from localStorage:', err);
    return DEFAULT_MOCK_ORDERS;
  }
}

export function saveOrder(orderData: Omit<Order, 'id' | 'date' | 'status'>): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString().split('T')[0],
    status: 'nouveau'
  };
  
  const updated = [newOrder, ...orders];
  localStorage.setItem('nexiform_orders', JSON.stringify(updated));
  
  // Dispatch simple custom event to let other components know orders updated if they care
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nexiform_orders_updated', { detail: updated }));
  }
  
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order[] {
  const orders = getOrders();
  const updated = orders.map(ord => {
    if (ord.id === orderId) {
      return { ...ord, status };
    }
    return ord;
  });
  
  localStorage.setItem('nexiform_orders', JSON.stringify(updated));
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nexiform_orders_updated', { detail: updated }));
  }
  
  return updated;
}

export function deleteOrder(orderId: string): Order[] {
  const orders = getOrders();
  const updated = orders.filter(ord => ord.id !== orderId);
  localStorage.setItem('nexiform_orders', JSON.stringify(updated));
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nexiform_orders_updated', { detail: updated }));
  }
  
  return updated;
}
