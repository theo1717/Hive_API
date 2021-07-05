const express = require("express"),
  router = express.Router(),
  placaController = require("../controllers/placaController"),
  authMiddleware = require("../middlewares/auth");

//Rotas sobre os usuários

router.use(authMiddleware);

router.get("/listar", placaController.listar);

module.exports = router;
