const { Schema, model } = require("../db");

const SchemaDados = new Schema(
  {
    dado: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["temp", "umi", "co", "ar"],
    },
    criacao: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: "_version" }
);

module.exports = model("Dados", SchemaDados, "dados");
