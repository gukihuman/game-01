const dotenv = require("dotenv");
dotenv.config();
const { MongoClient } = require("mongodb");

MongoClient.connect(
  process.env.CONNECTIONSTRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    module.exports = client;

    // run the server
    const server = require("./server");
    server.listen(process.env.PORT);
  }
);
