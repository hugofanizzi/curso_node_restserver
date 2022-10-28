const { response, request } = require("express");
const bcrypjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  // const { q, nombre = "No Name", apikey, page = 1, limit } = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(desde).limit(limite),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Verificar si el correo existe

  //Encriptar la contraseña
  const salt = bcrypjs.genSaltSync();
  usuario.password = bcrypjs.hashSync(password, salt);

  //Guardar en BD
  await usuario.save();

  res.status(201).json({
    msg: "post API - controlador",
    usuario,
  });
};

const usuariosPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //TODO validar contra BD
  if (password) {
    const salt = bcrypjs.genSaltSync();
    resto.password = bcrypjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.status(400).json({
    usuario,
  });
};

const usuariosPatch = (req = request, res = response) => {
  res.json({
    msg: "patch API - controlador",
  });
};

const usuariosDelete = async (req = request, res = response) => {
  const { id } = req.params;

  //BORRADO FISICAMENTE

  // const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json(usuario);
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
