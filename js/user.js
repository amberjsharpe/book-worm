"use strict";

let mainJS  = require("./main");
let firebase = require("./fb-config");
let currentUser = null;

//installed firebase into lib folder npm install firebase --save

// loginGoogle
logInGoogle()
.then((result) => {
	console.log("result from login", result.user.uid);
  // user = result.user.uid;
setUser(result.user.uid);

});

//listen for changed state
firebase.auth().onAuthStateChanged((user) => {
	// console.log("onAuthStateChanged", user);

	if (user){
		currentUser = user.uid;
		// console.log("current user Logged in?", currentUser);
	} else {
		currentUser = null;
		// console.log("current user NOT logged in:", currentUser);
	}
});

function logInGoogle(provider) {
	//all firebase functions return a promise!! Add a then when called
    // console.log('tried to login');
    return firebase.auth().signInWithPopup(provider);
}

function logOut(){
	return firebase.auth().signOut();
}

function getUser(){
	// console.log("ran getUser function");
	return currentUser;
}

function setUser(val){
	currentUser = val;
}

module.exports = {logInGoogle, getUser, setUser, logOut};
