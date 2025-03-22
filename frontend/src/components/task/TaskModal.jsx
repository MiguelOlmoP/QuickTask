import styles from "./styles/Modal.module.css"
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

/*
    Notificaciones emergentes para mostrar mensajes en la interfaz de usuario de forma sencilla.
*/
import { toast } from "react-toastify";
/*
    Componentes de interfaz de usuario predefinidos, como modales y botones, basados en Bootstrap 
    para facilitar la construcción de interfaces con React.
*/
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.module.css"

import Cookies from 'js-cookie';

import axios from 'axios';

import { BASE_URL } from '../../config';


function QuickTask({ closeModal, modalOpen, taskToEdit, arrayTask, setArrayDatos, modalReact, taskToRemove, closeModalR }) {

    const [fechaSeleccionada, setFecha] = useState(null);
    const [fechaDefault] = useState(new Date());

    const [prioridad, setPrioridad] = useState('baja');

    const [texto, setTexto] = useState("");

    const cambiarTexto = (letras) => {
        setTexto(letras.target.value);
    }

    const opciones = [
        { value: 'baja', label: 'Baja', color: 'rgba(0, 128, 0, 0.3)' },
        { value: 'media', label: 'Media', color: 'rgba(255, 255, 0, 0.3)' },
        { value: 'alta', label: 'Alta', color: 'rgba(255, 0, 0, 0.3)' },
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

    useEffect(() => {
        if (taskToEdit) {
            // Cargar los datos de la tarea en los campos
            setTexto(taskToEdit.texto);
            setFecha(new Date(taskToEdit.fecha));
            setPrioridad(taskToEdit.prioridad);
        } else {
            setFecha("");
            setTexto("");
            setPrioridad("baja");
        }

    }, [taskToEdit]);

    useEffect(() => {
        if (!modalOpen) {
            setFecha("");
            setTexto("");
            setPrioridad("baja");
        }
    }, [modalOpen])

    const formatTask = (task) => {
        const [date, time] = task.fecha.split(' ');
        return {
            ...task,
            fechaForm: date,
            horaForm: time.slice(0, 5),
        };
    };

    const saveTask = async (event) => {
        if (!(fechaSeleccionada >= fechaDefault)) {
            toast.error("Por favor, selecciona una fecha futura para continuar", { position: "top-right", autoClose: 3000, });
        } else if (!texto) {
            toast.error("El texto debe contener al menos un carácter para continuar", { position: "top-right", autoClose: 3000, });
        } else {
            const token = Cookies.get('auth_token');
            if (!token) {
                console.error('No se encontró el token de autenticación.');
                return;
            }
            // Editar tarea existente           
            if (event && event.id) {
                try {
                    const response = await axios.post(`${BASE_URL}editTask`, {
                        'fecha': fechaSeleccionada.toLocaleString('sv-SE'),
                        'prioridad': prioridad,
                        'texto': texto,
                        'id': event.id
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (response.data.status) {
                        toast.success(response.data.msg, { position: "top-right", autoClose: 3000 });
                        const formattedTask = formatTask(response.data.task);

                        setArrayDatos(arrayDatosViejo =>
                            arrayDatosViejo.map(task =>
                                task.id === formattedTask.id ? formattedTask : task
                            ));
                    } else {
                        toast.error(response.data.msg, { position: "top-right", autoClose: 3000, });
                    }
                    console.log('Se ha editado la tarea:', response.data);
                } catch (error) {
                    console.error('Error al editar la tarea:', error);
                }

            } else {
                //Tarea nueva
                try {
                    const response = await axios.post(`${BASE_URL}newTask`, {
                        'fecha': fechaSeleccionada.toLocaleString('sv-SE'),
                        'prioridad': prioridad,
                        'texto': texto
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.data.status) {
                        toast.success(response.data.msg, { position: "top-right", autoClose: 3000 });

                        const formattedTask = formatTask(response.data.task);
                        setArrayDatos(arrayDatosViejo => [...arrayDatosViejo, formattedTask]);
                    } else {
                        toast.error(response.data.msg, { position: "top-right", autoClose: 3000, });
                    }

                    console.log('Se ha creado la tarea:', response.data);
                } catch (error) {
                    console.error('Error al crear la tarea:', error);
                }
            }
            setTimeout(() => {
                closeModal();
            }, 1000);
        }
    }

    const changeStateModal = () => {
        if (taskToEdit && taskToEdit.id) {
            saveTask(taskToEdit);
        } else {
            saveTask(null);
        }
    }

    const removeTask = async (event) => {

        try {
            const token = Cookies.get('auth_token');

            if (!token) {
                console.error('No se encontró el token de autenticación.');
                return;
            }
            const response = await axios.delete(`${BASE_URL}delete/${event}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.status) {
                toast.success(response.data.msg, { position: "top-right", autoClose: 3000 });
            } else {
                toast.error(response.data.msg, { position: "top-right", autoClose: 3000, });
            }

            console.log('Tarea eliminada:', response.data);
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
        }
        let newArrayDatos = arrayTask.filter((task) => task.id !== event);
        setArrayDatos(newArrayDatos);
        setTimeout(() => {
            closeModalR();
        }, 1000);
    }

    return (
        <>
            {/* Modal eliminación  React-Boostrap*/}
            {modalReact && (
                <Modal show={modalReact} onHide={closeModalR}>
                    <Modal.Header closeButton>
                        <Modal.Title>¿Eliminar Tarea?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Estás seguro de que deseas eliminar esta tarea?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModalR}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={() => { removeTask(taskToRemove) }}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Formulario de edición o creación de tarea */}
            {modalOpen && (
                <div className={styles.container} onClick={closeModal} >
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <form className={styles.form}>
                            <div className={`container`}>
                                <div className={`row `}>
                                    <div className={`col-12 text-center  ${styles["div-title"]}`}>
                                        <span className={styles["shiny-text"]}>QuickTask</span>
                                    </div>
                                    <div className={`d-flex flex-column flex-lg-row justify-content-center align-items-center col-12 ${styles["div-data-text"]} `}>
                                        <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center col-6 ">
                                            <div className=" m-1 ">
                                                <span >Fecha y hora:</span>
                                            </div>
                                            <DatePicker className={styles.data} showTimeSelect timeFormat="HH:mm"
                                                dateFormat="dd/MM/yyyy HH:mm" timeIntervals={1} selected={fechaSeleccionada} onChange={comparar}
                                                placeholderText={fechaDefaultFormatted} />
                                        </div>

                                        <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center col-6  mt-2">
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
                                    </div>

                                    <div className="form-group col-12 d-flex justify-content-center ">
                                        <textarea id="inputText" maxLength={500} className={`form-control ${styles.text}`}
                                            placeholder="Texto de ejemplo..." value={texto} onChange={cambiarTexto}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className={`d-flex justify-content-center col-12 text-center ${styles["div-btn"]}`}>
                                <button type="button" className={`m-2 ${styles["btn-close"]}`} onClick={closeModal}> Cerrar </button>
                                <button type="button" className={`m-2 ${styles["btn-save"]}`} onClick={changeStateModal}> Guardar </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </>
    );
}

export default QuickTask;