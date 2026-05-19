// src/pages/InsurancePage.tsx

import React, { useState } from 'react';
import { Shield, Check, AlertCircle, FileText, Calendar, IndianRupee } from 'lucide-react';

const InsurancePage: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const plans = [
        {
            id: 'basic',
            name: 'Basic Coverage',
            price: 2500,
            coverage: '₹50,000',
            features: [
                'Natural calamities',
                'Pest damage',
                'Disease coverage',
                'Basic claim support'
            ],
            popular: false
        },
        {
            id: 'standard',
            name: 'Standard Coverage',
            price: 5000,
            coverage: '₹1,00,000',
            features: [
                'All Basic features',
                'Fire damage',
                'Theft protection',
                'Priority claim support',
                'Expert consultation'
            ],
            popular: true
        },
        {
            id: 'premium',
            name: 'Premium Coverage',
            price: 8500,
            coverage: '₹2,00,000',
            features: [
                'All Standard features',
                'Revenue loss protection',
                'Equipment insurance',
                '24/7 claim support',
                'Free farm inspection'
            ],
            popular: false
        }
    ];

    const claims = [
        { id: 1, date: '15 Dec 2025', type: 'Pest Damage', status: 'Approved', amount: '₹12,000' },
        { id: 2, date: '03 Nov 2025', type: 'Flood', status: 'Processing', amount: '₹25,000' }
    ];

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-8 h-8 text-purple-600" />
                    <h1 className="section-title mb-0">Crop Insurance</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Protect your crops from unexpected losses
                </p>
            </div>

            {/* Current Coverage */}
            <div className="card p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                            Active Plan
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Standard Coverage
                        </div>
                    </div>
                    <div className="badge-success">Active</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Coverage Amount</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">₹1,00,000</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valid Until</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">31 Dec 2026</div>
                    </div>
                </div>
                <button className="btn-secondary w-full">
                    <FileText className="w-4 h-4 mr-2 inline" />
                    View Policy Details
                </button>
            </div>

            {/* Available Plans */}
            <div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
                    Available Plans
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`card p-6 relative ${plan.popular ? 'border-2 border-purple-600' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="badge-success px-4">Most Popular</span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline justify-center gap-1 mb-1">
                                    <IndianRupee className="w-5 h-5 text-gray-600" />
                                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {plan.price.toLocaleString()}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">/year</span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Coverage up to {plan.coverage}
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'
                                    }`}
                            >
                                {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Claims */}
            <div className="card p-6">
                <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
                    Recent Claims
                </h2>
                <div className="space-y-3">
                    {claims.map((claim) => (
                        <div
                            key={claim.id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-gray-100">
                                        {claim.type}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {claim.date}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                                    {claim.amount}
                                </div>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${claim.status === 'Approved'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                        }`}
                                >
                                    {claim.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="btn-secondary w-full mt-4">
                    File New Claim
                </button>
            </div>

            {/* Info Alert */}
            <div className="alert-info">
                <AlertCircle className="w-5 h-5" />
                <div>
                    <p className="font-bold">Premium Kisan Bima Yojana (PMFBY)</p>
                    <p className="text-sm">
                        Government subsidy available. You may be eligible for up to 50% premium discount.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InsurancePage;