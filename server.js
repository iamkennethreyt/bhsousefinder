
//main app
var app = require("./app");

// server
var port = process.env.PORT || 8080;
app.listen(port, function(){
  console.log("App listening on port ." + port);
});
