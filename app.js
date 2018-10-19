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
var pool = mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "wrine",
  connectionLimit: "100"
});

let instance = {};

//REGISTER USER
app.post("/api/signup", (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      `INSERT INTO
          users(firstName, lastName, password, email)
          VALUES( "${req.body.firstName}",
                  "${req.body.lastName}",
                  "${req.body.password}",
                  "${req.body.email}")`,
      (error, results) => {
        if (results === undefined) {
          res.send(
            `${
              req.body.email
            } IS ALREADY REGISTERD PLEASE USE ANOTHER EMAIL TO SIGNUP`
          );
        } else {
          res.send("SUCCESSFULLY REGISTERED A NEW USER");
          instance.ID = results.insertId.toString();
          instance.firstName = req.body.firstName;
          instance.lastName = req.body.lastName;
          instance.email = req.body.email;
          instance.image = "user.png";
        }
        connection.release();
        connection.destroy();
      }
    );
  });
});

//API FOR SIGNIN
app.post("/api/signin", (req, res) => {
  console.log(req.body);
  pool.getConnection((err, connection) => {
    connection.query(
      `select * from users where email="${req.body.email}" and password="${
        req.body.password
      }"`,
      (err, results) => {
        if (results.length !== 0) {
          instance = results[0];
          res.send("SUCCESSFULLY LOGIN");
        } else {
          res.send("INVALID USERNAME OR PASSWORD");
        }
        connection.release();
        connection.destroy();
      }
    );
  });
});

//READ BHAUSES
app.get("/api/readbhouses", (request, responses) => {
  pool.getConnection((err, con) => {
    con.query(
      `SELECT u.firstname, u.lastname, u.details, u.email,
                b.locatedin, b.price, b.facilities, b.additionalpayment,
                b.additionaldescriptions, b.locationaddress, b.image, b.userID, b.Id
              from bhouses as b, users as u
              where u.id = b.userid`,
      (error, results) => {
        responses.send(results);
        con.release();
        con.destroy();
      }
    );
  });
});

//CREATE POST
app.post("/api/createbhaouse", (request, responses) => {
  pool.getConnection((err, con) => {
    if (!err) {
      con.query(
        `insert into bhouses (locatedin, facilities, image, additionalpayment, additionaldescriptions, price, locationaddress, userid)
  values(
    '${request.body.locatedin}',
    '${request.body.facilities}',
    '${request.body.image}',
    '${request.body.additionalpayment}',
    '${request.body.additionaldescriptions}',
    '${request.body.rentprice}',
    '${request.body.locationaddress}',
    '${instance.ID}')`,
        () => {
          con.release();
          con.destroy();
        }
      );
    }
  });
  console.log(instance);
});

//DELETE POST
app.post("/api/deletebhouse", (req, res) => {
  pool.getConnection((err, con) => {
    con.query(`DELETE FROM bhouses WHERE Id = '${req.body.ID}'`, () => {
      con.release();
      con.destroy();
    });
  });
});

//UPDATE POST
app.post("/api/updatebhouse", (req, res) => {
  pool.getConnection((err, con) => {
    con.query(
      `UPDATE bhouses SET
        locatedin = '${req.body.locatedin}',
        price = '${req.body.price}',
        facilities = '${req.body.facilities}',
        additionaldescriptions = '${req.body.additionaldescriptions}',
        additionalpayment = '${req.body.additionalpayment}',
        locationaddress = '${req.body.locationaddress}'
       where Id='${req.body.ID}'`
    );
  });
  console.log(req.body.ID);
});

//API FOR USER INSTANCE
app.get("/api/instance", (req, res) => {
  res.send(instance);
});

//Default Route to Public
app.get("*", function(req, res) {
  res.sendfile("./public/index.html");
});

module.exports = app;
