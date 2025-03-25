import styles from "./styles/Login.module.css"
import React, { useEffect, useState } from 'react'
/*

*/
import { toast } from "react-toastify";

import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

import Cookies from 'js-cookie';

import { GoogleLogin } from '@react-oauth/google';

import { BASE_URL, GOOGLE_ID } from '../../config';

const LoginModal = ({ setIsAuthenticated }) => {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const comprobar = async () => {
    if (!email || !pass) {
      toast.error(`Por favor, escriba el ${!email ? "usuario" : "password"}`, { position: "top-right", autoClose: 3000, });
    } else if (pass.length < 7) {
      toast.error("La contraseña debe tener al menos 7 caracteres.", { position: "top-right", autoClose: 3000 });
    } else {
      try {
        const response = await axios.post(`${BASE_URL}login`, {
          'email': email,
          'password': pass
        });

        if (response.data.status) {
          toast.success(response.data.msg, { position: "top-right", autoClose: 3000 });
          Cookies.set('auth_token', response.data.token, { secure: true, sameSite: 'none' });
          setIsAuthenticated(true);
          navigate('/tasks');
        } else {
          toast.error(response.data.msg, { position: "top-right", autoClose: 3000, });
        }

      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            toast.error("Por favor, corrige los errores en el formulario", { position: "top-right", autoClose: 3000, });
            setError('Error de validación');
            console.error(error);
          }
        } else {
          toast.error("Error de conexión", { position: "top-right", autoClose: 3000, });
          setError('Error de conexión');
          console.error(error);
        }

      }
    }
  }

  /**
   *  funciones de Google
   * 
   */
  const loginGoogle = async (event) => {
    try {
      const response = await axios.post(`${BASE_URL}loginGoogle`, {
        'token': event.credential
      });

      if (response.data.status) {
        toast.success(response.data.msg, { position: "top-right", autoClose: 3000 });

        Cookies.set('auth_token', response.data.token, { secure: true, sameSite: 'none' });
        setIsAuthenticated(true);
        navigate('/tasks');
      } else {
        toast.error(response.data.msg, { position: "top-right", autoClose: 3000, });
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setError("Error de validación: Token inválido o no enviado.");
          toast.error("Error de validación", { position: "top-right" });
        }
      } else {
        setError("Ocurrió un error inesperado.");
        toast.error("Ocurrió un error inesperado.", { position: "top-right" });
      }
      console.error(error);
    }
  };


  const errorGoogle = () => {
    toast.error("Error al iniciar sesión con Google", { position: "top-right", autoClose: 3000, });
    console.error('Error al iniciar sesión con Google');
  };

  return (
    <div className="user-page">
      <div className='d-flex justify-content-center align-items-center vh-100 '>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); comprobar(); }}>
            <div className={styles["container-lg"]}>
              <div className={styles["div-form"]}>
                <div className={styles["div-title"]}>
                  <h1>Ya soy parte de <strong>QuickTask</strong></h1>
                </div>
                <div className={styles["div-email"]}>
                  <label htmlFor="email"><strong>Correo electrónico :</strong></label>
                  <input type="email" id='email' className={styles.input} placeholder='Correo electrónico' onChange={(e) => setEmail(e.target.value)} autoComplete='off' />
                </div>
                <div className={styles["div-pass"]}>
                  <label htmlFor="pass"><strong>Contraseña :</strong></label>
                  <input type="password" id='pass' className={styles.input} placeholder='********' onChange={(e) => setPass(e.target.value)} autoComplete='off' />
                </div>
              </div>
              <div className={styles["div-btn"]}>
                <button type='submit' className={styles.btn}>Iniciar</button>
              </div>

            </div>
          </form>

          <div className={styles["container-rg"]}>
            <div className={styles.google}>
              <GoogleLogin
                clientId={GOOGLE_ID}
                theme="filled_black"
                size=" large"
                onSuccess={loginGoogle}
                onError={errorGoogle}
                cookiePolicy={"single_host_policy"}
              />
            </div>
            <div className={styles["div-rg"]}>
              <h1>Regístrate en <strong>QuickTask</strong> y empieza a gestionar tus tareas</h1>
              <Link to="/register" className={styles.link} >Registrarme</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
