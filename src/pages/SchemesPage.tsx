// src/pages/SchemesPage.tsx

import React, { useState } from 'react';
import { Gift, Search, Filter, CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react';

const SchemesPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'all', name: 'All Schemes' },
        { id: 'subsidy', name: 'Subsidies' },
        { id: 'loan', name: 'Loans' },
        { id: 'insurance', name: 'Insurance' },
        { id: 'training', name: 'Training' }
    ];

    const schemes = [
        {
            id: 1,
            name: 'PM-KISAN',
            description: 'Direct income support of ₹6,000 per year to all farmer families',
            category: 'subsidy',
            amount: '₹6,000/year',
            status: 'active',
            deadline: '31 Dec 2026',
            applied: true
        },
        {
            id: 2,
            name: 'Soil Health Card',
            description: 'Free soil testing and nutrient management recommendations',
            category: 'subsidy',
            amount: 'Free',
            status: 'active',
            deadline: 'Ongoing',
            applied: false
        },
        {
            id: 3,
            name: 'Kisan Credit Card',
            description: 'Short-term credit for crop production at subsidized interest rates',
            category: 'loan',
            amount: 'Up to ₹3 Lakh',
            status: 'active',
            deadline: '30 Jun 2026',
            applied: true
        },
        {
            id: 4,
            name: 'PMFBY Insurance',
            description: 'Comprehensive crop insurance with government premium subsidy',
            category: 'insurance',
            amount: '2% Premium',
            status: 'active',
            deadline: '15 Apr 2026',
            applied: false
        },
        {
            id: 5,
            name: 'Organic Farming',
            description: 'Financial assistance for organic farming certification and inputs',
            category: 'subsidy',
            amount: '₹50,000',
            status: 'active',
            deadline: '31 Mar 2026',
            applied: false
        },
        {
            id: 6,
            name: 'Farm Mechanization',
            description: 'Subsidy on purchase of agricultural machinery and equipment',
            category: 'subsidy',
            amount: '40-50% Off',
            status: 'active',
            deadline: '31 Dec 2026',
            applied: false
        }
    ];

    const myApplications = [
        { id: 1, scheme: 'PM-KISAN', status: 'approved', date: '15 Jan 2026', amount: '₹2,000' },
        { id: 2, scheme: 'Kisan Credit Card', status: 'processing', date: '10 Jan 2026', amount: 'Pending' },
        { id: 3, scheme: 'Soil Health Card', status: 'rejected', date: '05 Jan 2026', amount: '-' }
    ];

    const filteredSchemes = schemes.filter(scheme => {
        const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
        const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'processing':
                return <Clock className="w-5 h-5 text-amber-600" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-2">
                    <Gift className="w-8 h-8 text-orange-600" />
                    <h1 className="section-title mb-0">Government Schemes</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Access benefits and subsidies for farmers
                </p>
            </div>

            {/* My Applications */}
            <div className="card p-6">
                <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
                    My Applications
                </h2>
                <div className="space-y-3">
                    {myApplications.map((app) => (
                        <div
                            key={app.id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                        >
                            <div className="flex items-center gap-4">
                                {getStatusIcon(app.status)}
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-gray-100">
                                        {app.scheme}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Applied on {app.date}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-900 dark:text-gray-100">
                                    {app.amount}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                                    {app.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search and Filter */}
            <div className="card p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search schemes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-12"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedCategory === cat.id
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Schemes Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                {filteredSchemes.map((scheme) => (
                    <div key={scheme.id} className="card-hover p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                                    {scheme.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {scheme.description}
                                </p>
                            </div>
                            {scheme.applied && (
                                <span className="badge-success ml-2">Applied</span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Benefit</div>
                                <div className="font-bold text-gray-900 dark:text-gray-100">
                                    {scheme.amount}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Deadline</div>
                                <div className="font-bold text-gray-900 dark:text-gray-100">
                                    {scheme.deadline}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="btn-primary flex-1">
                                {scheme.applied ? 'View Status' : 'Apply Now'}
                            </button>
                            <button className="btn-icon">
                                <ExternalLink className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredSchemes.length === 0 && (
                <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                    No schemes found matching your criteria
                </div>
            )}
        </div>
    );
};

export default SchemesPage;