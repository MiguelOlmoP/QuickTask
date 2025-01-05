<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Session\Middleware\StartSession;

// Controllers 
use App\Http\Controllers\taskController;
use App\Http\Controllers\userController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/registro', [userController::class, 'newUser']);

// Rutas que requieren iniciar sesión (usando sesión estándar, no JWT)
Route::middleware([StartSession::class])->group(function () {
    Route::post('/login', [userController::class, 'userLogin']);
    Route::post('/logout', [userController::class, 'userLogout']);
    Route::get('/session', [userController::class, 'session']);
});

// Rutas protegidas con JWT, el middleware 'jwt.auth' asegura que solo los usuarios autenticados puedan acceder
Route::middleware('jwt.auth')->group(function () {
    Route::delete('/delete/{id_task}', [taskController::class, 'delete']);
    Route::get('/taskList', [taskController::class, 'list']);
    Route::post('/newTask', [taskController::class, 'newTask']);
    Route::post('/editTask', [taskController::class, 'editTask']);
});