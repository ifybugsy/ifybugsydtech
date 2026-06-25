'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaPlus, FaEdit, FaTrash, FaSearch, FaBox } from 'react-icons/fa';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'available' | 'out-of-stock' | 'discontinued';
  createdDate: string;
  image?: string;
}

export default function ShopManagementPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([
    {
      _id: '1',
      name: 'Premium Course Bundle',
      description: 'Access all courses for a year',
      price: 299,
      stock: 100,
      category: 'Bundle',
      status: 'available',
      createdDate: '2025-01-15',
    },
    {
      _id: '2',
      name: 'Certificate Package',
      description: 'Professional certificate with verification',
      price: 49,
      stock: 250,
      category: 'Certificate',
      status: 'available',
      createdDate: '2025-02-20',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = () => {
    if (!formData.name.trim()) return;

    if (editingProduct) {
      setProducts(products.map(p => p._id === editingProduct._id ? { ...editingProduct, ...formData } : p));
    } else {
      const newProduct: Product = {
        _id: Date.now().toString(),
        ...formData,
        status: formData.stock > 0 ? 'available' : 'out-of-stock',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setProducts([...products, newProduct]);
    }
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: 0, stock: 0, category: '', image: '' });
    setImagePreview('');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-secondary rounded-lg">
              <FaChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Shop Management</h1>
              <p className="text-foreground/60 mt-1">Manage products and inventory</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <FaPlus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 bg-card rounded-xl border border-border/20">
            <h2 className="text-xl font-bold text-foreground mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="space-y-4">
              {/* Image Upload Preview */}
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="h-40 w-auto mx-auto rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image: '' });
                      }}
                      className="mt-2 px-3 py-1 bg-red-500/20 text-red-500 rounded text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-foreground/60 mb-2">Upload Product Image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm"
                    />
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
              />
              <textarea
                placeholder="Product Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                />
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveProduct} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg">
                  {editingProduct ? 'Update' : 'Create'} Product
                </button>
                <button onClick={() => { setShowForm(false); setImagePreview(''); }} className="px-6 py-2 bg-secondary text-foreground rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-3 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
            />
          </div>
        </div>

        {/* Products List */}
        <div className="grid gap-6">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-foreground/60">No products found</div>
          ) : (
            filtered.map(product => (
              <motion.div key={product._id} className="p-6 bg-card rounded-xl border border-border/20 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaBox className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                      <p className="text-foreground/70 text-sm mt-1">{product.description}</p>
                      <div className="flex gap-4 mt-3 text-sm text-foreground/60">
                        <span className="font-semibold text-foreground">${product.price}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                        <span>•</span>
                        <span className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}>
                          {product.stock} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setFormData(product);
                        setShowForm(true);
                      }}
                      className="p-2 hover:bg-secondary rounded-lg text-foreground/70 hover:text-primary"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-foreground/70 hover:text-red-500"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
