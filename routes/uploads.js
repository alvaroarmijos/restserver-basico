const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, mostrarImagen, actualizarImagenClodinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const { validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();


router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', "No es un ID válido").isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenClodinary);

router.get('/:coleccion/:id', [
    check('id', "No es un ID válido").isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

module.exports = router;