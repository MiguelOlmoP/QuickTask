<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Task;

use Tymon\JWTAuth\Facades\JWTAuth;

use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Log;




class taskController extends Controller
{
    /**
     * Lista todas las tareas del usuario autenticado.
     *
     * Obtiene las tareas desde la base de datos que pertenecen al usuario 
     * actualmente autenticado y las devuelve en formato JSON.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function list()
    {

        $userId = Auth::id();

        $tasks = Task::where('user_id', $userId)->get();

        return response()->json($tasks);
    }


    /**
     * Elimina la tarea seleccionada de la base de datos
     * 
     * Verifica la existencia del token de autorización en la cabecera,
     * autentica al usuario mediante JWT y elimina la tarea que pertenece
     * al usuario autenticado. Si ocurre algún error, devuelve una respuesta
     * con el mensaje correspondiente.
     * 
     * @param \Illuminate\Http\Request $request La solicitud HTTP recibida.
     * @param int $id_task ID de la tarea a eliminar.
     * @return \Illuminate\HTTP\JsonResponse 
     */
    public function delete(Request $request, $id_task)
    {
        $status = false;
        $msg = 'Error desconocido';
        try {
            // Verificar si la solicitud tiene el encabezado Authorization
            if (!$request->hasHeader('Authorization')) {
                $msg = 'No se encontró el encabezado Authorization';
            } else {
                $token = JWTAuth::getToken();
                if (!$token) {
                    $msg = 'Token no proporcionado o inválido';
                } else {
                    $user = JWTAuth::parseToken()->authenticate();
                    if (!$user) {
                        $msg = 'No se encontró el usuario autenticado';
                    } else {
                        $task = Task::where('user_id', $user->id)->findOrFail($id_task);

                        $task->delete();

                        $status = true;
                        $msg = 'La tarea se ha eliminado correctamente';
                    }
                }
            }
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            $msg = 'Error al eliminar la tarea: ' . $e->getMessage();
        }

        return response()->json([
            'status' => $status,
            'msg' => $msg
        ]);
    }


    /**
     * Crea una nueva tarea para el usuario autenticado.
     *
     * Verifica el token de autenticación y, si es válido, guarda la nueva tarea
     * en la base de datos. Retorna el estado de la operación y la tarea creada.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP recibida.
     * @return \Illuminate\Http\JsonResponse Respuesta en formato JSON con el estado de la operación.
     */
    public function newTask(Request $request)
    {
        // Obtener el ID del usuario autenticado
        $userId = Auth::id();

        $existe = false;
        $mensaje = "No se ha podido crear la tarea.";

        $task = Task::create([
            'fecha' => $request->fecha,
            'prioridad' => $request->prioridad,
            'texto' => $request->texto,
            'user_id' =>  $userId
        ]);

        if ($task) {
            $existe = true;
            $mensaje = "Se ha creado la tarea.";
        }

        return response()->json([
            'status' => $existe,
            'msg' => $mensaje,
            'task' => $task
        ]);
    }



    /**
     * Edita una tarea del usuario autenticado.
     *
     * Busca la tarea que coincida con el ID proporcionado en la solicitud y
     * que pertenezca al usuario autenticado. Si la tarea existe, actualiza
     * sus datos con los valores proporcionados en la solicitud.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP que contiene los nuevos datos de la tarea.
     * @return \Illuminate\Http\JsonResponse Respuesta en formato JSON con el estado de la operación,
     *      un mensaje descriptivo y la tarea editada.
     */
    public function editTask(Request $request)
    {

        $userId = Auth::id();

        $existe = false;
        $mensaje = "No se ha podido editar la tarea.";

        $task = Task::where('id', $request->id)->where('user_id', $userId)->first();

        if ($task) {

            $task->update([
                'fecha' => $request->fecha,
                'prioridad' => $request->prioridad,
                'texto' => $request->texto,
                'user_id' => $userId
            ]);

            $existe = true;
            $mensaje = "Se ha editado la tarea.";
        }

        return response()->json([
            'status' => $existe,
            'msg' => $mensaje,
            'task' => $task
        ]);
    }
}
