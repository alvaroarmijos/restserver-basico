
const path = require('path');
const fs = require('fs');

const { response } = require("express");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);


const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models')




const cargarArchivo = async (req, res = response) => {

    try {

        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({
            en: 1,
            nombre
        });

    } catch (error) {
        res.status(400).json({
            en: -1,
            m: error
        });
    }

}


const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    en: -1,
                    m: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    en: -1,
                    m: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ en: -1, m: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        //Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = nombre;

    await modelo.save();

    res.json({
        en: 1,
        modelo
    });


}

const actualizarImagenClodinary = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    en: -1,
                    m: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    en: -1,
                    m: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ en: -1, m: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        //Hay que borrar la imagen de cloudinary
        const nombreAr = modelo.img.split('/');
        const nombre = nombreAr[nombreAr.length - 1];
        const [public_id] = nombre.split('.');

        cloudinary.uploader.destroy(public_id);

    }

    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;

    await modelo.save();

    res.json({
        en: 1,
        modelo
    });


}

const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    en: -1,
                    m: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    en: -1,
                    m: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ en: -1, m: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        //Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.png');
    res.sendFile(pathImagen);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenClodinary
}