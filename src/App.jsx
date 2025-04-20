import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MediaTrack from "./pages/MediaTrack";
import Landing from "./pages/Landing";
import EditProfile from "./pages/EditProfile";
import MediaPage from "./pages/MediaPage";
import EditMediaPage from "./pages/EditMediaPage";
import FavouritePage from "./pages/FavouritePage";
import ForumPage from "./pages/ForumPage";
import CreatePost from "./pages/CreatePost";

export default function App(){
  return(
    <Router>
      <Routes>
      <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<Profile /> } />
        <Route path="/edit-profile" element={<EditProfile /> } />
        <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/track" element={<MediaTrack />} />
      <Route path="/track/:type/:name" element={<MediaPage />} />
      <Route path="/track/edit/:type/:name" element={<EditMediaPage />} />
      <Route path="/forum" element={<ForumPage />} />
      <Route path="/post" element={<CreatePost />} />

      </Routes>
    </Router>
  )
}