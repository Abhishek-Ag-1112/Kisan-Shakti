// src/pages/MarketplacePage.tsx

import React, { useState } from 'react';
import { ShoppingBag, Search, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketplacePage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cartItems, setCartItems] = useState<any[]>([]);

    const categories = [
        { id: 'all', name: 'All' },
        { id: 'seeds', name: 'Seeds' },
        { id: 'fertilizers', name: 'Fertilizers' },
        { id: 'pesticides', name: 'Pesticides' },
        { id: 'equipment', name: 'Equipment' }
    ];

    const products = [
        {
            id: 1,
            name: 'Hybrid Cotton Seeds',
            category: 'seeds',
            price: 1200,
            originalPrice: 1400,
            unit: 'packet',
            image: 'https://images.pexels.com/photos/4207901/pexels-photo-4207901.jpeg?auto=compress&cs=tinysrgb&w=200',
            rating: 4.5,
            discount: 15,
            seller: 'AgriSeeds Ltd.'
        },
        {
            id: 2,
            name: 'Organic Fertilizer',
            category: 'fertilizers',
            price: 800,
            originalPrice: 900,
            unit: '25kg bag',
            image: 'https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&w=200',
            rating: 4.3,
            discount: 11,
            seller: 'GreenGrow Co.'
        },
        {
            id: 3,
            name: 'Spray Pump',
            category: 'equipment',
            price: 2500,
            originalPrice: 3000,
            unit: 'unit',
            image: 'https://images.pexels.com/photos/4505175/pexels-photo-4505175.jpeg?auto=compress&cs=tinysrgb&w=200',
            rating: 4.7,
            discount: 17,
            seller: 'FarmTech'
        },
        {
            id: 4,
            name: 'Bio Pesticide',
            category: 'pesticides',
            price: 450,
            originalPrice: 500,
            unit: '1L bottle',
            image: 'https://images.pexels.com/photos/4207988/pexels-photo-4207988.jpeg?auto=compress&cs=tinysrgb&w=200',
            rating: 4.2,
            discount: 10,
            seller: 'EcoProtect'
        }
    ];

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    const addToCart = (product: any) => {
        setCartItems(prev => [...prev, product]);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-green-600" />
                        <h1 className="section-title mb-0">Marketplace</h1>
                    </div>
                    {cartItems.length > 0 && (
                        <button
                            onClick={() => navigate('/cart', { state: { cartItems } })}
                            className="btn-primary flex items-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Cart ({cartItems.length})
                        </button>
                    )}
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search for seeds, fertilizers, equipment..."
                        className="input pl-12"
                    />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedCategory === category.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="card-hover p-4">
                        {/* Image */}
                        <div className="relative mb-4 rounded-xl overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-40 object-cover"
                            />
                            {product.discount > 0 && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                    {product.discount}% OFF
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="mb-3">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                                {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {product.seller}
                            </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                ({product.rating})
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-green-600">
                                    ₹{product.price}
                                </span>
                                {product.originalPrice > product.price && (
                                    <span className="text-sm text-gray-500 line-through">
                                        ₹{product.originalPrice}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                per {product.unit}
                            </span>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={() => addToCart(product)}
                            className="btn-primary w-full"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketplacePage;