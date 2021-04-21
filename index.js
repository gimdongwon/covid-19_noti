const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var mainRoute = require("./covidRouter.js");

app.use(mainRoute);

app.get("/", (req, res) => {
  res.send({ msg: "Covid server on" });
});

app.use(handleError);

function handleError(err, req, res, next) {
  console.log("Error: ", err);
  res.status(err.code).send({ msg: err.message });
}

var server = app.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});

server.timeout = 5000;
