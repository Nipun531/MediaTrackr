import React, { useEffect, useState } from 'react';
import { Heart, ListChecks, History, User, Film, Tv, BookOpen, Book, Mail, MapPin, Calendar, Clock, Edit3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MediaStats } from '../components/MediaStats';
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const [mediaItems, setMediaItems] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  let decoded;
  const token = localStorage.getItem("token");
  if (token) {
    decoded = jwtDecode(token); // ✅ Works correctly
    console.log("User ID:", decoded.id);
  }
  
  useEffect(() => {
    // Fetch media items on component mount
    fetchMediaItems();
    fetchUserInfo();
  }, []);
  
  const fetchMediaItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/media');
      const data = await response.json();
      
      // `data` now contains `mediaId` with full details of movies, shows, or novels
      setMediaItems(data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } 
  };
  
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:3000/user');
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } 
  }

  const userData = userInfo.find(item => item._id === decoded?.id) || {};
  console.log(userInfo);
  const navigate = useNavigate();

  // Sample bio text if not available in userData
  const userBio = userData.bio || "Hi there! I'm a passionate media enthusiast who loves tracking and discovering new content. I enjoy discussing my favorite shows, movies, novels, and manga with fellow fans. Feel free to connect with me to share recommendations!";

  // Sample recent activity data
  const recentActivity = [
    { type: 'movie', title: 'Inception', action: 'watched', date: '2 days ago' },
    { type: 'show', title: 'Breaking Bad', action: 'added to favorites', date: '1 week ago' },
    { type: 'novel', title: 'The Alchemist', action: 'finished reading', date: '3 weeks ago' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex space-x-6">
            <button className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-700 hover:bg-indigo-500 transition">
              <ListChecks size={18} />
              <span>Lists</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-indigo-500 transition">
              <Heart size={18} />
              <span>Favs</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-indigo-500 transition">
              <History size={18} />
              <span>History</span>
            </button>
          </div>
          <button className="bg-indigo-700 hover:bg-indigo-800 p-2 rounded-full">
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md flex flex-col items-center py-6 px-4">
          <div className="text-xl font-semibold mb-4">{userData.firstname || "User"}</div>
          <div className="relative mb-6">
            <img
              src={userData.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-lg object-cover"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <Link to={"/edit-profile"}>
              <button 
                className="text-indigo-600 font-medium px-4 py-2 border border-indigo-600 rounded-full hover:bg-indigo-50 transition flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            </Link>
          </div>
          <div className="w-full space-y-3 text-gray-700 mt-2">
            <div className="flex items-center gap-2">
              <User size={16} className="text-indigo-500" />
              <span className="font-medium">Gender:</span>
              <span className="ml-auto">{userData.gender || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-indigo-500" />
              <span className="font-medium">Age:</span>
              <span className="ml-auto">{userData.age || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" />
              <span className="font-medium">Location:</span>
              <span className="ml-auto">{userData.Location || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-indigo-500" />
              <span className="font-medium">Last Online:</span>
              <span className="ml-auto text-green-600 font-medium">{userData.lastOnline || "Now"}</span>
            </div>
          </div>
          
          {/* Media Stats in Sidebar */}
          <div className="w-full mt-6">
            <MediaStats mediaItems={mediaItems} />
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 font-medium ${activeTab === 'activity' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Recent Activity
            </button>
            <button 
              onClick={() => setActiveTab('collections')}
              className={`px-4 py-2 font-medium ${activeTab === 'collections' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Collections
            </button>
          </div>
          
          {/* Bio Section */}
          {activeTab === 'overview' && (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <Edit3 size={18} />
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed">{userBio}</p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} className="text-indigo-500" />
                    <span>{userData.email || "user@example.com"}</span>
                  </div>
                </div>
              </div>

              {/* Track Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Track Anything</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Movie */}
                  <Link to="/track" className="block">
                    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 h-full">
                      <div className="bg-red-100 p-3 rounded-full mb-3">
                        <Film size={32} className="text-red-500" />
                      </div>
                      <span className="font-medium text-gray-800">Movie</span>
                      <p className="text-gray-500 text-sm mt-2 text-center">Track your favorite films</p>
                    </div>
                  </Link>

                  {/* Show */}
                  <Link to="/track" className="block">
                    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 h-full">
                      <div className="bg-blue-100 p-3 rounded-full mb-3">
                        <Tv size={32} className="text-blue-500" />
                      </div>
                      <span className="font-medium text-gray-800">Show</span>
                      <p className="text-gray-500 text-sm mt-2 text-center">Keep up with TV series</p>
                    </div>
                  </Link>

                  {/* Novel */}
                  <Link to="/track" className="block">
                    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 h-full">
                      <div className="bg-yellow-100 p-3 rounded-full mb-3">
                        <BookOpen size={32} className="text-yellow-500" />
                      </div>
                      <span className="font-medium text-gray-800">Novel</span>
                      <p className="text-gray-500 text-sm mt-2 text-center">Track your reading progress</p>
                    </div>
                  </Link>

                  {/* Manga */}
                  <Link to="/track" className="block">
                    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 h-full">
                      <div className="bg-purple-100 p-3 rounded-full mb-3">
                        <Book size={32} className="text-purple-500" />
                      </div>
                      <span className="font-medium text-gray-800">Manga</span>
                      <p className="text-gray-500 text-sm mt-2 text-center">Follow your favorite manga</p>
                    </div>
                  </Link>
                </div>
              </div>
            </>
          )}
          
          {/* Recent Activity Tab */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start p-4 border-b border-gray-100 last:border-0">
                    <div className={`p-2 rounded-full mr-4 ${
                      activity.type === 'movie' ? 'bg-red-100' : 
                      activity.type === 'show' ? 'bg-blue-100' : 
                      'bg-yellow-100'
                    }`}>
                      {activity.type === 'movie' ? <Film size={20} className="text-red-500" /> : 
                       activity.type === 'show' ? <Tv size={20} className="text-blue-500" /> : 
                       <BookOpen size={20} className="text-yellow-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">
                        You <span className="font-medium">{activity.action}</span> {activity.title}
                      </p>
                      <p className="text-gray-500 text-sm">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Collections Tab */}
          {activeTab === 'collections' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Collections</h2>
              <p className="text-gray-600">You haven't created any collections yet.</p>
              <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Create Collection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}