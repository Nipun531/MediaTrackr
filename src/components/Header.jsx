import React from 'react';
import { ListChecks, Heart, History, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const Header = () => {
  let decoded;
  const token=localStorage.getItem("token");
  if(token){
    decoded=jwtDecode(token);
  }
  
  return (
    <div className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📺</span>
          <h1 className="text-xl font-semibold">MediaTracker</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Link to={"/track"}>
            <button className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-purple-600 transition">
              <ListChecks size={18} />
              <span>Lists</span>
            </button>
          </Link>
          
          <button className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-purple-600 transition">
            <History size={18} />
            <span>History</span>
          </button>
          
          <Link to={"/forum"}>
          <button className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-purple-600 transition">
            <History size={18} />
            <span>Forums</span>
          </button>
          </Link>

          <Link to={"/profile"}>
            <button className="flex items-center gap-2 bg-white text-indigo-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">
              <User size={18} />
              <span>Profile</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
