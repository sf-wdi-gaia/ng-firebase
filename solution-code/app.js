// strict error checking
'use strict';

angular
  .module("ToEatly", ["firebase"])
  .controller("FoodCtrl", foodCtrl);


foodCtrl.$inject = ["$scope", "$firebaseArray"];
function foodCtrl($scope, $firebaseArray) {
  // change to your application URL
  var ref = firebase.database().ref().child("foods");
  // create a synchronized array to store a collection
  $scope.foods = $firebaseArray(ref);
  // add new items to the array
  // the message is automatically added to our Firebase database!
  $scope.addFood = function() {
    $scope.foods.$add({
      name: $scope.food.name,
      yumminess: $scope.food.yumminess
    });
    // clears form
    $scope.food = {};
  };
}