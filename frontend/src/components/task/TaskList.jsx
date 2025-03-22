import styles from "./styles/List.module.css"
import React, { useEffect, useState } from 'react'
import TaskModal from './TaskModal';
import { toast } from "react-toastify";

import Cookies from 'js-cookie';


// Imagenes
import logo from '../../assets/logo.png';
import papelera from '../../assets/papelera.png';
import lapiz from '../../assets/lapiz.png';
import quickTask from '../../assets/quickTask.png';
import user from '../../assets/user.png';
import cierre from '../../assets/cierre.png';
import ajustes from '../../assets/ajustes.png';
import mas from '../../assets/mas.png';

import { useNavigate } from "react-router-dom";

import axios from 'axios';

import { BASE_URL } from '../../config';


function TaskList({ setIsAuthenticated, userName }) {

    const [error, setError] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalReact, setModalReact] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskToRemove, setTaskToRemove] = useState(null);
    const [arrayDatos, setArrayDatos] = useState([]);
    const [filtro, setFiltro] = useState("default");
    const tareasFiltradas = [...arrayDatos];

    if (filtro === "prioridad") {
        const prioridadOrden = { "alta": 1, "media": 2, "baja": 3 };
        tareasFiltradas.sort((a, b) => prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad]);
    } else if (filtro === "fecha") {
        tareasFiltradas.sort((a, b) => new Date(a.fechaForm) - new Date(b.fechaForm));
    }

    const imagenes = {
        logo,
        papelera,
        lapiz,
        quickTask,
        user,
        cierre,
        ajustes,
        mas
    }

    useEffect(() => {
        viewtask();
    }, []);

    const viewtask = async () => {
        try {
            // Obtener el token de autenticación almacenado en las cookies
            const token = Cookies.get('auth_token');
            const response = await axios.get(`${BASE_URL}taskList`, {
                headers: {
                    // Incluir el token JWT en las cabeceras de la solicitud para autenticar al usuario
                    'Authorization': `Bearer ${token}`,
                }
            });
            // Modificar los datos de las tareas para separar la fecha y la hora
            const modifiedData = response.data.map(task => {
                const [date, time] = task.fecha.split(' ');
                return {
                    ...task,
                    fechaForm: date,
                    horaForm: time.slice(0, 5),
                    fecha: task.fecha
                };
            });
            setArrayDatos(modifiedData);

        } catch (error) {
            setError('Error al conectar con el servidor.');
            console.error(error);
        }
    }


    const openModal = (task = null) => {
        setTaskToEdit(task);
        setModalOpen(true);
    };

    const closeModal = () => {
        setTaskToEdit(null);
        setModalOpen(false);
    };

    const openModalR = (id) => {
        setTaskToRemove(id);
        setModalReact(true);
    };

    const closeModalR = () => {
        setTaskToRemove(null);
        setModalReact(false);
    };

    const navigate = useNavigate();

    const cerrarSesion = async () => {
        try {
            const token = Cookies.get('auth_token');
            const response = await axios.post(`${BASE_URL}logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data.status) {
                Cookies.remove('auth_token');
                setIsAuthenticated(false);
                toast.success(response.data.msg, { position: "top-right", autoClose: 3000 });

            } else {
                toast.error('1 Error al cerrar la sesión', { position: "top-right", autoClose: 3000 });
            }
        } catch (error) {
            console.error('Error al cerrar la sesión:', error);
            toast.error('2 Error al conectar con el servidor', { position: "top-right", autoClose: 3000 });
        }
    };


    const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
        const animationDuration = `${speed}s`;

        return (
            <div
                className={`${styles["shiny-text"]} ${disabled ? 'disabled' : ''} ${className}`}
                style={{ animationDuration }}
            >
                {text}
            </div>
        );
    };

    return (

        <div className={`d-flex flex-column ${styles["container"]} `}>
                      <div className={styles["div-btn"]}>
                <button className={styles["btn-mas"]} onClick={() => openModal()} >
                    <img src={imagenes.mas} alt="Nueva Tarea" title="Nueva Tarea" className={styles.img} />
                </button>
            </div>

            {/* Menú lateral */}
            <div className={styles["menu-hover-area"]}>
                <div className={styles["fondo-menu"]}>
                    <div className={styles.menu}>
                        <div className={styles["menu-title"]}>
                            <img src={imagenes.logo} alt="user" title="Quicktask" className={styles["img-title"]} />
                            <span className={styles["menu-letters"]}>Quicktask</span>
                        </div>
                        <div className={styles["div-menu"]}>
                            <img src={imagenes.user} alt="user" title={userName} className={styles.img} />
                            <span className={styles["menu-letters"]}>{userName}</span>
                        </div>
                        <div className={styles["div-menu"]}>
                            <img src={imagenes.ajustes} alt="user" title="Ajustes" className={styles.img} />
                            <a href="#" className={styles["menu-letters"]}> Ajustes</a>
                        </div>
                        <div className={styles["div-btn-sesion"]}>
                            <button className={styles["menu-btn"]} onClick={cerrarSesion}>
                                <img src={imagenes.cierre} alt="Cerrar sesión" title="Cerrar sesión" className={styles.img} />
                                <span className={styles["menu-letters"]}>Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <TaskModal
                closeModal={closeModal}
                modalOpen={modalOpen}
                taskToEdit={taskToEdit}
                arrayTask={arrayDatos}
                setArrayDatos={setArrayDatos}
                modalReact={modalReact}
                taskToRemove={taskToRemove}
                closeModalR={closeModalR}
            />

            <div className={`row justify-content-center text-center ${styles["container-task"]}`}>

                {arrayDatos.length === 0 ? (
                    <>
                        <div className={`d-flex justify-content-center ${styles["img-fondo"]}`}>
                            {/* <h1>No hay tareas ...</h1> */}
                            <img src={imagenes.quickTask} alt="quickTask" />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Rectángulos de prioridad */}
                        <div className="d-flex align-items-center flex-column flex-lg-row col-12 mb-3">
                            <div className={`d-flex justify-content-center col-lg-6 col-12 ${styles["div-rect"]}`}>
                                <div className="d-flex flex-column flex-lg-row align-items-center m-2">
                                    <div className={styles["div-rect-b"]} />
                                    <p className="mb-0"><strong>Baja</strong></p>
                                </div>

                                <div className="d-flex flex-column flex-lg-row align-items-center m-2">
                                    <div className={styles["div-rect-m"]} />
                                    <p className="mb-0"><strong>Media</strong></p>
                                </div>

                                <div className="d-flex flex-column flex-lg-row align-items-center m-2">
                                    <div className={styles["div-rect-a"]} />
                                    <p className="mb-0"><strong>Alta</strong></p>
                                </div>
                            </div>
                            {/* Filtro */}
                            <div className={`d-flex flex-column flex-lg-row align-items-center justify-content-center col-lg-6 col-12 ${styles["div-filtro"]}`}>
                                <label htmlFor="filtro" className={`d-flex align-items-center justify-content-center form-label col-lg-6 col-12 ${styles["lb-filtro"]}`}><strong>Filtrar por :</strong></label>
                                <select id="filtro" className={`d-flex align-items-center justify-content-center form-select col-lg-6 col-12 ${styles["select-filtro"]}`} value={filtro} onChange={(e) => setFiltro(e.target.value)} >
                                    <option value="default">Ninguno</option>
                                    <option value="prioridad">Prioridad (Alta-Baja)</option>
                                    <option value="fecha">Fecha</option>
                                </select>
                            </div>
                        </div>


                        {/* Task */}
                        {tareasFiltradas.map((dato) => (
                            <div key={dato.id} className={`col-6 col-md-6 col-lg-2 m-1 ${styles.task}`}
                                style={{
                                    backgroundColor: dato.prioridad === "alta" ? "rgba(255, 0, 0, 0.3)" :
                                        dato.prioridad === "media" ? "rgba(255, 255, 0, 0.3)" : "rgba(0, 128, 0, 0.3)"
                                }}>

                                <div className={`col-12 d-flex justify-content-between m-1 fechaHora`}>
                                    <div className="col-6">
                                        <p><strong>Fecha:</strong> {dato.fechaForm}</p>
                                    </div>
                                    <div className="col-6">
                                        <p><strong>Hora: </strong>{dato.horaForm}</p>
                                    </div>
                                </div>

                                <div className="texto">
                                    <p>{dato.texto}</p>
                                </div>

                                <div className={styles["div-img"]}>
                                    <img src={imagenes.lapiz} alt="Editar" title="Editar" onClick={() => openModal(dato)} />
                                    <img src={imagenes.papelera} alt="Eliminar" title="Eliminar" onClick={() => openModalR(dato.id)} />
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

        </div>


    )
}

export default TaskList