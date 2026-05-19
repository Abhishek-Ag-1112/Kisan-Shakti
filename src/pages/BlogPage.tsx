// src/pages/BlogPage.tsx

import React from 'react';
import { BookOpen, Calendar, User, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogPage: React.FC = () => {
  const navigate = useNavigate();

  const featuredPost = {
    id: 1,
    title: 'Top 10 Farming Tips for 2026',
    excerpt: 'Discover the latest techniques and best practices to maximize your crop yield this season.',
    author: 'Dr. Ramesh Kumar',
    date: '20 Jan 2026',
    readTime: '5 min read',
    category: 'Tips & Tricks',
    image: 'https://images.pexels.com/photos/2132171/pexels-photo-2132171.jpeg?auto=compress&cs=tinysrgb&w=600'
  };

  const posts = [
    {
      id: 2,
      title: 'Understanding Soil Health',
      excerpt: 'Learn how to test and improve your soil quality for better harvests.',
      author: 'Priya Sharma',
      date: '18 Jan 2026',
      readTime: '4 min read',
      category: 'Soil Management',
      image: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Organic Farming Benefits',
      excerpt: 'Why switching to organic farming can increase your profits.',
      author: 'Amit Patel',
      date: '15 Jan 2026',
      readTime: '6 min read',
      category: 'Organic',
      image: 'https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      title: 'Water Conservation Methods',
      excerpt: 'Effective irrigation techniques to save water and reduce costs.',
      author: 'Sunita Devi',
      date: '12 Jan 2026',
      readTime: '5 min read',
      category: 'Water Management',
      image: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      title: 'Pest Control Guide',
      excerpt: 'Natural and chemical methods to protect your crops from pests.',
      author: 'Rajesh Singh',
      date: '10 Jan 2026',
      readTime: '7 min read',
      category: 'Crop Protection',
      image: 'https://images.pexels.com/photos/4207901/pexels-photo-4207901.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 6,
      title: 'Market Trends 2026',
      excerpt: 'What crops are in demand and how to plan your planting.',
      author: 'Dr. Meena Gupta',
      date: '08 Jan 2026',
      readTime: '4 min read',
      category: 'Market',
      image: 'https://images.pexels.com/photos/2132171/pexels-photo-2132171.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const categories = [
    'All Posts',
    'Tips & Tricks',
    'Soil Management',
    'Organic',
    'Water Management',
    'Crop Protection',
    'Market'
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="section-title mb-0">Farming Blog</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Latest tips, news, and insights for farmers
        </p>
      </div>

      {/* Featured Post */}
      <div
        onClick={() => navigate(`/blog/${featuredPost.id}`)}
        className="card-interactive overflow-hidden cursor-pointer"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 md:h-auto">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <div className="badge-info mb-3 inline-block w-fit">
              Featured
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {featuredPost.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {featuredPost.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {featuredPost.date}
              </div>
              <div>{featuredPost.readTime}</div>
            </div>
            <button className="btn-primary w-fit">
              Read More <ArrowRight className="w-4 h-4 ml-2 inline" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className="px-4 py-2 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(`/blog/${post.id}`)}
            className="card-interactive overflow-hidden cursor-pointer"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                {post.category}
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  {post.author}
                </div>
                <div>{post.readTime}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="btn-secondary">
          Load More Articles
        </button>
      </div>
    </div>
  );
};

export default BlogPage;