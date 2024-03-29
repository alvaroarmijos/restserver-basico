const { response } = require("express");
const { Categoria } = require('../models');


const obtenerCategorias = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        en: 1,
        total,
        categorias
    });

}

const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    if (!categoria.estado) {
        return res.status(401).json({
            en: -1,
            m: 'Categoria deshabilitada'
        });
    }

    res.json({
        en: 1,
        categoria
    });

}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    //si la categoria existe, se envia el error
    if (categoriaDB) {
        return res.status(400).json({
            en: -1,
            m: 'La categoria ya existe'
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar DB
    await categoria.save();

    res.status(201).json({
        en: 1,
        m: "Categoria creada correctamente",
        categoria
    })
}


const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json({
        en: 1,
        categoria
    });
}


const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        en: 1,
        categoria: categoriaBorrada
    });

}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}

