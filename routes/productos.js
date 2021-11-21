const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');

const { existeCategoriaPorID, existeProductoPorID } = require('../helpers/db-validators');

const router = Router();

// {{url}}/api/productos

// Obtener todas los productos - publico
router.get('/', obtenerProductos);

// Obtener un prodcuto por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorID),
    validarCampos
], obtenerProducto);


// Crear producto - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es una categoria válida').isMongoId(),
    check('categoria').custom(existeCategoriaPorID),
    validarCampos
], crearProducto);

//Actualizar - pprivado, cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorID),
    validarCampos
], actualizarProducto);

// Borrar producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorID),
    validarCampos
], borrarProducto)


module.exports = router;