import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
/*
    Importa la funcion "v4" del paquete "uuid"
    La funcion "v4" genera IDs únicos basados en el estandar UUID
*/
import { v4 as uuidv4 } from 'uuid';
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


function QuickTask({ closeModal, modalOpen, taskToEdit, arrayTask, setArrayDatos, modalReact, taskToRemove, closeModalR }) {

    const [fechaSeleccionada, setFecha] = useState(null);
    const [fechaDefault] = useState(new Date());

    const [prioridad, setPrioridad] = useState('Baja');

    const [texto, setTexto] = useState("");

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

    useEffect(() => {
        if (taskToEdit) {
            // Cargar los datos de la tarea en los campos
            setTexto(taskToEdit.textoTask);
            setFecha(new Date(taskToEdit.fechaEntera));
            setPrioridad(taskToEdit.prioridad);
        } else {
            setFecha("");
            setTexto("");
            setPrioridad("Baja");
        }

    }, [taskToEdit]);

    useEffect(() => {
        if (!modalOpen) {
            setFecha("");
            setTexto("");
            setPrioridad("Baja");
        }
    }, [modalOpen])

    const saveTask = (event) => {
        if (!(fechaSeleccionada >= fechaDefault)) {
            toast.error("Por favor, selecciona una fecha futura para continuar", { position: "top-right", autoClose: 3000, });
        } else if (!texto) {
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
                arrayTask = arrayTask.map(task => task.id === event.id ?
                    {
                        ...task,
                        ...newTask
                    } : task
                );
                toast.success('La tarea se ha editado con éxito', { position: "top-right", autoClose: 3000 });
            } else {
                let newTaskConId = { id: uuidv4(), ...newTask };
                arrayTask.push(newTaskConId);
                toast.success('La tarea se ha creado con éxito', { position: "top-right", autoClose: 3000 });
            }

            setArrayDatos(arrayTask);
            localStorage.setItem('Task', JSON.stringify(arrayTask));
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

    const removeTask = (event) => {
        let newArrayDatos = arrayTask.filter((task) => task.id !== event);
        localStorage.setItem('Task', JSON.stringify(newArrayDatos));
        setArrayDatos(newArrayDatos);
        toast.success('La tarea se ha eliminado con éxito', { position: "top-right", autoClose: 3000 });
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
                <div className="fondoModal visible" onClick={closeModal} >
                    <div className="divModal" onClick={(e) => e.stopPropagation()}>
                        <form className="contenidoModal">
                            <div className={`container`}>
                                <div className={`row `}>
                                    <div className={`col-12 text-center titulo m-2`}>
                                        <h1 translate='no'>QuickTask</h1>
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

        </>
    );
}

export default QuickTask;