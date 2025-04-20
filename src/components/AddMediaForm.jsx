import React, { useEffect, useState } from 'react';
import '../MediaTrack.css'
import { jwtDecode } from "jwt-decode";




export const AddMediaForm = ({ onAddMedia }) => {
  const [isOpen, setIsOpen] = useState(false);
      let decoded;
      const token = localStorage.getItem("token");
      if (token) {
        decoded = jwtDecode(token); // ✅ Works correctly
        console.log("User ID:", decoded.id);
    }
    
  const [formData, setFormData] = useState({
    type: 'Movie',
    name: '',
    totalEpisodes: '',
    watchedEpisodes: '',
    totalPages: '',
    pagesRead: '',
    dateStarted: new Date().toISOString().split('T')[0],
    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add userId - in a real app, you'd get this from your auth context
    const mediaData = {
      ...formData,
      userId: decoded.id,
      // Convert string fields to numbers for Prisma
      totalEpisodes: formData.totalEpisodes ? parseInt(formData.totalEpisodes, 10) : undefined,
      watchedEpisodes: formData.watchedEpisodes ? parseInt(formData.watchedEpisodes, 10) : undefined,
      totalPages: formData.totalPages ? parseInt(formData.totalPages, 10) : undefined,
      pagesRead: formData.pagesRead ? parseInt(formData.pagesRead, 10) : undefined,
      dateStarted: new Date(formData.dateStarted),
    };
    
    onAddMedia(mediaData);
    
    // Reset form
    setFormData({
      type: 'Movie',
      name: '',
      totalEpisodes: '',
      watchedEpisodes: '',
      totalPages: '',
      pagesRead: '',
      dateStarted: new Date().toISOString().split('T')[0],
      
    });
    
    setIsOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {!isOpen ? (
        <button 
          className="w-full py-4 bg-pink-500 text-white font-semibold hover:bg-pink-600 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          + Add New Media
        </button>
      ) : (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-purple-700 font-semibold">Add New Media</h3>
            <button 
              className="text-gray-500 text-xl p-1 hover:bg-gray-100 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="type" className="text-sm font-medium">Media Type</label>
              <select 
                id="type" 
                name="type" 
                value={formData.type} 
                onChange={handleChange} 
                required
                className="p-2 border border-gray-300 rounded text-base"
              >
                <option value="Movie">Movie</option>
                <option value="Show">TV Show</option>
                <option value="Novel">Novel</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">Title</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="p-2 border border-gray-300 rounded text-base"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label htmlFor="dateStarted" className="text-sm font-medium">Date Started</label>
              <input 
                type="date" 
                id="dateStarted" 
                name="dateStarted" 
                value={formData.dateStarted} 
                onChange={handleChange} 
                required 
                className="p-2 border border-gray-300 rounded text-base"
              />
            </div>
            
            {formData.type === 'Show' && (
              <>
                <div className="flex flex-col gap-1">
                  <label htmlFor="totalEpisodes" className="text-sm font-medium">Total Episodes</label>
                  <input 
                    type="number" 
                    id="totalEpisodes" 
                    name="totalEpisodes" 
                    value={formData.totalEpisodes} 
                    onChange={handleChange} 
                    required 
                    min="1"
                    className="p-2 border border-gray-300 rounded text-base"
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label htmlFor="watchedEpisodes" className="text-sm font-medium">Episodes Watched</label>
                  <input 
                    type="number" 
                    id="watchedEpisodes" 
                    name="watchedEpisodes" 
                    value={formData.watchedEpisodes} 
                    onChange={handleChange} 
                    min="0"
                    max={formData.totalEpisodes}
                    className="p-2 border border-gray-300 rounded text-base"
                  />
                </div>
              </>
            )}
            
            {formData.type === 'Novel' && (
              <>
                <div className="flex flex-col gap-1">
                  <label htmlFor="totalPages" className="text-sm font-medium">Total Pages</label>
                  <input 
                    type="number" 
                    id="totalPages" 
                    name="totalPages" 
                    value={formData.totalPages} 
                    onChange={handleChange} 
                    required 
                    min="1"
                    className="p-2 border border-gray-300 rounded text-base"
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label htmlFor="pagesRead" className="text-sm font-medium">Pages Read</label>
                  <input 
                    type="number" 
                    id="pagesRead" 
                    name="pagesRead" 
                    value={formData.pagesRead} 
                    onChange={handleChange} 
                    min="0"
                    max={formData.totalPages}
                    className="p-2 border border-gray-300 rounded text-base"
                  />
                </div>
              </>
            )}
            
            <div className="flex justify-end gap-2 mt-2">
              <button 
                type="button" 
                onClick={() => setIsOpen(false)} 
                className="px-3 py-2 bg-gray-100 text-gray-800 font-medium rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-3 py-2 bg-purple-700 text-white font-medium rounded hover:bg-purple-800"
              >
                Add Media
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};