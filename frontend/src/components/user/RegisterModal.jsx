import React, { useState } from 'react'

import { toast } from "react-toastify";

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import axios from 'axios';

import Cookies from 'js-cookie';



const RegisterModal = ({ setIsAuthenticated }) => {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [user, setUser] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();



  const comprobar = async () => {
    if (!email || !pass) {
      toast.error(`Por favor, escriba el ${!email ? "usuario" : "password"}`, { position: "top-right", autoClose: 3000, });

    } else if (pass != confirmPass) {
      toast.error(`Las contraseñas no coinciden"`, { position: "top-right", autoClose: 3000, });

    } else {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/registro', {
          'name': user,
          'email': email,
          'password': pass
        });

        console.log(response.data);
        if (response.data.status) {
          Cookies.set('user_name', user, { secure: true, sameSite: 'Strict' });
          Cookies.set('auth_token', response.data.token, { secure: true, sameSite: 'Strict' });
          toast.success(response.data.msg, { position: "top-right", autoClose: 3000 });
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
        <div className='fondoFlecha'>
          <Link to="/" ><img src="/flecha.png" alt="Atras" /></Link>
        </div>
        <form action="" className="form">
          <div className='register'>
            <div className='inputForm'>
              <div className='divTituloR'>
                <h1>Regístrate en <strong>QuickTask</strong> y empieza a gestionar tus tareas</h1>
              </div>
              <div className="divUser">
                <label htmlFor="user"><strong>User :</strong></label>
                <input type="text" id='user' className='input' placeholder='User' onChange={(e) => setUser(e.target.value)} autoComplete="off"/>
              </div>
              <div className="divEmail">
                <label htmlFor="email"><strong>Email :</strong></label>
                <input type="text" id='email' className='input' placeholder='Email' onChange={(e) => setEmail(e.target.value)} autoComplete="off"/>
              </div>
              <div className="divPass">
                <label htmlFor="pass"><strong>Password :</strong></label>
                <input type="password" id='pass' className='input' placeholder='****' onChange={(e) => setPass(e.target.value)} autoComplete="off"/>
              </div>
              <div className="divPass">
                <label htmlFor="pass2"><strong>Repite Password :</strong></label>
                <input type="password" id='pass2' className='input' placeholder='****' onChange={(e) => setConfirmPass(e.target.value)} autoComplete="new-password"/>
              </div>
            </div>
            <div className='divRegister'>
              <button type='button' className='btn btn-outline-success ' onClick={comprobar}>Registrarse</button>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterModal