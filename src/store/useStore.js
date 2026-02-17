import { create } from 'zustand';

export const useStore = create((set) => ({
    cart: [],
    isCartOpen: false,
    addToCart: (product) => set((state) => ({ cart: [...state.cart, { ...product, cartId: Math.random(), qty: 1 }], isCartOpen: true })),
    removeFromCart: (cartId) => set((state) => ({ cart: state.cart.filter(item => item.cartId !== cartId) })),
    updateQuantity: (cartId, quantity) => set((state) => ({
        cart: state.cart.map(item => item.cartId === cartId ? { ...item, qty: Math.max(1, quantity) } : item)
    })),
    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
}));
