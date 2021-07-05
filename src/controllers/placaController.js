const Placa = require("../models/placa.model");

class Controller {
  static async listar(req, res) {
    try {
      res.send(await Placa.find({})).end();
    } catch (error) {
      return res.status(500).send(error).error;
    }
  }

  static async cadastrar(req, res) {
    try {
      res.send(await Placa.create(req.body)).end();
    } catch (error) {
      return res.status(500).send(error).error;
    }
  }
}

module.exports = Controller;
