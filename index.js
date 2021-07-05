const express = require("express"),
  morgan = require("morgan"),
  helmet = require("helmet"),
  cors = require("cors"),
  path = require("path"),
  app = express();

require("dotenv").config();

require("./src/mqtt");

//Permite o cors geral
app.use(cors());

//Importa o express.json
//Para receber bodies JSON
app.use(express.json());

//Importa o morgan
app.use(morgan(process.env.MORGAN));

//Importa o helmet
app.use(helmet());

app.use(express.static(path.join(__dirname, "public/landing")));
app.use("/admin", express.static(path.join(__dirname, "public/dashboard")));
//Importa as rotas sobre os usuários
app.get("/dashboard/", (req, res) => res.redirect("/dashboard/home"));
app.use("/api/usuario", require("./src/routes/user.routes"));
app.use("/api/admin", require("./src/routes/admin.routes"));
app.use("/api/placa", require("./src/routes/placa.routes"));
app.use("/api", require("./src/routes/auth.routes"));

app.get("/admin/*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/dashboard", "index.html"));
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/landing", "index.html"));
});

//Configura a porta do servidor
let port;
app.listen((port = process.env.PORT || 80));

console.log("Servidor iniciado na porta:", port);
