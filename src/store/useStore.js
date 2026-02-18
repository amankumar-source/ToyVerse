import { create } from 'zustand';

export const useStore = create((set) => ({
    cart: [],
    isCartOpen: false,
    addToCart: (product) => set((state) => {
        const existingItem = state.cart.find(item => item.id === product.id);
        if (existingItem) {
            return {
                cart: state.cart.map(item =>
                    item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item
                ),
                isCartOpen: true
            };
        }
        return {
            cart: [...state.cart, { ...product, cartId: Math.random(), qty: 1 }],
            isCartOpen: true
        };
    }),
    removeFromCart: (cartId) => set((state) => ({ cart: state.cart.filter(item => item.cartId !== cartId) })),
    updateQuantity: (cartId, quantity) => set((state) => ({
        cart: state.cart.map(item => item.cartId === cartId ? { ...item, qty: Math.max(1, quantity) } : item)
    })),
    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
}));
