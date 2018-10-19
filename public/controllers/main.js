//Initialize your Todos App

var app = angular.module("ToDos", ["ngRoute"]);

//Configurations
app.config(function($routeProvider) {
  //Set the Routes

  $routeProvider
    .when("/", {
      templateUrl: "../views/index.html",
      controller: "TodosController"
    })
    .when("/addhouse", {
      templateUrl: "../views/addhouse.html",
      controller: "TodosController"
    })
    .when("/signin", {
      templateUrl: "../views/signin.html",
      controller: "TodosController"
    })
    .when("/adminindex", {
      templateUrl: "../views/adminindex.html",
      controller: "TodosController"
    })
    .when("/signup", {
      templateUrl: "../views/signup.html",
      controller: "TodosController"
    })
    .when("/placeAd", {
      templateUrl: "../views/placeAd.html"
    })
    .when("/bulletin", {
      templateUrl: "../views/bulletin.html"
    })
    .when("/topic", {
      templateUrl: "../views/topic.html"
    })
    .otherwise("/");
});
