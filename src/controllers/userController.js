const Usuario = require("../models/usuario.model");

class UsuarioClass {
  async listar(req, res) {
    try {
      res.send(await Usuario.find({})).end();
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

module.exports = UsuarioClass;
