const express = require("express"),
  router = express.Router(),
  authMiddleware = require("../middlewares/auth");

//Rotas sobre os usuários
router.get("/testar", (req, res) => {
  res.send("Teste usuário").end();
});

router.use(authMiddleware);


module.exports = router;
