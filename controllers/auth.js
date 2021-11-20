const { response } = require("express");
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");



const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                en: -1,
                m: 'Usuario o Contraseña no son correctos'
            });
        }

        //Verificar si el usuario esta activo,

        if (!usuario.estado) {
            return res.status(400).json({
                en: -1,
                m: 'Usuario bloqueado'
            });
        }

        //Verificar clave
        const validPasswword = bcryptjs.compareSync(password, usuario.password);
        if (!validPasswword) {
            return res.status(400).json({
                en: -1,
                m: 'Usuario o Contraseña no son correctos'
            });
        }


        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            en: 1,
            m: "Login ok",
            usuario,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            en: -1,
            m: 'Hable con el administrador'
        });
    }
}

module.exports = {
    login,
}