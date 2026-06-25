'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/lib/cart-context';
import { PRODUCTS } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, checkout, isLoading } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [newOrderId, setNewOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const cartItems = cart.items
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      return { ...item, product };
    })
    .filter((item) => item.product !== undefined);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, '')))
      newErrors.cardNumber = 'Valid 16-digit card number required';
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate))
      newErrors.expiryDate = 'Format: MM/YY';
    if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = 'Valid 3-digit CVV required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || cart.items.length === 0) return;

    try {
      const order = await checkout(
        formData.fullName,
        formData.email,
        formData.phone,
        formData.address,
        formData.city,
        formData.postalCode
      );

      setNewOrderId(order.orderId);
      setOrderPlaced(true);

      // Redirect to order confirmation after 3 seconds
      setTimeout(() => {
        router.push(`/order-confirmation/${order.orderId}`);
      }, 3000);
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  if (cart.items.length === 0 && !orderPlaced) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Your cart is empty
              </h2>
              <p className="text-foreground/70 mb-8">
                Please add items to your cart before checking out.
              </p>
              <Link href="/shop">
                <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <section className="py-24">
            <div className="max-w-md mx-auto px-4 text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Order Confirmed!
              </h1>
              <p className="text-foreground/70 mb-2">
                Thank you for your purchase.
              </p>
              <p className="text-lg font-semibold text-primary mb-8">
                Order ID: {newOrderId}
              </p>
              <p className="text-foreground/70 mb-8">
                Redirecting to order confirmation page...
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const subtotal = cart.total;
  const shipping = subtotal > 50000 ? 0 : 1000;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 border-b border-border/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/cart" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Checkout
            </h1>
          </div>
        </section>

        {/* Checkout Form */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-lg bg-card border border-border/20"
                >
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Shipping Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg bg-secondary border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.fullName ? 'border-red-500' : 'border-border'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg bg-secondary border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.email ? 'border-red-500' : 'border-border'
                          }`}
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg bg-secondary border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.phone ? 'border-red-500' : 'border-border'
                          }`}
                          placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg bg-secondary border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.address ? 'border-red-500' : 'border-border'
                        }`}
                        placeholder="123 Main Street"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg bg-secondary border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.city ? 'border-red-500' : 'border-border'
                          }`}
                          placeholder="New York"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg bg-secondary border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.postalCode ? 'border-red-500' : 'border-border'
                          }`}
                          placeholder="10001"
                        />
                        {errors.postalCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="p-6 rounded-lg bg-card border border-border/20"
                >
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        maxLength={19}
                        className={`w-full px-4 py-3 rounded-lg bg-secondary border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.cardNumber ? 'border-red-500' : 'border-border'
                        }`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          maxLength={5}
                          className={`w-full px-4 py-3 rounded-lg bg-secondary border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.expiryDate ? 'border-red-500' : 'border-border'
                          }`}
                          placeholder="MM/YY"
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          CVV
                        </label>
                        <input
                          type="password"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          maxLength={3}
                          className={`w-full px-4 py-3 rounded-lg bg-secondary border text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors.cvv ? 'border-red-500' : 'border-border'
                          }`}
                          placeholder="123"
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </button>
              </form>

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

                  {/* Items */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-border/20">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <div>
                          <p className="text-foreground font-medium">
                            {item.product?.name}
                          </p>
                          <p className="text-foreground/50">x{item.quantity}</p>
                        </div>
                        <p className="text-foreground font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-border/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Subtotal</span>
                      <span className="text-foreground">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Shipping</span>
                      <span className="text-foreground">
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Tax (10%)</span>
                      <span className="text-foreground">{formatCurrency(tax)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
