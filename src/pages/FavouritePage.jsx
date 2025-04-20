import { useState, useEffect } from 'react';
import { Bookmark, Film, Grid, BookOpen } from 'lucide-react';

export default function FavouritePage({ id }) {
  const [fav, setFav] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const response = await fetch(`http://localhost:3000/media/favourites/${id}`);
      const data = await response.json();
  
      const formatted = data
        .filter(item => item.mediaDetails && item.type)
        .map(item => ({
          ...item.mediaDetails,
          type: item.type.toLowerCase(),
          title: item.mediaDetails.title || item.mediaDetails.name || 'Untitled',
          image: item.mediaDetails.image || '/api/placeholder/300/400',
        }));
  
      setFav(formatted);
    } catch (error) {
      console.error('Error fetching favourites:', error);
    }
  };

  const filteredFavorites = activeTab === 'all'
    ? fav
    : fav.filter(item => item.type === activeTab);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Favourites</h2>
      </div>

      {/* Category Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        {['all', 'movie', 'show', 'novel'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filteredFavorites.map(item => (
            <div  key={`${item.type}-${item.id ?? Math.random()}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                  {item.type === 'movie' && <Film size={16} className="text-red-500" />}
                  {item.type === 'show' && <Grid size={16} className="text-blue-500" />}
                  {item.type === 'novel' && <BookOpen size={16} className="text-yellow-500" />}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {item.type === 'movie' && `${item.year || 'N/A'}`}
                  {item.type === 'show' && `${item.seasons || 'N/A'} Seasons`}
                  {item.type === 'novel' && `by ${item.author || 'Unknown'}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Bookmark size={48} className="mx-auto text-indigo-300 mb-4" />
          <h3 className="text-xl text-gray-700 font-medium">No favorites yet</h3>
          <p className="text-gray-500 mt-2">Start adding your favorite {activeTab !== 'all' ? activeTab + 's' : 'media'} to see them here</p>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            onClick={() => window.location.href = '/track'}
          >
            Track Something
          </button>
        </div>
      )}
    </div>
  );
}