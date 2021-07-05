const express = require("express"),
  router = express.Router(),
  authController = require("../controllers/authController"),
  authClass = new authController();

router.post("/login", authClass.login);
router.post("/cadastrar", authClass.cadastrar);
router.post("/login/admin", authClass.adminLogin);
router.post("/cadastrar/admin", authClass.adminCadastrar);
router.post("/validarEmail", authClass.validacaoTokenEmail);
router.post("/reenviarEmail", authClass.generateNewEmailToken);

module.exports = router;
