const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            en: 1,
            results: (usuario) ? [usuario] : []
        });
    }

    //se crea el la expresion regular, insensible a mayusculas o minusculas

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        en: 1,
        results: usuarios
    });
}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            en: 1,
            results: (categoria) ? [categoria] : []
        });
    }

    //se crea el la expresion regular, insensible a mayusculas o minusculas

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({
        nombre: regex, estado: true
    });

    res.json({
        en: 1,
        results: categorias
    });
}

const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            en: 1,
            results: (producto) ? [producto] : []
        });
    }

    //se crea el la expresion regular, insensible a mayusculas o minusculas
    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({
        nombre: regex, estado: true
    }).populate('categoria', 'nombre');

    res.json({
        en: 1,
        results: productos
    });
}



const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            en: -1,
            m: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;

        default:
            res.status(500).json({
                en: -1,
                m: 'Búsqueda no implementada'
            });
            break;
    }


}

module.exports = {
    buscar
}