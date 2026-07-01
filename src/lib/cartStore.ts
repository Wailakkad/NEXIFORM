import { Product } from '../data/store';

export interface CartItem {
  id: string; // Unique combination of product ID, selected size, and logo customization
  product: Product;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
  unitPrice: number; // Base unit price
  discountedUnitPrice: number; // Discounted unit price based on tier
  hasLogo: boolean;
  logoType: 'Broderie' | 'Sérigraphie' | null;
  logoUnitPrice: number; // 60 or 40
  discountedLogoUnitPrice: number; // Discounted logo price based on tier
  totalPrice: number;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

// Discount tier calculation helper
export function calculateDiscountedPrice(
  unitPrice: number, 
  qty: number, 
  hasLogo: boolean = false, 
  logoType: 'Broderie' | 'Sérigraphie' | null = null
) {
  let discountPercent = 0;
  if (qty >= 40) {
    discountPercent = 20; // 20% discount for orders of 40+ pieces
  } else if (qty >= 30) {
    discountPercent = 15; // 15% discount for orders of 30-39 pieces
  } else if (qty >= 20) {
    discountPercent = 10; // 10% discount for orders of 20-29 pieces
  } else if (qty >= 15) {
    discountPercent = 5;  // 5% discount for orders of 15-19 pieces
  }
  
  const discountedUnitPrice = Math.round(unitPrice * (1 - discountPercent / 100));
  
  let baseLogoPrice = 0;
  if (hasLogo && logoType) {
    baseLogoPrice = logoType === 'Broderie' ? 60 : 40;
  }
  
  const discountedLogoUnitPrice = Math.round(baseLogoPrice * (1 - discountPercent / 100));
  const totalPrice = (discountedUnitPrice + discountedLogoUnitPrice) * qty;
  const originalPrice = (unitPrice + baseLogoPrice) * qty;
  
  return {
    originalPrice,
    discountPercent,
    discountedUnitPrice,
    discountedLogoUnitPrice,
    totalPrice
  };
}

// Action Types for Redux-like dispatch system
type CartAction =
  | { 
      type: 'ADD_ITEM'; 
      payload: { 
        product: Product; 
        size: 'S' | 'M' | 'L' | 'XL' | 'XXL'; 
        quantity: number;
        hasLogo: boolean;
        logoType: 'Broderie' | 'Sérigraphie' | null;
      } 
    }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const LOCAL_STORAGE_KEY = 'nexiform_cart_state_v2';

// Initial State helper
export function getInitialCartState(): CartState {
  if (typeof window === 'undefined') {
    return { items: [], totalQuantity: 0, totalAmount: 0 };
  }
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.items)) {
        return recalculateTotals(parsed.items);
      }
    }
  } catch (e) {
    console.error('Failed to load cart state from localStorage', e);
  }
  return { items: [], totalQuantity: 0, totalAmount: 0 };
}

// Helper to recalculate totals
function recalculateTotals(items: CartItem[]): CartState {
  const updatedItems = items.map(item => {
    const pricing = calculateDiscountedPrice(
      item.product.price, 
      item.quantity, 
      item.hasLogo, 
      item.logoType
    );
    return {
      ...item,
      unitPrice: item.product.price,
      discountedUnitPrice: pricing.discountedUnitPrice,
      logoUnitPrice: item.hasLogo && item.logoType ? (item.logoType === 'Broderie' ? 60 : 40) : 0,
      discountedLogoUnitPrice: pricing.discountedLogoUnitPrice,
      totalPrice: pricing.totalPrice
    };
  });

  const totalQuantity = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = updatedItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return {
    items: updatedItems,
    totalQuantity,
    totalAmount
  };
}

// Redux-style reducer
export function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;

  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size, quantity, hasLogo, logoType } = action.payload;
      
      // The id represents a unique customization line so that separate configurations do not collide
      const configTag = hasLogo ? (logoType === 'Broderie' ? 'broderie' : 'serigraphie') : 'no_logo';
      const itemId = `${product.id}-${size}-${configTag}`;
      const existingItemIndex = state.items.findIndex((item) => item.id === itemId);

      let updatedItems = [...state.items];

      if (existingItemIndex > -1) {
        // Merge quantity
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        const pricing = calculateDiscountedPrice(product.price, newQuantity, hasLogo, logoType);

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          unitPrice: product.price,
          discountedUnitPrice: pricing.discountedUnitPrice,
          logoUnitPrice: hasLogo && logoType ? (logoType === 'Broderie' ? 60 : 40) : 0,
          discountedLogoUnitPrice: pricing.discountedLogoUnitPrice,
          totalPrice: pricing.totalPrice
        };
      } else {
        // Add new item
        const pricing = calculateDiscountedPrice(product.price, quantity, hasLogo, logoType);
        updatedItems.push({
          id: itemId,
          product,
          size,
          quantity,
          unitPrice: product.price,
          discountedUnitPrice: pricing.discountedUnitPrice,
          hasLogo,
          logoType,
          logoUnitPrice: hasLogo && logoType ? (logoType === 'Broderie' ? 60 : 40) : 0,
          discountedLogoUnitPrice: pricing.discountedLogoUnitPrice,
          totalPrice: pricing.totalPrice
        });
      }

      newState = recalculateTotals(updatedItems);
      break;
    }

    case 'REMOVE_ITEM': {
      const { id } = action.payload;
      const updatedItems = state.items.filter((item) => item.id !== id);
      newState = recalculateTotals(updatedItems);
      break;
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const updatedItems = state.items.map((item) => {
        if (item.id === id) {
          const pricing = calculateDiscountedPrice(item.product.price, quantity, item.hasLogo, item.logoType);
          return {
            ...item,
            quantity,
            discountedUnitPrice: pricing.discountedUnitPrice,
            discountedLogoUnitPrice: pricing.discountedLogoUnitPrice,
            totalPrice: pricing.totalPrice
          };
        }
        return item;
      });
      newState = recalculateTotals(updatedItems);
      break;
    }

    case 'CLEAR_CART': {
      newState = { items: [], totalQuantity: 0, totalAmount: 0 };
      break;
    }

    default:
      return state;
  }

  // Persist to local storage
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  }
  return newState;
}

// Dispatch event listener hook pattern to sync states across components instantly
export const CART_UPDATE_EVENT = 'nexiform_cart_updated';

export function notifyCartUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CART_UPDATE_EVENT));
  }
}
