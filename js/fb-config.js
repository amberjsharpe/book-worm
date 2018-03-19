"use strict";

let firebase = require("../lib/node_modules/firebase/app"),
    auth = require("../lib/node_modules/firebase/auth"),
    database = require("../lib/node_modules/firebase/database"),
    fb = require("./fb-key"),
    fbData = fb();

var config = {
  apiKey: fbData.apiKey,
  authDomain: fbData.authDomain,
  databaseURL: fbData.databaseURL
};

firebase.initializeApp(config);

firebase.getFBsettings = () => {
	return config;
};


module.exports = firebase;