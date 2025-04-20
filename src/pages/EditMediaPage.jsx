import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditMediaPage = () => {
  const { type, name } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    totalEpisodes: 0,
    watchedEpisodes: 0,
    totalPages: 0,
    pagesRead: 0,
    releaseDate: '',
    synopsis: '',
    creator: '',
    director: '',
    author: '',
    
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Fetch current media data
  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/media/${type}/${name}`);
        
        // Format the date for the input field (YYYY-MM-DD)
        let releaseDate = '';
        if (response.data.releaseDate) {
          const date = new Date(response.data.releaseDate);
          releaseDate = date.toISOString().split('T')[0];
        }
        
        
        setFormData({
          name: response.data.name || '',
          totalEpisodes: response.data.totalEpisodes || 0,
          watchedEpisodes: response.data.watchedEpisodes || 0,
          totalPages: response.data.totalPages || 0,
          pagesRead: response.data.pagesRead || 0,
          releaseDate: releaseDate,
          synopsis: response.data.synopsis || '',
          creator: response.data.creator || '',
          director: response.data.director || '',
          author: response.data.author || '',
        });
        
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
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert number inputs to numbers
    if (['totalEpisodes', 'watchedEpisodes', 'totalPages', 'pagesRead'].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitMessage('');
      
      const payload = {
        type,
        name,
        ...formData,
        
      };
      
      const response = await axios.put('http://localhost:3000/media/editmedia', payload);
      
      setSubmitMessage('Media updated successfully!');
      
      // Navigate back to media page after short delay
      setTimeout(() => {
        navigate(`/track/${type}/${name}`);
      }, 1500);
      
    } catch (err) {
      console.error("Error updating media:", err);
      setSubmitMessage(err.response?.data?.msg || "Failed to update media");
    }
  };
  
  // Render appropriate fields based on media type
  const renderTypeSpecificFields = () => {
    switch(type) {
      case 'Show':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Creator
              </label>
              <input
                type="text"
                name="creator"
                value={formData.creator}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Total Episodes
                </label>
                <input
                  type="number"
                  name="totalEpisodes"
                  value={formData.totalEpisodes}
                  onChange={handleChange}
                  min="0"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Watched Episodes
                </label>
                <input
                  type="number"
                  name="watchedEpisodes"
                  value={formData.watchedEpisodes}
                  onChange={handleChange}
                  min="0"
                  max={formData.totalEpisodes}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </>
        );
      
      case 'Movie':
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Director
            </label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        );
      
      case 'Novel':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Total Pages
                </label>
                <input
                  type="number"
                  name="totalPages"
                  value={formData.totalPages}
                  onChange={handleChange}
                  min="0"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pages Read
                </label>
                <input
                  type="number"
                  name="pagesRead"
                  value={formData.pagesRead}
                  onChange={handleChange}
                  min="0"
                  max={formData.totalPages}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </>
        );
      
      default:
        return null;
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
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden p-6">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Edit {type}: {name}</h1>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            {type}
          </span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Common fields for all media types */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Release Date
          </label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Synopsis
          </label>
          <textarea
            name="synopsis"
            value={formData.synopsis}
            onChange={handleChange}
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        
        {/* Render fields specific to media type */}
        {renderTypeSpecificFields()}
        
        {/* Submit button and navigation */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate(`/track/${type}/${name}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Changes
          </button>
        </div>
        
        {/* Submit status message */}
        {submitMessage && (
          <div className={`mt-4 p-3 rounded ${submitMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default EditMediaPage;