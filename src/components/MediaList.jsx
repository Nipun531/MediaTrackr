import React from 'react';
import { MediaCard } from './MediaCard';


export const MediaList = ({ mediaItems }) => {
  if (mediaItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow">
        <div className="text-5xl mb-4 text-gray-400">📋</div>
        <h3 className="text-lg font-semibold mb-2">No media items yet</h3>
        <p className="text-gray-600 max-w-md">Add your first movie, show, or novel using the form on the left.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mediaItems.map((item) => (
        // item.mediaId && <MediaCard key={item._id} item={item.mediaId} type={item.type} />
        item.mediaDetails && <MediaCard key={item._id} item={item.mediaDetails} type={item.type} />
      ))}
    </div>
  );
};
