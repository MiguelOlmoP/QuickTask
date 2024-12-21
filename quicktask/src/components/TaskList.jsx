import React, { useEffect, useState } from 'react'
import TaskModal from './TaskModal';

// Imagenes
import papelera from '../assets/papelera.png';
import lapiz from '../assets/lapiz.png';
import quickTask from '../assets/quicktask.png';

function TaskList() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalReact, setModalReact] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskToRemove, setTaskToRemove] = useState(null);
    const [arrayDatos, setArrayDatos] = useState([]);

    const imagenes = {
        papelera,
        lapiz,
        quickTask
    }

    useEffect(() => {
        let datosTask = JSON.parse(localStorage.getItem("Task")) || [];
        setArrayDatos(datosTask);
    }, []);

    

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
    
    return (
        <div className={'container-fluid'}>
            <div className="container-fluid d-flex flex-column " >
                <div className={`col-12 text-center`}>
                    <div className="titulo">
                        <h1 translate='no'>QuickTask</h1>
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