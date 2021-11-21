const { response } = require("express")

const validarArchivoSubir = (req, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            en: -1,
            m: "No hay archivos para subir"
        });

    }

    next();

}

module.exports = {
    validarArchivoSubir
}