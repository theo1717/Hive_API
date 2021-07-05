const mqtt = require("mqtt"),
  randomize = require("randomatic"),
  Dados = require("../models/dados.model"),
  firebase = require("firebase/app");

require("firebase/database");

firebase.initializeApp({
  apiKey: "AIzaSyBzdfK8DVGdU_GjKY84g9y3VrhoR2YKH7A",
  authDomain: "hive-mesh.firebaseapp.com",
  databaseURL: "https://hive-mesh.firebaseio.com",
  projectId: "hive-mesh",
  storageBucket: "hive-mesh.appspot.com",
  appId: "project-971544374064",
});

var client = mqtt.connect("mqtt://3.20.198.54");

client.on("connect", function () {
  client.subscribe("hive/sensors/#");
});

client.on("message", async function (topic, message) {
  // message is Buffer

  if (process.env.NODE_ENV == "development") {
    message = JSON.parse(message);
    console.log(topic);
    console.log(message);
    return;
  }
  console.log(topic, message);

  message = JSON.parse(message);
  if (message.ar) {
    /* Ar */
    firebase
      .database()
      .ref("/curitiba/ar")
      .push({
        _id: randomize("0A", 10),
        value: 100 - Math.floor((message.ar / 4096) * 100) || 0,
        date: new Date().toISOString(),
      });
    await Dados.create({
      tipo: "ar",
      dado: 100 - Math.floor((message.ar / 4096) * 100),
    });
  }

  if (message.umi) {
    /* Umi */
    firebase
      .database()
      .ref("/curitiba/umi")
      .push({
        _id: randomize("0A", 10),
        value: Math.abs(message.umi || 0),
        date: new Date().toISOString(),
      });
    await Dados.create({ tipo: "umi", dado: Math.abs(message.umi) });
  }

  if (message.co) {
    /* Co */
    firebase
      .database()
      .ref("/curitiba/co")
      .push({
        _id: randomize("0A", 10),
        value: Math.floor((message.co / 4096) * 100) || 0,
        date: new Date().toISOString(),
      });
    await Dados.create({
      tipo: "co",
      dado: Math.floor((message.co / 4096) * 100),
    });
  }

  if (message.temp) {
    /* Temp */
    firebase
      .database()
      .ref("/curitiba/temp")
      .push({
        _id: randomize("0A", 10),
        value: Math.abs(message.temp || 0),
        date: new Date().toISOString(),
      });
    await Dados.create({ tipo: "temp", dado: Math.abs(message.temp) });
  }
});
