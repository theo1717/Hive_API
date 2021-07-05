const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

function connectToMongoose() {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => {
      console.log("Conectado ao database");
    })
    .catch(error => {
      connectToMongoose();
      console.log(error);
    });
}

mongoose.connection.on("disconnected", function(error) {
  console.log("Desconectado do database, irá reconectar");
  console.error(error);
  connectToMongoose();
});

mongoose.connection.on("error", function(error) {
  console.log("Erro ao conectar ao database, irá reconectar");
  console.error(error);
  connectToMongoose();
});

connectToMongoose();

module.exports = mongoose;
