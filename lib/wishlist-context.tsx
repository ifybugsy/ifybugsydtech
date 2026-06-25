'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Initialize wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist && storedWishlist.trim()) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist);
        }
      } catch (error) {
        console.error('Failed to restore wishlist:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      if (!prevWishlist.includes(productId)) {
        return [...prevWishlist, productId];
      }
      return prevWishlist;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((id) => id !== productId)
    );
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
