import React, { useState } from 'react'
/*

*/
import { toast } from "react-toastify";

import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

import Cookies from 'js-cookie';


const LoginModal = ({ setIsAuthenticated }) => {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const comprobar = async () => {
    if (!email || !pass) {
      toast.error(`Por favor, escriba el ${!email ? "usuario" : "password"}`, { position: "top-right", autoClose: 3000, });
    } else {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', {          
          'email': email,
          'password': pass
        });

        if (response.data.status) {
          toast.success(response.data.msg, { position: "top-right", autoClose: 3000 });
          
          Cookies.set('user_name', response.data.user_name, { secure: true, sameSite: 'Strict' });
          Cookies.set('auth_token', response.data.token, {secure: true, sameSite: 'Strict'});
          setIsAuthenticated(true);
          navigate('/tasks');
        } else {
          toast.error(response.data.msg, { position: "top-right", autoClose: 3000, });

        }

      } catch (error) {
        setError('Error al conectar con el servidor.');
        console.error(error);
      }
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 '>
      <div className='fondoForm'>
        <form className="form">
          <div className='fondoLogin'>
            <div className='inputForm'>
              <div className='divTitulo'>
                <h1>Ya soy parte de <strong>QuickTask</strong></h1>
              </div>
              <div className="divUser">
                <label htmlFor="email"><strong>Email :</strong></label>
                <input type="text" id='email' className='input' placeholder='Email'  onChange={(e) => setEmail(e.target.value)} autoComplete='off'/>
              </div>
              <div className="divPass">
                <label htmlFor="pass"><strong>Password :</strong></label>
                <input type="password" id='pass' className='input' placeholder='****' onChange={(e) => setPass(e.target.value)} autoComplete='off'/>
              </div>
            </div>
            <div className='div'>
              <button type='button' className='btn btn-outline-primary' onClick={comprobar}>Iniciar</button>
            </div>

          </div>
        </form>

        <div className="fondoRegister">

          <div className='google'>

          </div>
          <div className='divRegister'>
            <h1>Regístrate en <strong>QuickTask</strong> y empieza a gestionar tus tareas</h1>
            <Link to="/register" className='btn btn-outline-dark linkRegister' >Regístrate</Link>
          </div>


        </div>
      </div>
    </div>
  )
}

export default LoginModal