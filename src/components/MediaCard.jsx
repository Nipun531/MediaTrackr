import React from 'react';

export const MediaCard = ({ item, type }) => {
  const getProgress = () => {
    if (type === 'Movie') return 100; 
    if (type === 'Show' && item.totalEpisodes > 0) 
      return Math.round((item.watchedEpisodes / item.totalEpisodes) * 100);
    if (type === 'Novel' && item.totalPages > 0) 
      return Math.round((item.pagesRead / item.totalPages) * 100);
    
    return 0;
  };

  const progress = getProgress();

  const getTypeInfo = () => {
    switch(type) {
      case 'Movie': return { icon: '🎬', color: 'border-red-500', bgColor: 'bg-red-500' };
      case 'Show': return { icon: '📺', color: 'border-blue-500', bgColor: 'bg-blue-500' };
      case 'Novel': return { icon: '📚', color: 'border-green-500', bgColor: 'bg-green-500' };
      default: return { icon: '📁', color: 'border-gray-500', bgColor: 'bg-gray-500' };
    }
  };

  const { icon, color, bgColor } = getTypeInfo();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${color} transition-all hover:-translate-y-1 hover:shadow-md`}>
      <div className="relative p-6 pb-4">
        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full ${bgColor} text-white flex items-center justify-center`}>
          {icon}
        </div>
        
        <h3 className="font-semibold mb-2 pr-10">{item.name}</h3>
        
        <div className="flex flex-col gap-1 mb-4 text-sm text-gray-600">
          <span>Started: {formatDate(item.dateStarted)}</span>
          
          {type === 'Show' && (
            <span className="font-medium">
              {item.watchedEpisodes} / {item.totalEpisodes} episodes
            </span>
          )}
          
          {type === 'Novel' && (
            <span className="font-medium">
              {item.pagesRead} / {item.totalPages} pages
            </span>
          )}
        </div>
        
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
          <div 
            className={`h-full ${bgColor}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="text-right text-xs font-semibold">{progress}%</div>
      </div>
    </div>
  );
};
