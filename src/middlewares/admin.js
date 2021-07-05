const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const admin = req.headers.authorization;

  if (!admin) return res.status(401).send("Unauthorized");

  const parts = admin.split(" ");

  if (!parts.length === 2)
    return res.status(401).send({ error: "Token error" });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Token malformatted" });

  jwt.verify(token, process.env.ADMIN, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token invalid" });

    req.admin = decoded.id;
    return next();
  });
};
