"use strict";

let firebase = require("./fb-config");
let provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
let currentUser;

//installed firebase into lib folder npm install firebase --save
// loginGoogle
// logInGoogle(provider).then((result) => {
// 	console.log(result);
// 	console.log("result from login", result.user.uid);
// 	let user = result.user.uid;	  
// 	setUser(user);
// });

//listen for changed state
firebase.auth().onAuthStateChanged((user) => {
	let currentUser;
	console.log("onAuthStateChanged", user);

	if (user){
		currentUser = user.uid;
		console.log("current user Logged in?", currentUser);
	} else {
		currentUser = null;
		console.log("current user NOT logged in:", currentUser);
	}
});

function logInGoogle(provider) {
	//all firebase functions return a promise!! Add a then when called
	// console.log('tried to login');
	console.log(provider);
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
