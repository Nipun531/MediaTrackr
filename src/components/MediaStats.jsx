import React from 'react';

export const MediaStats = ({ mediaItems }) => {
  // Calculate stats
  const totalCount = mediaItems.length;
  const movieCount = mediaItems.filter(item => item.type === 'Movie').length;
  const showCount = mediaItems.filter(item => item.type === 'Show').length;
  const novelCount = mediaItems.filter(item => item.type === 'Novel').length;
  
  // Calculate completion percentages
  const getCompletionStats = () => {
    const shows = mediaItems.filter(item => item.type === 'Show');
    const novels = mediaItems.filter(item => item.type === 'Novel');
    
    const showProgress = shows.length > 0 
      ? shows.reduce((sum, show) => sum + (show.watchedEpisodes / show.totalEpisodes), 0) / shows.length * 100
      : 0;
      
    const novelProgress = novels.length > 0 
      ? novels.reduce((sum, novel) => sum + (novel.pagesRead / novel.totalPages), 0) / novels.length * 100
      : 0;
      
    return {
      showProgress: Math.round(showProgress),
      novelProgress: Math.round(novelProgress)
    };
  };
  
  const { showProgress, novelProgress } = getCompletionStats();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-purple-700 font-semibold mb-4">Media Stats</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold text-purple-700">{totalCount}</span>
          <span className="text-sm text-gray-600">Total Items</span>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold text-purple-700">{movieCount}</span>
          <span className="text-sm text-gray-600">Movies</span>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold text-purple-700">{showCount}</span>
          <span className="text-sm text-gray-600">Shows</span>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-bold text-purple-700">{novelCount}</span>
          <span className="text-sm text-gray-600">Novels</span>
        </div>
      </div>
      
      {(showCount > 0 || novelCount > 0) && (
        <div className="flex flex-col gap-4">
          {showCount > 0 && (
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Show Progress</div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: `${showProgress}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-600">{showProgress}%</div>
            </div>
          )}
          
          {novelCount > 0 && (
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Novel Progress</div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${novelProgress}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-600">{novelProgress}%</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};