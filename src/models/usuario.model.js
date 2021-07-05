const { Schema, model } = require("../db"),
  bcrypt = require("bcryptjs");

const SchemaUsuario = new Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  documento: {
    type: String,
    required: true,
    select: false,
    unique: true
  },
  tipoDocumento: {
    type: String,
    enum: ["cpf", "cnpj"],
    default: "cpf"
  },
  endereco: {
    type: String,
    select: false
  },
  senha: {
    type: String,
    select: false
  },
  ativada: {
    type: Boolean,
    default: false
  },
  emailConfToken: {
    type: String,
    select: false
  },
  emailConfExpiracao: {
    type: Date,
    select: false
  }
});

SchemaUsuario.pre("save", async function(next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;

  next();
});

const Usuario = model("Usuario", SchemaUsuario, "usuarios");

module.exports = Usuario;
