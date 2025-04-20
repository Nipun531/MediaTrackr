import React, { useState, useEffect } from 'react';
import { Link, Route, useParams } from 'react-router-dom';
import axios from 'axios';
import { Header } from '../components/Header';

const MediaPage = () => {
  const [activeTab, setActiveTab] = useState('lists');
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get type and name from URL params
  const { type, name } = useParams();
  
  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/media/${type}/${name}`);
        setMedia(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching media:", err);
        setError(err.response?.data?.msg || "Failed to load media information");
        setLoading(false);
      }
    };
    
    if (type && name) {
      fetchMediaData();
    }
  }, [type, name]);
  
  // Calculate progress percentage based on media type
  const calculateProgress = () => {
    if (!media) return 0;
    
    switch(type) {
      case 'Movie':
        return 100; // Movies are either watched or not
      case 'Show':
        return media.totalEpisodes > 0 ? (media.watchedEpisodes / media.totalEpisodes) * 100 : 0;
      case 'Novel':
        return media.totalPages > 0 ? (media.pagesRead / media.totalPages) * 100 : 0;
      default:
        return 0;
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get creator/author/director based on media type
  const getCreator = () => {
    if (!media) return "Unknown";
    
    switch(type) {
      case 'Movie':
        return media.director || "Unknown Director";
      case 'Show':
        return media.creator || "Unknown Creator";
      case 'Novel':
        return media.author || "Unknown Author";
      default:
        return "Unknown";
    }
  };
  
  // Get status text based on media type
  const getStatusText = () => {
    if (!media) return "";
    
    switch(type) {
      case 'Movie':
        return "Watched";
      case 'Show':
        return `Watching - ${media.watchedEpisodes}/${media.totalEpisodes} episodes`;
      case 'Novel':
        return `Reading - ${media.pagesRead}/${media.totalPages} pages`;
      default:
        return "";
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-indigo-600 text-xl">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }
  
  if (!media) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-xl">No media found</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header Navigation */}
      <div className="bg-indigo-600 text-white p-3">
        <Header />
      </div>
      
      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-50 p-4 flex flex-col border-r border-gray-200">
          {/* Media Image */}
          <div className="mb-4">
            <div className="bg-gray-200 rounded-lg overflow-hidden">
              <img src="/api/placeholder/240/320" alt="Media Cover" className="w-full h-auto" />
            </div>
            <Link to={`/track/edit/${type}/${name}`}>
            <button className="mt-2 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
              EDIT
            </button>
            </Link>
          </div>
          
          {/* Status Section */}
          <div className="bg-gray-100 rounded-lg p-4 flex-1 mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Your Status</h3>
            <p className="text-sm text-gray-600 mb-1">{getStatusText()}</p>
            <p className="text-sm text-gray-600">Started: {formatDate(media.dateStarted)}</p>
            
            <div className="mt-4">
              <div className="w-full bg-gray-300 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Release Date: {formatDate(media.releaseDate)}</p>
              <p className="mt-1">{getCreator()}</p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Title and Synopsis */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">{media.name}</h1>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {type}
              </span>
            </div>
            <p className="mt-2 text-gray-600">
              {media.synopsis || "No synopsis available."}
            </p>
          </div>
          
          {/* Media-specific details */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Details</h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {type === 'Movie' && (
                <p className="text-gray-700">Episode: {media.episode || 1}</p>
              )}
              {type === 'Show' && (
                <p className="text-gray-700">Episodes: {media.watchedEpisodes || 0} of {media.totalEpisodes}</p>
              )}
              {type === 'Novel' && (
                <p className="text-gray-700">Pages: {media.pagesRead || 0} of {media.totalPages}</p>
              )}
            </div>
          </div>
          
          {/* Characters placeholder (since characters aren't in your schema) */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Characters</h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-gray-500 text-center">
              No character information available.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPage;