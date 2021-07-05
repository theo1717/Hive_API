const { Schema, model } = require("../db");

const SchemaPlaca = new Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["temp", "som", "co2"],
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  { versionKey: "_version" }
);

module.exports = model("Placa", SchemaPlaca, "placas");
