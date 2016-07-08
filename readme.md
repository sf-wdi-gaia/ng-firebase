#🔥AngularFire🔥

##Learning Objectives

By the end of this lesson you will be able to:

* Write Javascript that communicates with a Firebase back-end
* Explain the difference between HTTP and Websocket protocols
* Integrate AngularFire into an Angular app
* Deploy your app to Firebase Hosting
* Implement 3-way data binding!


##Firebase Intro

[Firebase](https://firebase.google.com/) is a Platform as a Service (PaaS) that provides a graphical interface to set up a back end, both the database and api.

We will be using the [AngularFire](https://github.com/firebase/angularfire) library to access Firebase from Angular. Google owns Firebase and developed Angular, so they work nicely together.

Let's take a look at this demo [Chat Room App](https://firechat.firebaseapp.com/) to see how it can allow us to build real-time applications.

###Websockets

To achieve this kind of performance, we are using a different connection mechanism: Websockets. Instead of HTTP (HyperText Transfer Protocol), which supports the familiar request/response cycle, Websockets maintain a connection between your browser and the server, allowing data to be passed bidirectionally. These connections are persistent (always on), full-duplex (bi-directional) and real time.

Picture HTTP as the our *postal system*, you, abroad, send out some letters to a friend back home. The system delivers these letters through various paths and arrive safely. Your friend reads them and sends a letter back, knowing your location. In http, the server can not send you a message unless you first send a request: the request/response cycle.

Websockets are more like a *phone call*. You have the ability to hold a conversation, talking at the same time. Once you have initiated a connection with the server, both an you can send messages, as needed.

<figure>
    <img src="https://camo.githubusercontent.com/c0e4e20b1756769aa20540351c69b1757d1c9cb1/687474703a2f2f7777772e7075626e75622e636f6d2f626c6f672f77702d636f6e74656e742f75706c6f6164732f323031342f30392f576562536f636b6574732d4469616772616d2e706e67">
    <figcaption>A client can send an HTTP request to the server which can reply with status 426, "Upgrade Required". At that point the client can then send a new request with the appropriate upgrade headers while keeping the connection open.</figcaption>
</figure>

###Setup

`cd` into `starter-code` and `bower install`. We have Angular, Firebase, and AngularFire as our dependencies.

###Writing Data

```js
// in JS console
var root = firebase.database().ref();
var msgDB = root.child("messages");
msgDB.set({"WDI29": "Is learning Firebase"});
```

```js
msgDB.push({name: "<Your name>", message: "<Your message>"})
```

>Take a moment to explore the difference between [`.set`](https://firebase.google.com/docs/reference/js/firebase.database.Reference#set) and [`.push`](https://firebase.google.com/docs/reference/js/firebase.database.Reference#push). How would you summarize it?

###Reading Data

Using Firebase's native ability to handle web sockets, you trigger an event every time a child is added

```js
msgDB.on('child_added', function(snapshot) {
  console.log("NEW CHILD ADDED:", snapshot.val());
});
```

>`.push` something to your backed and watch the callback get triggered.

More on data event listeners to [retrieve data](https://www.firebase.com/docs/web/guide/retrieving-data.html).

###Structuring Data

```js
var usersDB = root.child("users");
usersDB.set({
  alanisawesome: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"
  }
});
```

Now we can go to `https://sf-wdi-29.firebaseio-demo.com/users` and see the users we just created.

We can overwrite each of our following users, which is similar to a `PUT`.

```js
usersDB.child("alanisawesome").set({
  date_of_birth: "6/23/12",
  full_name: "Alan Turing"
});
usersDB.child("gracehop").set({
  date_of_birth: "12/9/06",
  full_name: "Grace Hopper"
});
```
We can also just update an attribute, which is similar to a `PATCH`.

```js
var hopperRef = usersDB.child("gracehop");
hopperRef.update({
  "nickname": "Amazing Grace"
});
```

##Rapid Prototype: ToEat.ly

###Firebase + Angular

First we'll need to inject `firebase` as a dependency into our Angular application.</summary>

```js
  angular.module("ToEatly", ["firebase"]);
```

Now we have the option of also using `$firebaseObject` or `$firebaseArray` into a controller to help us manage working with firebase objects or collections in angular. Since we're working with a collection of foods let's use a [`$firebaseArray`](https://github.com/firebase/angularfire/blob/master/docs/guide/synchronized-arrays.md) to store them.

```js
//...
.controller("FoodCtrl", foodCtrl);
	
foodCtrl.$inject = ["$scope", "$firebaseArray"];
function foodCtrl($scope, $firebaseArray) {
  // change to your application URL
  var ref = firebase.database().ref().child("foods");
  // create a synchronized array to store a collection
  $scope.foods = $firebaseArray(ref);
}
```

<details>
<summary>How can we use a form to build up a `food` model with the attributes `name` and `yuminess` so that when it is submitted it triggers a function, `addFood`?</summary>

```html
<form ng-submit="addFood()">
    <input placeholder="name" ng-model="food.name">
    <input yuminess="yuminess" ng-model="food.yuminess">
    <button type="submit">Eat me!</button>
</form>
```
</details>

<details>
<summary>How can we send our food model to the backend when the form is submitted? Hint: your `$firebaseArray` has a `.$add` method on it.</summary>

```js
  $scope.addFood = function() {
    $scope.foods.$add({
      name: $scope.food.name,
      yumminess: $scope.food.yumminess
    });
  };
```
</details>

<details>
<summary>How can we repeat all the foods on the page, so we see an index of them?</summary>

```html
<div class="food" ng-repeat="food in foods">
    <b>Name:</b> {{food.name}} | <b>Yumminess:</b> {{food.yumminess}}
</div>
```
</details>

<details>
<summary>How can we modify the `addFood` function so that the form is cleared after it is submitted?</summary>

```js
  $scope.addFood = function() {
    $scope.foods.$add({
      name: $scope.food.name,
      yumminess: $scope.food.yumminess
    });
    // clears form
    $scope.food = {};
  };
```
</details>

###Self Challenges

Figure out the following user stories on your own. Example solutions are in `solution-code`. User can...

* Delete a food
* Edit a food

##Creating your own Application

###Setup

Go to [Firebase's website](https://console.firebase.google.com/) and "Create a New Project" with any name you like. In your project, click on "Add Firebase to your web app" and copy the code, specific to your app, inside the second script tag. Along the lines of...

###Config

```js
// Initialize Firebase
var config = {
	apiKey: "...",
	authDomain: "...",
	databaseURL: "...",
	storageBucket: "",
};
firebase.initializeApp(config);
```

Make sure this configuration code is after the Firebase library but before the application's code.

>Use the `solution-code` as an example.

###Auth Rules

By default, Firebase requires there to be some [authentication]() for all users. While that may be in nice the long run, in order to get a simple app running without auth, it can be turned off. After clicking on a specific project, navigate to the `database` tab; inside of there navigate to the `Rules` sub-tab and change it to the below code to not require authentication.

```json
{
  "rules": {
    ".read": "true",
    ".write": "true"
  }
}
```

Finally, feel free to deploy an app to [Firebase Hosting](https://firebase.google.com/docs/hosting/)! 🔥
