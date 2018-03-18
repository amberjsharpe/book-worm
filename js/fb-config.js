"use strict";


let firebase = require("firebase/app"),
    auth = require("firebase/auth"),
    database = require("firebase/database"),
    fb = require("./fb-key"),
    fbData = fb();



var config = {
  apiKey: fbData.apiKey,
  authDomain: fbData.authDomain,
  databaseURL: fbData.databaseURL
};

firebase.initializeApp(config);

firebase.getFBsettings = () => {
	// console.log("getFBsettings", config);
	return config;
};


module.exports = firebase;