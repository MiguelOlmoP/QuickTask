<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Session;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

use Tymon\JWTAuth\Facades\JWTAuth;


class userController extends Controller
{

    /**
     * Crea un nuevo usuario en la base de datos.
     *
     * Recibe los datos del nuevo usuario a través de la solicitud, crea un nuevo registro en la base de datos.
     * También genera un token de autenticación para el nuevo usuario y lo devuelve en la respuesta.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP que contiene los datos del nuevo usuario.
     * @return \Illuminate\Http\JsonResponse Respuesta en formato JSON con el estado de la operación,
     *      un mensaje descriptivo y el token de autenticación del nuevo usuario.
     */
    public function newUser(Request $request)
    {
        $existe = false;
        $mensaje = "El usuario no se ha podido crear.";

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' =>  bcrypt($request->password),
        ]);

        if ($user) {
            $token = JWTAuth::fromUser($user);
            $existe = true;
            $mensaje = "El usuario se ha creado.";
        }
        return response()->json([
            'status' => $existe,
            'msg' => $mensaje,
            'token' => $token
        ]);
    }



    /**
     * Inicia sesión de un usuario con su correo electrónico y contraseña.
     *
     * Busca un usuario en la base de datos utilizando el correo electrónico proporcionado
     * en la solicitud. Si el usuario existe y la contraseña proporcionada coincide con la
     * almacenada en la base de datos, se genera un token de autenticación. Además, se
     * guardan los datos del usuario en la sesión para su posterior uso.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP que contiene el correo electrónico
     *                                           y la contraseña del usuario.
     * @return \Illuminate\Http\JsonResponse Respuesta en formato JSON con el estado de la operación,
     *          un mensaje descriptivo, el nombre del usuario (si el inicio de sesión es exitoso) y el token de autenticación.
     */
    public function userLogin(Request $request)
    {

        $user = User::where('email', $request->email)->first();

        $existe = false;
        $mensaje = "Usuario o contraseña incorrectos.";

        $token = null;

        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $existe = true;
                $mensaje = "Has iniciado sesion correctamente.";

                //Guardar datos de sesión
                $request->session()->put('user_id', $user->id);
                $request->session()->put('user_name', $user->name);

                $token = JWTAuth::fromUser($user);
            }
        }

        return response()->json([
            'status' => $existe,
            'msg' => $mensaje,
            'user_name' => $existe ? $user->name : null,
            'token' => $token
        ]);
    }


    /**
     * Cierra la sesión del usuario.
     *
     * Elimina toda la información almacenada en la sesión actual del usuario, 
     * lo que efectivamente cierra su sesión. El estado de la sesión se restablece
     * y se retorna un mensaje indicando que la sesión se ha cerrado exitosamente.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP que contiene los datos de la sesión.
     * @return \Illuminate\Http\JsonResponse Respuesta en formato JSON con el estado de la operación y un mensaje.
     */
    public function userLogout(Request $request)
    {

        //Elimina toda la informacion de la sesión
        $request->session()->flush();

        return response()->json([
            'status' => true,
            'msg' => 'Has cerrado la sessión'
        ]);
    }


    /**
     * Verifica si el usuario está autenticado basándose en los datos de la sesión.
     *
     * Esta función comprueba si el identificador del usuario existe en la sesión. Si es así,
     * devuelve el estado de autenticación y el nombre del usuario. En caso contrario, indica
     * que el usuario no está autenticado.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP que contiene los datos de la sesión.
     * @return \Illuminate\Http\JsonResponse Respuesta en formato JSON con el estado de autenticación
     *         y el nombre del usuario (si está autenticado).
     */
    public function session(Request $request){
        
        $authenticated = $request->session()->has('user_id');
        $userName = $authenticated ? $request->session()->get('user_name') : null;

        return response()->json([
            'authenticated' => $authenticated,
            'user' => $userName
        ]);
    }
}
