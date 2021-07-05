const transporter = require("./index");

const sendMail = async (email, name, token, res) => {
  let mailOptions = {
    from: "hivetechcompany@gmail.com",
    to: email,
    subject: "Ativação de sua conta hive",
    html:
      "<p> Ativacao de conta de: " +
      name +
      "</p>" +
      "<p> Clique aqui para ativar sua conta:" +
      "<a href=" +
      "https://hivetech.com.br/ativar/" +
      token +
      ">" +
      " https://hivetech.com.br/ativar</a> </p>" +
      "<p> A ativação ficará válida por 1h. </p>"
  };
  //Realiza o envio do email
  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      console.log(error);
      res
        .status(400)
        .send({ error: "Erro ao enviar email" })
        .end();
    } else {
      console.log("Email Enviado");
    }
  });
};

module.exports = sendMail;
