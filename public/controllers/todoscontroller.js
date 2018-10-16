app.controller("TodosController", [
  "$scope",
  "$http",
  function($scope, $http) {
    $scope.test = " hello dave";
    $scope.bhouses = [];

    $http
      .get("/api/readbhouses")
      .then(function(res) {
        $scope.bhouses = res.data;
      })
      .then(res => console.log($scope.bhouses));

    // FUNCTION FOR ADD
    $scope.onSubmit = () => {
      $http.post("/api/createbhaouse", {
        title_: $scope.title,
        details_: $scope.details
      });
    };

    //FUNCTION FOR DELETE
    $scope.onDelete = obj => {
      if (confirm("are sure you want to delete?")) {
        console.log();
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
      $scope.title = obj.title;
      $scope.details = obj.details;

      $scope.onUpdateSubmit = () => {
        obj.title = $scope.title;
        obj.details = $scope.details;

        $http.post("/api/updatebhouse", {
          ID: obj.Id,
          title: $scope.title,
          details: $scope.details
        });

        $("#close").trigger("click");
        alert("successfully updated");
      };
    };
  }
]);
