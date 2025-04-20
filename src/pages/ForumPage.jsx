import { useState, useEffect } from 'react';
import { MessageSquare, PlusCircle, Search, Film, Tv, Book, Menu, Bell, User } from 'lucide-react';
import { Header } from '../components/Header';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ForumPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/post/');
        setPosts(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Handle new post submission
  

  // Filter posts based on active category
  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const categories = [
    { id: 'all', name: 'All Topics', icon: <MessageSquare size={18} /> },
    { id: 'movies', name: 'Movies', icon: <Film size={18} /> },
    { id: 'shows', name: 'Shows', icon: <Tv size={18} /> },
    { id: 'novels', name: 'Novels', icon: <Book size={18} /> },
    { id: 'general', name: 'General', icon: <Menu size={18} /> }
  ];

  // Function to format timestamp to relative time
  const formatTimeAgo = (timestamp) => {
    // This is a placeholder - in a real app you'd use a library like date-fns
    return "2 hours ago";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <div className="p-4">
            <Link to={"/post"}>
            <button 
              
              className="bg-indigo-600 text-white w-full rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <PlusCircle size={18} />
              <span>New Post</span>
            </button>
            </Link>
          </div>
          <nav className="mt-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors ${
                  activeCategory === category.id
                    ? 'bg-indigo-50 text-indigo-700 font-medium border-r-4 border-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={activeCategory === category.id ? "text-indigo-600" : "text-gray-500"}>
                  {category.icon}
                </span>
                <span>{category.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Forum Discussions</h2>
              <div className="md:hidden">
                <button 
                  
                  className="bg-indigo-600 text-white rounded-lg py-2 px-4 flex items-center space-x-2 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <PlusCircle size={16} />
                  <span>New Post</span>
                </button>
              </div>
            </div>

            {/* Mobile category filter */}
            <div className="md:hidden mb-4 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 ${
                      activeCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Loading, error states and forum posts */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
                <p className="mt-1 text-gray-500">
                  {activeCategory === 'all' 
                    ? "Be the first to start a discussion!"
                    : `No posts found in the ${activeCategory} category.`}
                </p>
                <div className="mt-6">
                  <Link to={"/post"}>

                  <button
                    
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create a new post
                  </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-gray-900">{post.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Posted by User {post.userId} · {formatTimeAgo(post.createdAt)}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.category === 'Movie' ? 'bg-blue-100 text-blue-800' :
                        post.category === 'Show' ? 'bg-purple-100 text-purple-800' :
                        post.category === 'Novel' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {post.body}
                    </div>
                    <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MessageSquare size={14} />
                        <span>{post.replies?.length || 0} replies</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        <span>{post.likes || 0} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}