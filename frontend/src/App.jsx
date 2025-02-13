import './App.css';
import "./components/task/taskStyles.css";
import "./components/user/userStyles.css";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import React, { useEffect, useState } from 'react'


import Modal from './components/task/TaskModal';
import TaskList from './components/task/TaskList';
import Login from './components/user/Login';
import Register from './components/user/RegisterModal';
/*
    Libreria de notificaciones
*/
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/*
    Libreria de react-bootstrap

import 'bootstrap/dist/css/bootstrap.min.css';

*/

/*
    Google OAuth
*/

import { GoogleOAuthProvider } from '@react-oauth/google';

import Cookies from 'js-cookie';

import axios from 'axios';

import { BASE_URL, GOOGLE_ID } from './config.js';


function App() {
 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  const [userName, setUserName] = useState("");


  useEffect(() => {
    const token = Cookies.get('auth_token');
    
    if (token) {
      setIsAuthenticated(true);

      axios.get(`${BASE_URL}session`, {
        headers: { 'Authorization': `Bearer ${token}`, }
      })
        .then((response) => {
          if(response.data.status){
            setUserName(response.data.userName.split(" ")[0]);
          }
        })
        .catch((error) => {
          console.error("Error obteniendo usuario:", error);
          setIsAuthenticated(false);
          setUserName(""); 
        });

    } else {
      setIsAuthenticated(false); 
    }

    setIsLoading(false); 
  }, [isAuthenticated]); 


  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <GoogleOAuthProvider clientId={GOOGLE_ID}>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />

          <Route path="/tasks" element={isAuthenticated ? <TaskList setIsAuthenticated={setIsAuthenticated} userName={userName} /> : <Navigate to="/" />} />
          <Route path="/modal" element={isAuthenticated ? <Modal /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App
