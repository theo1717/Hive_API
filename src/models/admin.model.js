const { Schema, model } = require("../db"),
  bcrypt = require("bcryptjs");

const AdminSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    select: false
  }
});

AdminSchema.pre("save", async function(next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;

  next();
});

const Admin = model("Admin", AdminSchema, "admins");

module.exports = Admin;
