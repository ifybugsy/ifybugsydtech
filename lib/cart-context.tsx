'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Cart, Order } from '@/types/index';
import { PRODUCTS } from './mockData';
import { ordersAPI } from './api';
import { useSocket } from './socket-context';

interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (
    customerName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    postalCode: string
  ) => Promise<Order>;
  orders: Order[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('shopping_cart');
    if (storedCart && storedCart.trim()) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error('Failed to restore cart:', error);
        localStorage.removeItem('shopping_cart');
      }
    }

    const storedOrders = localStorage.getItem('orders');
    if (storedOrders && storedOrders.trim()) {
      try {
        const parsedOrders = JSON.parse(storedOrders);
        if (Array.isArray(parsedOrders)) {
          setOrders(parsedOrders);
        }
      } catch (error) {
        console.error('Failed to restore orders:', error);
        localStorage.removeItem('orders');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
  }, [cart]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const addToCart = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return prevCart;

      const existingItem = prevCart.items.find((item) => item.productId === productId);

      let updatedItems: CartItem[];
      if (existingItem) {
        updatedItems = prevCart.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [
          ...prevCart.items,
          { productId, quantity, price: product.price },
        ];
      }

      const newTotal = calculateTotal(updatedItems);
      const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item.productId !== productId);
      const newTotal = calculateTotal(updatedItems);
      const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const newTotal = calculateTotal(updatedItems);
      const newItemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0,
    });
  };

  const checkout = async (
    customerName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    postalCode: string
  ): Promise<Order> => {
    setIsLoading(true);
    try {
      // Try backend API first
      try {
        const response = await ordersAPI.create({
          customerName,
          email,
          phone,
          shippingAddress: address,
          city,
          postalCode,
          items: cart.items,
          total: cart.total,
        });

        const newOrder = response.data;
        setOrders((prevOrders) => [...prevOrders, newOrder]);
        clearCart();

        return newOrder;
      } catch (backendError) {
        // Fallback to mock order
        console.warn('[Checkout] Backend unavailable, creating mock order:', backendError);

        const orderId = `ORD-${Date.now()}`;
        const newOrder: Order = {
          id: `order-${Date.now()}`,
          orderId,
          customerId: email,
          items: cart.items,
          total: cart.total,
          status: 'confirmed',
          paymentStatus: 'paid',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };

        setOrders((prevOrders) => [...prevOrders, newOrder]);
        clearCart();

        return newOrder;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        orders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
