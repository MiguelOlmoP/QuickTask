<?php

use Illuminate\Support\Facades\Route;

// Controllers 
use App\Http\Controllers\taskController;
use App\Http\Controllers\userController;


Route::post('/registro', [userController::class, 'newUser']);
Route::post('/login', [userController::class, 'userLogin']);
Route::post('/loginGoogle', [userController::class, 'loginGoogle']);
Route::get('/session', [userController::class, 'session']);   
    

// Rutas protegidas con JWT, el middleware 'jwt.auth' asegura que solo los usuarios autenticados puedan acceder
Route::middleware('jwt.auth')->group(function () {
    Route::post('/logout', [userController::class, 'userLogout']);

    Route::delete('/delete/{id_task}', [taskController::class, 'delete']);
    Route::get('/taskList', [taskController::class, 'list']);
    Route::post('/newTask', [taskController::class, 'newTask']);
    Route::post('/editTask', [taskController::class, 'editTask']);
});
