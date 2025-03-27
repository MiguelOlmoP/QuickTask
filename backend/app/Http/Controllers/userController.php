<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use App\Models\User;
use Illuminate\Support\Facades\Hash;

use Tymon\JWTAuth\Facades\JWTAuth;

use Google_Client;

use Brevo\Client\Configuration;
use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Model\SendSmtpEmail;
use GuzzleHttp\Client;

use Illuminate\Support\Facades\Log;

class userController extends Controller
{

    /**
     * Crea un nuevo usuario en la base de datos y genera un token de autenticación.
     *
     * Recibe los datos del usuario a través de la solicitud HTTP, verifica si el correo electrónico ya está 
     * registrado y, si no existe, crea un nuevo usuario en la base de datos. 
     * Luego, genera un token de autenticación para el usuario recién creado y lo devuelve en la respuesta.
     * Además, envía un correo de bienvenida al usuario.
     *
     * @param \Illuminate\Http\Request $request Solicitud HTTP con los datos del nuevo usuario.
     * @return \Illuminate\Http\JsonResponse Respuesta en formato JSON con el estado de la operación, 
     *         un mensaje descriptivo y el token de autenticación del nuevo usuario (si se creó correctamente).
     */
    public function newUser(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:7',
            'password2' => 'required|min:7|same:password'
        ]);

        $existe = User::where('email', $request->email)->exists();

        if (!$existe) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' =>  bcrypt($request->password),
            ]);

            if ($user) {
                $token = JWTAuth::fromUser($user);
                $status = true;
                $mensaje = "El usuario se ha creado.";

                userController::sendEmail($request->name, $request->email);
            }
        } else {
            $status = false;
            $mensaje = "La dirección de correo ya está asociada a otra cuenta de usuario.";
        }

        return response()->json([
            'status' => $status,
            'msg' => $mensaje,
            'token' => $token ?? null
        ]);
    }



    /**
     * Inicia sesión de un usuario con su correo electrónico y contraseña.
     *
     * Busca un usuario en la base de datos utilizando el correo electrónico proporcionado
     * en la solicitud. Si el usuario existe y la contraseña proporcionada coincide con la
     * almacenada en la base de datos, se genera un token de autenticación.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP que contiene el correo electrónico
     *                                           y la contraseña del usuario.
     * @return \Illuminate\Http\JsonResponse Respuesta en formato JSON con el estado de la operación,
     *          un mensaje descriptivo, el nombre del usuario (si el inicio de sesión es exitoso) y el token de autenticación.
     */
    public function userLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:7'
        ]);

        $user = User::where('email', $request->email)->first();

        $existe = false;
        $mensaje = "Usuario o contraseña incorrectos.";

        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $existe = true;
                $mensaje = "Has iniciado sesion correctamente.";
                $token = JWTAuth::fromUser($user);
            } else {
                $mensaje = "El gmail y la contraseña no coinciden";
            }
        }

        return response()->json([
            'status' => $existe,
            'msg' => $mensaje,
            'token' => $token ?? null
        ]);
    }


    /**
     * Cierra la sesión del usuario.
     *
     * Elimina el token de autenticación del usuario, lo que efectivamente cierra su sesión. 
     * Se restablece el estado de la sesión y se retorna un mensaje indicando si la operación fue exitosa.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP que contiene los datos del usuario.
     * @return \Illuminate\Http\JsonResponse Respuesta en formato JSON con el estado de la operación y un mensaje.
     */
    public function userLogout(Request $request)
    {
        try {

            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                $status = "false";
                $msg = "No se ha podido cerrar la sesión";
            } else {
                $status = "true";
                $msg = "Has cerrado la sesión";
            }
        } catch (\Throwable $th) {
            $status = false;
            $msg = 'No se pudo cerrar la sesión' . $th->getMessage();
        }

        return response()->json([
            'status' => $status,
            'msg' => $msg
        ]);
    }

    /**
     * Obtiene el usuario autenticado a partir del token JWT.
     *
     * Esta función extrae el token JWT de la solicitud, lo valida y recupera
     * la información del usuario autenticado. Si el token es inválido o ha expirado,
     * se retornará un mensaje de error.
     *
     * @param \Illuminate\Http\Request $request La solicitud HTTP que contiene el token JWT.
     * @return \Illuminate\Http\JsonResponse Respuesta en formato JSON con el nombre del usuario
     *         si está autenticado, o un mensaje de error si no lo está.
     */
    public function session()
    {
        try {

            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                $status = "false";
                $name = "";
            } else {
                $status = "true";
                $name =  $user->name;
            }
        } catch (\Throwable $th) {
            $status = false;
            $name = "";
            //$msg = 'Error al obtener el usuario: ' . $th->getMessage();
        }

        return response()->json([
            'status' => $status,
            'userName' => $name,
        ]);
    }

    /**
     * Inicia sesión con Google o crea un nuevo usuario si no existe y envía un correo de bienvenida.
     *
     * Este método recibe un token de Google desde el frontend (React) y verifica su validez utilizando la API de Google. 
     * Si el token es válido, se obtiene la información del usuario y se busca si ya existe en la base de datos. 
     * Si el usuario no existe, se crea uno nuevo con la información obtenida de Google. 
     * Luego, se genera un token JWT para autenticar al usuario y se envía un correo de bienvenida si es un usuario nuevo.
     *
     * @param Request $request La solicitud que contiene el token de Google.
     * @return \Illuminate\Http\JsonResponse Respuesta JSON que indica si el inicio de sesión fue exitoso y el token generado.
     */
    public function loginGoogle(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required|string'
            ]);

            $googleToken = $request->input('token');

            $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
            $user = $client->verifyIdToken($googleToken);

            $existe = false;
            $mensaje = 'No se pudo iniciar sesion con Google';

            if ($user) {
                // Token válido, obtenemos la información del usuario
                $googleId = $user['sub'];
                $name = $user['name'];
                $email = $user['email'];

                // Buscar si el usuario ya existe en la base de datos
                $existingUser = User::where('google_id', $googleId)->first();

                if (!$existingUser) {
                    // Si no existe, creamos un nuevo usuario
                    $existingUser = User::create([
                        'name' => $name,
                        'email' => $email,
                        'google_id' => $googleId,
                    ]);

                    userController::sendEmail($name, $email);
                }

                $token = JWTAuth::fromUser($existingUser);

                $existe = true;
                $mensaje = 'Se inicio sesion con Google';
            }
        } catch (\Exception $e) {
            $existe = false;
            $mensaje = 'No se pudo iniciar sesion con Google ' . $e->getMessage();
        }

        return response()->json([
            'status' => $existe,
            'msg' => $mensaje,
            'token' => $token ?? null
        ]);
    }

    /**
     * Envia un correo electrónico de bienvenida al usuario.
     *
     * Esta función utiliza la API de Brevo para enviar un correo
     * de bienvenida personalizado al usuario que se ha registrado en la plataforma.
     *
     * @param string $name Nombre del usuario al que se enviará el correo.
     * @param string $email Correo electrónico del usuario al que se enviará el correo.
     */
    public function sendEmail($name, $email)
    {
        try {
            $config = Configuration::getDefaultConfiguration()->setApiKey('api-key', env('BREVO_API_KEY'));
            $apiInstance = new TransactionalEmailsApi(new Client(), $config);

            // Crear el correo
            $sendSmtpEmail = new SendSmtpEmail([
                'subject' => 'Quicktask | Bienvenid@ QuickTask',
                'sender' => ['name' => 'QuickTask', 'email' => 'quicktask.contact@gmail.com'],
                'to' => [['name' => $name, 'email' => $email]],
                'htmlContent' => '<html>                                    
                        <body>
                            <h1>¡Bienvenid@, ' . $name . '!</h1>
                            <p>Bienvenid@ a <strong>QuickTask</strong>, tu asistente ideal para organizar y gestionar tareas de manera eficiente.</p>
                            <p>¡Empieza ahora y aumenta tu productividad!</p>
                        </body>
                    </html>',
            ]);

            $apiInstance->sendTransacEmail($sendSmtpEmail);
        } catch (\Exception $e) {
            Log::error("Error al enviar email de bienvenida: " . $e->getMessage());
        }
    }


    
}
