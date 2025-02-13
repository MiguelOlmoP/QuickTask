import React, { useEffect, useState } from 'react'
import TaskModal from './TaskModal';
import { toast } from "react-toastify";

import Cookies from 'js-cookie';


// Imagenes
import papelera from '../../assets/papelera.png';
import lapiz from '../../assets/lapiz.png';
import quickTask from '../../assets/quickTask.png';
import user from '../../assets/user.png';

import { useNavigate } from "react-router-dom";

import axios from 'axios';

import { BASE_URL } from '../../config';


function TaskList({ setIsAuthenticated , userName}) {

    const [error, setError] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalReact, setModalReact] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskToRemove, setTaskToRemove] = useState(null);
    const [arrayDatos, setArrayDatos] = useState([]);

    const imagenes = {
        papelera,
        lapiz,
        quickTask,
        user
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
            const response = await axios.post(`${BASE_URL}logout`,{}, {
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

    return (
        <div className={'container-fluid'}>
            <div className="container-fluid d-flex flex-column " >
                <div className={`col-12 text-center`}>
                    <div className="titulo">
                        <h1 translate='no'>QuickTask</h1>
                        <div className="cerrarSesion">
                            <div className="btn-group">
                                <button className="btn dropdown-toggle custom-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src={imagenes.user} alt="user" className="user-img" />
                                    {userName}
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className="dropdown-item" onClick={cerrarSesion}>Cerrar sesión</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr />
                    <div className="mt-3">
                        <button type="button" className="btn btn-outline-primary m-1 " onClick={() => openModal()}>Nueva Tarea</button>
                    </div>

                </div>
            </div>

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

            <div className="row justify-content-center mt-4 text-center">

                {arrayDatos.length === 0 ? (
                    <>
                        <div className="d-flex flex-column align-items-center">
                            {/* <h1>No hay tareas ...</h1> */}
                            <img src={imagenes.quickTask} alt="quickTask" />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Mostrar los rectángulos de prioridad arriba */}
                        <div className="d-flex col-10 mb-3">
                            <div className="d-flex align-items-center me-3">
                                <div className="rectB" />
                                <p className="mb-0"><strong>Baja</strong></p>
                            </div>

                            <div className="d-flex align-items-center me-3">
                                <div className="rectM" />
                                <p className="mb-0"><strong>Media</strong></p>
                            </div>

                            <div className="d-flex align-items-center me-3">
                                <div className="rectA" />
                                <p className="mb-0"><strong>Alta</strong></p>
                            </div>
                        </div>

                        {arrayDatos.map((dato) => (
                            <div key={dato.id} className={`col-10 col-md-5 col-lg-2 m-1 tarea`}
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

                                <div className="imagenes">
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