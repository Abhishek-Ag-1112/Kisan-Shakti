// src/pages/ReferralPage.tsx

import React, { useState } from 'react';
import { Gift, Copy, Share2, Users, Award, CheckCircle } from 'lucide-react';

const ReferralPage: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const referralCode = 'FARM2026XYZ';
    const referralLink = `https://kisanshakti.com/join/${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const stats = [
        { label: 'Total Referrals', value: '12', icon: Users },
        { label: 'Active Referrals', value: '8', icon: CheckCircle },
        { label: 'Rewards Earned', value: '₹2,400', icon: Award },
        { label: 'Pending Rewards', value: '₹800', icon: Gift }
    ];

    const rewards = [
        { referrals: 1, reward: '₹200', status: 'earned' },
        { referrals: 5, reward: '₹1,000', status: 'earned' },
        { referrals: 10, reward: '₹2,500', status: 'current' },
        { referrals: 25, reward: '₹7,500', status: 'locked' },
        { referrals: 50, reward: '₹20,000', status: 'locked' }
    ];

    const referralHistory = [
        { name: 'Ramesh Kumar', date: '20 Jan 2026', status: 'Active', reward: '₹200' },
        { name: 'Priya Sharma', date: '18 Jan 2026', status: 'Active', reward: '₹200' },
        { name: 'Amit Patel', date: '15 Jan 2026', status: 'Pending', reward: '₹200' }
    ];

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-2">
                    <Gift className="w-8 h-8 text-purple-600" />
                    <h1 className="section-title mb-0">Referral Program</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Invite friends and earn rewards together
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card">
                        <stat.icon className="w-8 h-8 text-purple-600 mb-3" />
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-value">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Referral Link */}
            <div className="card p-6">
                <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
                    Your Referral Link
                </h2>

                <div className="flex gap-3 mb-4">
                    <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="input flex-1"
                    />
                    <button onClick={handleCopy} className="btn-primary">
                        {copied ? (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2 inline" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5 mr-2 inline" />
                                Copy
                            </>
                        )}
                    </button>
                </div>

                <div className="flex gap-3">
                    <button className="btn-secondary flex-1">
                        <Share2 className="w-5 h-5 mr-2 inline" />
                        Share on WhatsApp
                    </button>
                    <button className="btn-secondary flex-1">
                        <Share2 className="w-5 h-5 mr-2 inline" />
                        Share on Facebook
                    </button>
                </div>
            </div>

            {/* Rewards Tiers */}
            <div className="card p-6">
                <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
                    Rewards Tiers
                </h2>

                <div className="space-y-3">
                    {rewards.map((tier, i) => (
                        <div
                            key={i}
                            className={`p-4 rounded-xl border-2 ${tier.status === 'earned'
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-600'
                                    : tier.status === 'current'
                                        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-600'
                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tier.status === 'earned'
                                            ? 'bg-green-600 text-white'
                                            : tier.status === 'current'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {tier.status === 'earned' ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            <Gift className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-gray-100">
                                            {tier.referrals} Referrals
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {tier.status === 'earned'
                                                ? 'Completed'
                                                : tier.status === 'current'
                                                    ? '2 more to unlock'
                                                    : `${tier.referrals - 12} more to unlock`}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {tier.reward}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        Reward
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Referral History */}
            <div className="card p-6">
                <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
                    Recent Referrals
                </h2>

                <div className="space-y-3">
                    {referralHistory.map((ref, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 font-bold">
                                    {ref.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-gray-100">
                                        {ref.name}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {ref.date}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-900 dark:text-gray-100">
                                    {ref.reward}
                                </div>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${ref.status === 'Active'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                        }`}
                                >
                                    {ref.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it Works */}
            <div className="card p-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">
                    How It Works
                </h3>
                <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex gap-3">
                        <span className="font-bold text-purple-600">1.</span>
                        <span>Share your unique referral link with friends and family</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold text-purple-600">2.</span>
                        <span>They sign up and complete their profile</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold text-purple-600">3.</span>
                        <span>You both earn rewards when they make their first purchase</span>
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default ReferralPage;