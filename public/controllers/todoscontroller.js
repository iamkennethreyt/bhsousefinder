app.controller("TodosController", [
  "$scope",
  "$http",
  function($scope, $http) {
    $scope.bhouses = [];
    $scope.locatedin = [
      "Apartment",
      "Boarding House",
      "Condominium",
      "Dormitory",
      "Houses"
    ];
    $scope.selectedlocatedin = "";

    $scope.changeLocatedIn = param => {
      $scope.selectedlocatedin = param;
    };

    const validatator = (params, param2) => {
      if (!params) {
        alert(`PLEASE INPUT ${param2}`);
        return null;
      }
    };

    //FUNCTION FOR SIGNIN
    $scope.signin = () => {
      if (!$scope.password || !$scope.email) {
        validatator($scope.email, "EMAIL");
        validatator($scope.password, "PASSWORD");
      } else {
        $http
          .post("/api/signin", {
            email: $scope.email,
            password: $scope.password
          })
          .then(res => {
            if (res.data === "SUCCESSFULLY LOGIN") {
              getInstance();
              alert(res.data);
              window.location.href = "#!/adminindex";
            } else {
              alert(res.data);
            }
          });
      }
    };

    //SIGNUP FUNCTION
    $scope.signup = () => {
      validatator($scope.firstName, "FIRST NAME");
      validatator($scope.lastName, "LAST NAME");
      validatator($scope.email, "EMAIL");
      validatator($scope.password, "PASSWORD");

      if ($scope.password != $scope.confirmPassword) {
        alert("YOUR PASSWORD DONT MATCH! PLEASE TRY AGAIN");
        return null;
      } else {
        $http
          .post("/api/signup", {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            email: $scope.email,
            password: $scope.password
          })
          .then(res => {
            alert(res.data);
            if (res.data === "SUCCESSFULLY REGISTERED A NEW USER") {
              getInstance();
              window.location.href = "#!/adminindex";
            }
          });
      }
    };

    //FUNCTION FO READ ALL BHOUSE
    const readbhouses = () => {
      $http.get("/api/readbhouses").then(function(res) {
        $scope.bhouses = res.data;
      });
    };
    readbhouses();

    // FUNCTION FOR ADD
    $scope.onSubmit = () => {
      let filestr = document.getElementById("img").value;
      const obj = {
        locatedin: $scope.selectedloc,
        rentprice: $scope.rentprice,
        facilities: $scope.facilities,
        additionalpayment: $scope.addpayment,
        image: filestr.replace("C:\\fakepath\\", ""),
        additionaldescriptions: $scope.addInfo,
        locationaddress: $scope.address,
        location: $scope.location,
        userID: "2"
      };
      $http.post("/api/createbhaouse", obj);
      alert("successfully added");
      // document.getElementById("myform").reset();
    };

    //FUNCTION SIGNOUT
    $scope.signout = () => {
      if (confirm("are you sure you want to signout")) {
        window.location.href = "/#!/index";
      }
    };

    //FUNCTION FOR DELETE
    $scope.onDelete = obj => {
      if (confirm("are sure you want to delete?")) {
        $scope.bhouses.splice($scope.bhouses.indexOf(obj), 1); //DELETE FRONT END
        $http
          .post("/api/deletebhouse", {
            ID: obj.Id
          })
          .then(res => alert(res.data));
      }
    };

    //FUNCTION FOR ADD
    $scope.onUpdate = obj => {
      // console.log(obj);
      $scope.rentprice = obj.price;
      $scope.facilities = obj.facilities;
      $scope.addpayment = obj.additionalpayment;
      $scope.addInfo = obj.additionaldescriptions;
      $scope.address = obj.locationaddress;
      $scope.selectedloc = obj.locatedin;

      $scope.onUpdateSubmit = () => {
        $http.post("/api/updatebhouse", {
          ID: obj.Id,
          locatedin: $scope.selectedloc,
          price: $scope.rentprice,
          facilities: $scope.facilities,
          additionalpayment: $scope.addpayment,
          additionaldescriptions: $scope.addInfo,
          locationaddress: $scope.address
        });
        readbhouses();
        alert("successfully updated");
        $("#close").trigger("click");
      };
    };

    const getInstance = () => {
      $http
        .get("/api/instance")
        .then(res => ($scope.user = res.data))
        .then(
          () =>
            ($scope.test = $scope.user.firstName + " " + $scope.user.lastName)
        );
    };
    getInstance();
  }
]);
