//imports
var express = require("express");
var app = express();
var morgan = require("morgan");
var mysql = require("mysql");
var bodyParser = require("body-parser");

// config
app.use(express.static(__dirname + "/public"));
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: "true" })); // Parse urlencoded
app.use(bodyParser.json()); // Parse json
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//database config
var pool_todolist = mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "wrine",
  connectionLimit: "100"
});

//controllers

// pool_todolist.getConnection(
//   (err, con) => (!err ? console.log("success") : console.log("failed"))
// );

//READ BHAUSES
app.get("/api/readbhouses", (request, responses) => {
  pool_todolist.getConnection((err, con) => {
    con.query("SELECT * FROM bhouses", (error, results) => {
      responses.json(results);
      con.release();
    });
  });
});

//CREATE POST
app.post("/api/createbhaouse", (davebayut, responses) => {
  pool_todolist.getConnection((err, con) => {
    if (!err) {
      con.query(
        `insert into bhouses (title,details) values('${
          davebayut.body.title_
        }', '${davebayut.body.details_}')`,
        () => {
          con.release();
        }
      );
    }
  });
});

//DELETE POST
app.post("/api/deletebhouse", (req, res) => {
  pool_todolist.getConnection((err, con) => {
    con.query(`DELETE FROM bhouses WHERE Id = '${req.body.ID}'`, () => {
      con.release();
    });
  });
});

//UPDATE POST
app.post("/api/updatebhouse", (req, res) => {
  pool_todolist.getConnection((err, con) => {
    con.query(
      `UPDATE bhouses SET title = '${req.body.title}', details = '${
        req.body.details
      }' where Id='${req.body.ID}'`,
      (err, result) => {
        // con.release();
        console.log("errror============", result);
      }
    );
  });
});

//Default Route to Public
app.get("*", function(req, res) {
  res.sendfile("./public/index.html");
});

module.exports = app;
