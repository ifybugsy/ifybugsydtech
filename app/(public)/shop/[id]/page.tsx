'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PRODUCTS } from '@/lib/mockData';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaCheck, FaTruck, FaShieldAlt, FaHeart } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const resolvedParams = React.use(params);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  const product = PRODUCTS.find((p) => p.id === resolvedParams.id);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground/70 text-lg mb-4">Product not found</p>
            <Link href="/shop" className="text-primary hover:underline font-semibold">
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    router.push('/cart');
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      setWishlistAdded(false);
    } else {
      addToWishlist(product.id);
      setWishlistAdded(true);
      setTimeout(() => setWishlistAdded(false), 2000);
    }
  };

  const discount = Math.floor(Math.random() * 20) + 5; // Random discount 5-25%
  const discountedPrice = Math.floor(product.price * (1 - discount / 100));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 text-foreground/60 text-sm">
          <Link href="/shop" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Details */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-lg border border-border/20 p-8 flex items-center justify-center min-h-96"
              >
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary/30 mb-4">📦</div>
                    <p className="text-foreground/50">{product.brand}</p>
                  </div>
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Brand & Category */}
                <p className="text-primary text-sm font-semibold uppercase mb-2">{product.brand}</p>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/20">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-foreground">{product.rating}</span>
                  <span className="text-foreground/60">({product.reviews} reviews)</span>
                </div>

                {/* Price Section */}
                <div className="mb-6 p-6 bg-card border-2 border-primary/20 rounded-lg">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(discountedPrice)}
                    </span>
                    <span className="text-lg text-foreground/50 line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-sm font-bold bg-red-500/10 text-red-600 px-3 py-1 rounded">
                      -{discount}%
                    </span>
                  </div>
                  <p className="text-sm text-foreground/60">Limited time offer</p>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inStock ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <FaCheck className="w-5 h-5" />
                      <span className="font-semibold">In Stock - Ready to Ship</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <span className="font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                {product.inStock && (
                  <div className="mb-6 flex items-center gap-4">
                    <span className="text-foreground font-semibold">Quantity:</span>
                    <div className="flex items-center border border-border/20 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-foreground/60 hover:bg-secondary transition-colors"
                      >
                        −
                      </button>
                      <span className="px-6 py-2 font-semibold text-foreground">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 text-foreground/60 hover:bg-secondary transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className={`w-full py-4 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      product.inStock
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-foreground/20 text-foreground/50 cursor-not-allowed'
                    }`}
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    Buy Now
                  </motion.button>

                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className={`col-span-2 py-4 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        added
                          ? 'bg-green-500 text-white border-2 border-green-500'
                          : product.inStock
                            ? 'border-2 border-primary text-primary hover:bg-primary/10'
                            : 'border-2 border-foreground/20 text-foreground/50 cursor-not-allowed'
                      }`}
                    >
                      {added ? (
                        <>
                          <FaCheck className="w-5 h-5" />
                          Added
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={handleWishlist}
                      className={`py-4 font-semibold rounded-lg transition-all flex items-center justify-center ${
                        isInWishlist(product.id)
                          ? 'bg-red-500/20 text-red-500 border-2 border-red-500'
                          : 'border-2 border-foreground/20 text-foreground/60 hover:border-red-500 hover:text-red-500'
                      }`}
                      title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <FaHeart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
                    </motion.button>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3 bg-card border border-border/20 rounded-lg p-6">
                  <div className="flex items-center gap-3">
                    <FaTruck className="w-5 h-5 text-primary" />
                    <span className="text-foreground/70">Free shipping on orders over ₦50,000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="w-5 h-5 text-primary" />
                    <span className="text-foreground/70">2-year warranty included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCheck className="w-5 h-5 text-primary" />
                    <span className="text-foreground/70">30-day money-back guarantee</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        <section className="py-16 sm:py-24 bg-card border-y border-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCTS.filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/shop/${relatedProduct.id}`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-background rounded-lg border border-border/20 hover:border-primary/50 p-4 cursor-pointer transition-all"
                    >
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-4" />
                      <h4 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h4>
                      <p className="text-primary font-bold">{formatCurrency(relatedProduct.price)}</p>
                    </motion.div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
