import './App.css';
import "./components/styles.css";
import Modal from './components/TaskModal';
import TaskList from './components/TaskList';
/*
    Libreria de notificaciones
*/
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/*
    Libreria de react-bootstrap

import 'bootstrap/dist/css/bootstrap.min.css';

*/



function App() {
  return (
    <>
      <ToastContainer />      
      <TaskList />
      <Modal />
    </>
  );
}

export default App
