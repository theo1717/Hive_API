const express = require("express"),
  router = express.Router(),
  userController = require("../controllers/userController"),
  placaController = require("../controllers/placaController"),
  userClass = new userController(),
  adminMiddleware = require("../middlewares/admin");

router.use(adminMiddleware);

router.get("/usuarios/listar", userClass.listar);
router.post("/placa/cadastrar", placaController.cadastrar);

module.exports = router;
