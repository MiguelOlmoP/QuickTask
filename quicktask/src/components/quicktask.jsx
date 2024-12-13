import "./styles.css";
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
// Imagen
import papelera from '../assets/papelera.png';
import lapiz from '../assets/lapiz.png';
import quickTask from '../assets/quicktask.png';
/*
    Importa la funcion "v4" del paquete "uuid"
    La funcion "v4" genera IDs únicos basados en el estandar UUID
*/
import { v4 as uuidv4 } from 'uuid';
/*
    Libreria de notificaciones
*/
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.module.css"

//import { Link } from 'react-router-dom';

function QuickTask() {

    const [estadoModal, cambiarEstadoModal] = useState(false);

    const [editTask, setEditTask] = useState(null);

    const [fechaSeleccionada, setFecha] = useState(null);
    const [fechaDefault, setFechaDefault] = useState(new Date());

    const [prioridad, setPrioridad] = useState('Baja');

    const [texto, setTexto] = useState("");

    const [arrayDatos, setArrayDatos] = useState([]);

    const imagenes = {
        papelera,
        lapiz,
        quickTask
    }

    const cambiarTexto = (letras) => {
        setTexto(letras.target.value);
    }

    const opciones = [
        { value: 'Baja', label: 'Baja', color: 'rgba(0, 128, 0, 0.3)' },
        { value: 'Media', label: 'Media', color: 'rgba(255, 255, 0, 0.3)' },
        { value: 'Alta', label: 'Alta', color: 'rgba(255, 0, 0, 0.3)' },
    ];


    const customStyles = {
        //Función 'option' que recibe dos parametros
        option: (provided, state) => ({
            ...provided,
            /*
                Establece el color de fondo de la opción. 
                Si la opción está enfocada, se establece en 'lightgrey'; de lo contrario, se toma el 
                color definido en la opción.
            */
            backgroundColor: state.isFocused ? 'lightgrey' : (state.data.color),
            color: state.isSelected ? 'black' : 'black',
        }),
        //Estilos del select
        control: (provided) => ({
            ...provided,
            width: '12vh',
            fontSize: '15px',
            borderRadius: '1vh',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
        }),
    };

    const fechaDefaultFormatted = fechaDefault.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const comparar = (date) => {
        if (date >= fechaDefault) {
            setFecha(date);
        } else {
            toast.error("Por favor, selecciona una fecha futura para continuar", { position: "top-right", autoClose: 3000, });
        }
    }

    const openModal = () => {
        cambiarEstadoModal(true);
        setFechaDefault(new Date());
        setPrioridad("Baja");
    };

    const closeModal = () => {
        cambiarEstadoModal(false);
        setFecha("");
        setTexto("");
        setEditTask(null);
    };

    useEffect(() => {
        let datosTask = JSON.parse(localStorage.getItem("Task")) || [];
        setArrayDatos(datosTask);
    }, []);

    const saveTask = (event) => {
        let datosTask = JSON.parse(localStorage.getItem("Task")) || [];

        if(!(fechaSeleccionada >= fechaDefault)){
            toast.error("Por favor, selecciona una fecha futura para continuar", { position: "top-right", autoClose: 3000, });
        }else if (!texto) {
            toast.error("El texto debe contener al menos un carácter para continuar", { position: "top-right", autoClose: 3000, });
        } else {

            let newTask = {
                fechaEntera: fechaSeleccionada,
                fecha: fechaSeleccionada.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" }),
                hora: fechaSeleccionada.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
                textoTask: texto,
                prioridad: prioridad,
            };

            // Editar tarea existente
            if (event && event.id) {
                // El spread operator (...) copia todas las propiedades del objeto (task) en un nuevo objeto.
                // Se crea un nuevo objeto combinando el contenido de task y newTask
                datosTask = datosTask.map(task => task.id === event.id ?
                    {
                        ...task,
                        ...newTask
                    } : task
                );
                toast.success('La tarea se ha editado con éxito', { position: "top-right", autoClose: 3000 });
                setEditTask(null);
            } else {
                let newTaskConId = { id: uuidv4(), ...newTask };
                datosTask.push(newTaskConId);
                toast.success('La tarea se ha creado con éxito', { position: "top-right", autoClose: 3000 });
            }

            localStorage.setItem('Task', JSON.stringify(datosTask));
            setArrayDatos(datosTask);
            setTimeout(() => {
                closeModal();
            }, 1000);

        }
    }

    const removeTask = (event) => {
        let datosTask = JSON.parse(localStorage.getItem("Task")) || [];
        let newArrayDatos = datosTask.filter((task) => task.id !== event);
        localStorage.setItem('Task', JSON.stringify(newArrayDatos));
        setArrayDatos(newArrayDatos);
        toast.success('La tarea se ha eliminado con éxito', { position: "top-right", autoClose: 3000 });
    }

    const openModalEdit = (event) => {
        cambiarEstadoModal(true);
        setEditTask(event)
        setFecha(new Date(event.fechaEntera));
        setTexto(event.textoTask);
        setPrioridad(event.prioridad);
    }

    const changeStateModal = () => {
        if (editTask && editTask.id) {
            saveTask(editTask);
        } else {
            saveTask(null);
        }
    }

    return (
        <div className={''}>
            <div className="container-fluid d-flex flex-column ">
                <div className={`col-12 text-center`}>
                    <div className="titulo">
                        <h1>QuickTask</h1>
                    </div>
                    <hr />
                    <div className="mt-3">
                        <button type="button" className="btn btn-outline-primary m-1 " onClick={openModal}>Nueva Tarea</button>
                    </div>
                    <div>

                    </div>
                </div>
                <ToastContainer />
                <div className="row justify-content-center mt-4 text-center">
                    {arrayDatos.length === 0 ? (
                        <>
                            <div className="d-flex flex-column align-items-center mt-3">
                               {/* <h1>No hay tareas ...</h1> */}
                                <img  src={imagenes.quickTask} alt="quickTask" />
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
                                        backgroundColor: dato.prioridad === "Alta" ? "rgba(255, 0, 0, 0.3)" :
                                            dato.prioridad === "Media" ? "rgba(255, 255, 0, 0.3)" : "rgba(0, 128, 0, 0.3)"
                                    }}>

                                    <div className={`col-12 d-flex justify-content-between m-1 fechaHora`}>
                                        <div className="col-6">
                                            <p><strong>Fecha:</strong> {dato.fecha}</p>
                                        </div>
                                        <div className="col-6">
                                            <p><strong>Hora: </strong>{dato.hora}</p>
                                        </div>
                                    </div>

                                    <div className="texto">
                                        <p>{dato.textoTask}</p>
                                    </div>

                                    <div className="imagenes">
                                        <img src={imagenes.lapiz} alt="Editar" title="Editar" onClick={() => openModalEdit(dato)}  />
                                        <img src={imagenes.papelera} alt="Eliminar" title="Eliminar"onClick={() =>removeTask(dato.id)} />
                                    </div>

                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {estadoModal && (
                <div className="fondoModal visible" onClick={closeModal}>
                    <div className="divModal" onClick={(e) => e.stopPropagation()}>
                        <form className="contenidoModal">
                            <div className={`container`}>
                                <div className={`row `}>
                                    <div className={`col-12 text-center titulo m-2`}>
                                        <h1>QuickTask</h1>
                                    </div>
                                    <div className="col-6 d-flex justify-content-center align-items-center ">
                                        <div className=" m-1">
                                            <span >Fecha y hora:</span>
                                        </div>
                                        <DatePicker className="inputData" showTimeSelect timeFormat="HH:mm"
                                            dateFormat="dd/MM/yyyy HH:mm" timeIntervals={1} selected={fechaSeleccionada} onChange={comparar}
                                            placeholderText={fechaDefaultFormatted} />

                                    </div>

                                    <div className="col-6 d-flex justify-content-center align-items-center  ">
                                        <div className=" m-1 ">
                                            <label id="prioridad" className="prioridad">Prioridad:</label>
                                        </div>
                                        <Select

                                            options={opciones}
                                            value={opciones.find(option => option.value === prioridad)}
                                            styles={customStyles}
                                            onChange={(selectedOption) => setPrioridad(selectedOption.value)}
                                        />
                                    </div>

                                    <div className="form-group col-12 d-flex justify-content-center ">
                                        <textarea id="inputText" maxLength={500} className={`form-control inputTex`}
                                            placeholder="Texto de ejemplo..." value={texto} onChange={cambiarTexto}></textarea>
                                    </div>

                                </div>

                            </div>
                            <div className="d-flex justify-content-center col-12 text-center ">
                                <button type="button" className="btn btn-outline-secondary m-1" onClick={closeModal}> Cerrar </button>
                                <button type="button" className="btn btn-outline-primary m-1 " onClick={changeStateModal}> Guardar </button>


                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>





    );
}

export default QuickTask;