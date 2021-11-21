const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');


const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
}

const emailExiste = async (correo = '') => {
    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`Email ya registrado`);
    }
}

const existeUsuarioPorID = async (id) => {
    //Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe`);
    }
}

const existeCategoriaPorID = async (id) => {
    //Verificar si la categoria existe
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoria no existe`);
    }
}

const existeProductoPorID = async (id) => {
    //Verificar si el producto existe
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El producto no existe`);
    }
}

// Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorID,
    existeCategoriaPorID,
    existeProductoPorID,
    coleccionesPermitidas
}