// App.jsx
import "./App.css";
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { UserContext, UserContextProvider } from "../context/userContext";
import Login from "./pages/Login";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import TestNav from "./pages/TestNav";
import Rules from "./pages/Rules";
import PrivateRoute2 from "./components/PrivateRoute2";
import Profile from "./pages/Profile";
import ChatBot from "./pages/ChatBot";
import PrivateRoute3 from "./components/PrivateRoute3";
import Workspace from "./pages/Workspace";
import RuleFlow from "./pages/RuleFlow";
import GlobalLoadingSpinner from "./components/GlobalLoadingSpinner";

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.withCredentials = true;

function App() {
  const { user, loading } = useContext(UserContext);

  return (
    <UserContextProvider>
      {loading && <GlobalLoadingSpinner />}
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        {user ? (
          <Navigate to="/" />
        ) : (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </>
        )}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/workspaces"
          element={
            <PrivateRoute3>
              <Workspace />
            </PrivateRoute3>
          }
        />
        <Route
          path="/ruleflow"
          element={
            <PrivateRoute3>
              <RuleFlow />
            </PrivateRoute3>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute3>
              <Profile />
            </PrivateRoute3>
          }
        />
        <Route
          path="/rules"
          element={
            <PrivateRoute2>
              <Rules />
            </PrivateRoute2>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute2>
              <ChatBot />
            </PrivateRoute2>
          }
        />
        <Route path="/test" element={<TestNav />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
