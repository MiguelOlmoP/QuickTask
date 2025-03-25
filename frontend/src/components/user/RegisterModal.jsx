import styles from "./styles/Register.module.css";

import React, { useState } from 'react';

import { toast } from "react-toastify";

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import axios from 'axios';

import Cookies from 'js-cookie';

import { BASE_URL } from '../../config';

const RegisterModal = ({ setIsAuthenticated }) => {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const comprobar = async () => {
    if (!user || !email || !pass) {
      toast.error(`Por favor, escriba ${!user ? "el nombre de usuario" : !email ? "el correo electrónico" : "la contraseña"}`, { position: "top-right", autoClose: 3000, });

    } else if (pass.length < 7) {
      toast.error(`La contraseña debe tener al menos 7 caracteres`, { position: "top-right", autoClose: 3000, });

    } else if (pass != confirmPass) {
      toast.error(`Las contraseñas no coinciden`, { position: "top-right", autoClose: 3000, });

    } else {
      try {
        const response = await axios.post(`${BASE_URL}registro`, {
          'name': user,
          'email': email,
          'password': pass,
          'password2': confirmPass
        });

        if (response.data.status) {
          Cookies.set('auth_token', response.data.token, { secure: true, sameSite: 'none' });
          toast.success(response.data.msg, { position: "top-right", autoClose: 3000 });
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

  return (
    <div className="user-page">

      <div className='d-flex justify-content-center align-items-center vh-100 '>
        <div className={styles.container}>
          <div className="row w-100">
            <div className={`col-12 ms-3  ${styles['container-img']}`}>
              <Link to="/" ><img src="/flecha.png" alt="Atras" /></Link>
            </div>
          </div>
          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); comprobar(); }}>
            <div className={`d-flex flex-column justify-content-center align-items-center ${styles["div-rg"]}`}>
              <div className={`row ${styles["div-form"]}`}>
                <div className={`col-12 ${styles["div-title"]}`}>
                  <h1>Regístrate en <strong>QuickTask</strong> y empieza a gestionar tus tareas</h1>
                </div>
                <div className="col-sm-6 ">
                  <div className={styles.div}>
                    <label htmlFor="user" className={styles.lb}><strong>Nombre de usuario :</strong></label>
                    <input type="text" id='user' className={styles.input} placeholder='Nombre de usuario' onChange={(e) => setUser(e.target.value)} autoComplete="off" />
                  </div>
                  <div className={styles.div}>
                    <label htmlFor="email" className={styles.lb}><strong>Correo electrónico :</strong></label>
                    <input type="email" id='email' className={styles.input} placeholder='Correo electrónico' onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
                  </div>
                </div>
                <div className="col-sm-6 ">
                  <div className={styles.div}>
                    <label htmlFor="pass" className={styles.lb}><strong>Contraseña :</strong></label>
                    <input type="password" id='pass' className={styles.input} placeholder='******' onChange={(e) => setPass(e.target.value)} autoComplete="off" />
                  </div>
                  <div className={styles.div}>
                    <label htmlFor="pass2" className={styles.lb}><strong>Repite Contraseña :</strong></label>
                    <input type="password" id='pass2' className={styles.input} placeholder='******' onChange={(e) => setConfirmPass(e.target.value)} autoComplete="new-password" />
                  </div>
                </div>
              </div>
              <div className={styles["div-btn"]}>
                <button type='submit' className={styles.btn} >Crear Cuenta</button>
              </div>

            </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default RegisterModal