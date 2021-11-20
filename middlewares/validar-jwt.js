const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');

const Usuario = require('../models/usuario');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            en: -1,
            m: "No hay token en la peticion"
        });
    }



    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usaurio que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                en: -1,
                m: 'Token no valido'
            });
        }

        // Verificar si el uid tiene estado en true
        if (!usuario.estado) {
            return res.status(401).json({
                en: -1,
                m: 'Token no valido'
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            en: -1,
            m: "Token no valido"
        });
    }
}

module.exports = {
    validarJWT
}