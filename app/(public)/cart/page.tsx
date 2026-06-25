'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/lib/cart-context';
import { PRODUCTS } from '@/lib/mockData';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const cartItems = cart.items.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    return { ...item, product };
  }).filter((item) => item.product !== undefined);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Shopping Cart
            </h1>
            <p className="text-foreground/70">
              {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </section>

        {cart.items.length === 0 ? (
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <FaShoppingBag className="w-20 h-20 text-foreground/20 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Your cart is empty
              </h2>
              <p className="text-foreground/70 mb-8">
                Explore our shop and add some amazing products to your cart.
              </p>
              <Link href="/shop">
                <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </section>
        ) : (
          <section className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.productId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex gap-4 p-6 rounded-lg bg-card border border-border/20 hover:border-primary/30 transition-colors"
                      >
                        {/* Product Image */}
                        <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex-shrink-0 flex items-center justify-center">
                          <FaShoppingBag className="w-8 h-8 text-primary/40" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm text-foreground/60 mb-3">
                            {item.product?.category}
                          </p>
                          <p className="font-semibold text-primary">
                            {formatCurrency(item.price)}
                          </p>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>

                          {/* Quantity Input */}
                          <div className="flex items-center gap-2 border border-border rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              className="px-3 py-1 text-sm text-foreground/70 hover:text-foreground"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.productId,
                                  Math.max(1, parseInt(e.target.value) || 1)
                                )
                              }
                              className="w-12 text-center bg-transparent text-foreground text-sm focus:outline-none"
                            />
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              className="px-3 py-1 text-sm text-foreground/70 hover:text-foreground"
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal */}
                          <p className="font-semibold text-foreground">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="p-6 rounded-lg bg-card border border-border/20 sticky top-24"
                  >
                    <h3 className="text-lg font-bold text-foreground mb-6">
                      Order Summary
                    </h3>

                    <div className="space-y-3 mb-6 pb-6 border-b border-border/20">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Subtotal</span>
                        <span className="text-foreground">
                          {formatCurrency(cart.total)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Shipping</span>
                        <span className="text-foreground">
                          {cart.total > 50000 ? 'Free' : formatCurrency(1000)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Tax (10%)</span>
                        <span className="text-foreground">
                          {formatCurrency(cart.total * 0.1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between mb-8">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(
                          cart.total +
                            (cart.total > 50000 ? 0 : 1000) +
                            cart.total * 0.1
                        )}
                      </span>
                    </div>

                    <Link href="/checkout">
                      <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors mb-3">
                        Proceed to Checkout
                      </button>
                    </Link>

                    <Link href="/shop">
                      <button className="w-full py-3 rounded-lg bg-secondary text-foreground font-semibold hover:bg-border transition-colors">
                        Continue Shopping
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
