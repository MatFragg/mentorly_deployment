const express = require('express');

const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    // crear vacantes
    router.get('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.agregarVacante);

    // Showing vacant 
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    // Editar vacante  
    router.get('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.formEditarVacante);

    router.post('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.editarVacante);

    // Delete Vacants
    router.delete('/vacantes/eliminar/:id',
        vacantesController.eliminarVacante);

    // Create accounts
    router.get('/crear-cuenta', userController.formCrearCuenta);
    router.post('/crear-cuenta',
        userController.validarRegistro,
        userController.crearCuenta);

    // Authenticate User
    router.get('/iniciar-sesion', userController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    // Close Session
    router.get('/cerrar-sesion',
        authController.verificarUsuario,
        authController.cerrarSesion
    );

    // Reset Password
    router.get('/reestablecer-password',authController.formReestablecerPassword);
    router.post('/reestablecer-password',authController.enviarToken);

    // Reset Password (Store in the DB)
    router.get('/reestablecer-password/:token',
        authController.reestablecerPassword
    );
    router.post('/reestablecer-password/:token',
        authController.guardarPassword
    );
    // Administration Panel
    router.get('/administracion', 
        authController.verificarUsuario,
        authController.mostrarPanel);
        
    // Edit Profile
    router.get('/editar-perfil',
        authController.verificarUsuario,
        userController.formEditarPerfil);

    router.post('/editar-perfil',
        authController.verificarUsuario,
        // userController.validarPerfil,
        userController.subirImagen,
        userController.editarPerfil);

    // Recieve messages from candidates
    router.post('/vacantes/:url',
        vacantesController.subirCV,
        vacantesController.contactar);
    
    // Show Candidates by Vacant
    router.get('/candidatos/:id',
        authController.verificarUsuario,
        vacantesController.mostrarCandidatos);

    // Search Vacants
    router.post('/buscador', vacantesController.buscarVacantes);

    // Health Check
    router.get('/health', (req, res) => {
        res.status(200).json({ status: "OK", message: "Meeti is running!" });
    });
    return router;
}