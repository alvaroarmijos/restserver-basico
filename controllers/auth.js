const { response } = require("express");
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");



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

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //Hay que crear el usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                en: -1,
                m: 'Usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            en: 1,
            m: "login correcto",
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            en: -1,
            m: 'El token no se pudo verificar'
        });

    }



}

module.exports = {
    login,
    googleSignIn
}