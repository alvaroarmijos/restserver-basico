const { response } = require("express")


const esAdminRole = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            en: -1,
            m: 'Se quiere verificar el role sin validar token primero'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            en: -1,
            m: `${nombre} no es adminsitrador, no autorizado`
        });
    }

    next();
}

const tieneRol = (...roles) => {

    return (req, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                en: -1,
                m: 'Se quiere verificar el role sin validar token primero'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                en: -1,
                m: 'No autorizado'
            });
        }


        next();
    }

}


module.exports = {
    esAdminRole,
    tieneRol,
}