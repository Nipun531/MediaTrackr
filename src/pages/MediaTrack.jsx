import React, { useState, useEffect } from 'react';
import { AddMediaForm } from '../components/AddMediaForm';

import { MediaList } from '../components/MediaList';
import { Header } from '../components/Header';
import { MediaStats } from '../components/MediaStats';
import '../MediaTrack.css'
import { jwtDecode } from "jwt-decode";






function App() {
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaNames,setMediaNames]=useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  let decoded;
    const token = localStorage.getItem("token");
    if (token) {
      decoded = jwtDecode(token); // ✅ Works correctly
      console.log("User ID:", decoded.id);
    }
  
  
  useEffect(() => {
    // Fetch media items on component mount
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/media');
      const data = await response.json();
      const Data = data.filter(item => item.userId === decoded?.id);
      // `data` now contains `mediaId` with full details of movies, shows, or novels
      setMediaItems(Data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const addMediaItem = async (mediaData) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/media/addmedia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mediaData),
      });
      
      if (response.ok) {
        // Refresh the media list
        fetchMediaItems();
      } else {
        throw new Error('Failed to add media');
      }
    } catch (error) {
      console.error('Error adding media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedia = activeTab === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-col md:flex-row flex-1 p-6 gap-6">
        <div className="w-full md:w-72 flex flex-col gap-6">
          <MediaStats mediaItems={mediaItems} />
          <AddMediaForm onAddMedia={addMediaItem} />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button 
                className={`px-4 py-3 font-medium relative ${activeTab === 'all' ? 'text-purple-700' : 'text-gray-600'}`}
                onClick={() => setActiveTab('all')}
              >
                All Media
                {activeTab === 'all' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700"></span>}
              </button>
              <button 
                className={`px-4 py-3 font-medium relative ${activeTab === 'Movie' ? 'text-purple-700' : 'text-gray-600'}`}
                onClick={() => setActiveTab('Movie')}
              >
                Movies
                {activeTab === 'Movie' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700"></span>}
              </button>
              <button 
                className={`px-4 py-3 font-medium relative ${activeTab === 'Show' ? 'text-purple-700' : 'text-gray-600'}`}
                onClick={() => setActiveTab('Show')}
              >
                Shows
                {activeTab === 'Show' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700"></span>}
              </button>
              <button 
                className={`px-4 py-3 font-medium relative ${activeTab === 'Novel' ? 'text-purple-700' : 'text-gray-600'}`}
                onClick={() => setActiveTab('Novel')}
              >
                Novels
                {activeTab === 'Novel' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700"></span>}
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8 text-purple-700">Loading...</div>
          ) : (
            <MediaList mediaItems={filteredMedia} mediaNames={mediaNames} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;