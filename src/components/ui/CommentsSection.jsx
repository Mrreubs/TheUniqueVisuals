import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export default function CommentsSection({ page = 'general' }) {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      try {
        const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setComments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        // Firestore may not be configured
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [page]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!currentUser || !text.trim()) return;

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        userId: currentUser.uid,
        name: currentUser.displayName || 'Anonymous',
        text: text.trim(),
        page,
        createdAt: serverTimestamp(),
      });
      setComments((prev) => [
        { id: docRef.id, name: currentUser.displayName || 'Anonymous', text: text.trim(), page, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setText('');
      addNotification('Comment posted!');
    } catch {
      addNotification('Failed to post comment.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteDoc(doc(db, 'comments', id));
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {
      addNotification('Failed to delete.', 'error');
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle size={24} className="text-gold" />
        <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Comments</h2>
      </div>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex gap-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts..."
              required
              className="flex-1 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="bg-gold hover:bg-gold/90 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={16} />
              {isSubmitting ? '...' : 'Post'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-600 dark:text-white/60 mb-10 text-sm">
          <a href="/#/login" className="text-gold hover:underline">Sign in</a> to leave a comment.
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 dark:text-white/40 text-center py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, i) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm font-bold uppercase">
                      {comment.name?.charAt(0) || '?'}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{comment.name}</span>
                    <span className="text-xs text-gray-400 dark:text-white/30">
                      {comment.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-white/80">{comment.text}</p>
                </div>
                {currentUser?.uid === comment.userId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 shrink-0"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
