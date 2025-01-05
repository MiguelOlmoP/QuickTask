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

import axios from 'axios';



function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/session');
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, []);


  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated}/>} />

        <Route path="/tasks" element={isAuthenticated ? <TaskList  setIsAuthenticated={setIsAuthenticated} /> :  <Navigate to="/" />} />
        <Route path="/modal" element={isAuthenticated ? <Modal /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App
