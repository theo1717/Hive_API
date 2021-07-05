const Usuario = require("../models/usuario.model"),
  Admin = require("../models/admin.model"),
  jwt = require("jsonwebtoken"),
  validacaoEmail = require("../mail/validacaoEmail"),
  crypto = require("crypto"),
  bcrypt = require("bcryptjs");

function generateToken(params = {}) {
  return jwt.sign(params, process.env.SECRET, {});
}

function generateAdminToken(params = {}) {
  return jwt.sign(params, process.env.ADMIN, {});
}

class Auth {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const usuario = await Usuario.findOne({ email }).select("+senha");

      if (!usuario)
        return res.status(400).send({ error: "Usuário não encontrado" });

      if (!(await bcrypt.compare(senha, usuario.senha)))
        return res.status(400).send({ error: "Senha inválida" });

      if (!usuario.ativada) {
        return res
          .status(401)
          .send({ error: "Conta não ativada" })
          .end();
      }

      usuario.senha = undefined;

      res.send({
        user: usuario,
        token: generateToken({ id: usuario.id })
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  async cadastrar(req, res) {
    const { email, documento } = req.body;

    try {
      if (await Usuario.findOne({ email }))
        return res.status(400).send({ error: "Email já em uso" });
      if (await Usuario.findOne({ documento }))
        return res.status(400).send({ error: "Documento já em uso" });

      const now = new Date();
      now.setHours(now.getHours() + 1);
      const token = crypto.randomBytes(20).toString("hex");

      req.body.emailConfToken = token;
      req.body.emailConfExpiracao = now;
      const usuario = await Usuario.create(req.body);

      await validacaoEmail(email, usuario.nome, token, res);

      usuario.senha = undefined;

      return res.send({
        usuario
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  async adminLogin(req, res) {
    try {
      const { email, senha } = req.body;
      const admin = await Admin.findOne({ email }).select("+senha");

      if (!admin)
        return res.status(400).send({ error: "Usuário não encontrado" });

      if (!(await bcrypt.compare(senha, admin.senha)))
        return res.status(400).send({ error: "Senha inválida" });

      admin.senha = undefined;

      res.send({
        admin,
        token: generateAdminToken({ id: admin.id })
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  async adminCadastrar(req, res) {
    const { email } = req.body;

    try {
      if (await Admin.findOne({ email }))
        return res.status(400).send({ error: "Email já em uso" });
      const admin = await Admin.create(req.body);

      admin.senha = undefined;

      return res.send({
        admin,
        token: generateAdminToken({ id: admin.id })
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async validacaoTokenEmail(req, res) {
    const { token } = req.body;
    if (!token) {
      return res
        .status(404)
        .send({
          error: "Token faltando"
        })
        .end();
    }

    try {
      if (await Usuario.findOne({ emailConfToken: token, ativada: true })) {
        return res
          .status(401)
          .send({ error: "Já ativado" })
          .end();
      }

      let usuario = await Usuario.findOneAndUpdate(
        { emailConfToken: token, ativada: false },
        { ativada: true }
      );

      if (!usuario) {
        return res
          .status(404)
          .send({
            error: "Ativação não encontrada"
          })
          .end();
      }
      //Verify if the token has expired
      const now = new Date();
      if (now > usuario.emailConfExpires) {
        return res
          .status(408)
          .send({ error: "Token expirado, por favor gere um novo" })
          .end();
      }

      return res.end();
    } catch (error) {
      res
        .status(500)
        .send(error)
        .end();
    }
  }

  async generateNewEmailToken(req, res) {
    let { email } = req.body;
    try {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const newToken = crypto.randomBytes(20).toString("hex");

      const usuario = await Usuario.findOneAndUpdate(
        { email },
        { emailConfToken: newToken, emailConfExpiracao: now }
      );

      await validacaoEmail(email, usuario.nome, newToken, res);
      return res.end();
    } catch (error) {
      return res.status(500).end();
    }
  }
}

module.exports = Auth;
