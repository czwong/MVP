const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "/../client/dist")));

app.set("port", process.env.PORT || 8080);

var server = app.listen(app.get("port"), () => {
  console.log("listening on port ", server.address().port);
});
