import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: any;
  content: string;
  tags?: string[];
}

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, 'blogPosts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPost({
            id: docSnap.id,
            ...data,
            date: data.date?.toDate().toLocaleDateString()
          } as BlogPost);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center text-gray-800 dark:text-gray-200">
        <h2 className="text-2xl font-bold mb-4">oops!</h2>
        <p className="mb-6">{error || 'Post not found'}</p>
        <Link to="/blog" className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header Image Placeholder - could be real image if data exists */}
      <div className="h-64 bg-gradient-to-r from-green-600 to-emerald-800 w-full relative">
         <div className="absolute inset-0 bg-black/20"></div>
         <div className="max-w-4xl mx-auto h-full px-6 flex flex-col justify-end pb-10 relative z-10">
            <Link to="/blog" className="text-white/80 hover:text-white mb-6 inline-flex items-center gap-2 transition-colors">
              <ArrowLeft size={20} /> Back to Blog
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{post.date}</span>
              </div>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm">
           <div className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
            {post.content}
           </div>
        </article>

        {/* Suggestion / Share / Footer for post could go here */}
      </div>
    </div>
  );
};

export default BlogPostPage;
