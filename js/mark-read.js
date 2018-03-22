"use strict";
let $ = require("../lib/node_modules/jquery"),
    firebase = require("./fb-config");

// Add to Firebase    
function addToMarkRead(readObject) {
    console.log("markAsRead", readObject);
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/read.json`,
        type: 'POST',
        data: JSON.stringify(readObject),
        dataType: 'json'
    }).done((fbID) => {
        return fbID;
    });
}

function getReadBooks() {
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/read.json`,
        type: 'GET',
        dataType: 'json'
    }).done((fbID) => {
        return fbID;
    });
}

function deleteFromRead(fbID) {
    console.log("fbid", fbID);
    return $.ajax({
      url: `${firebase.getFBsettings().databaseURL}/read/${fbID}.json`,
      method: 'DELETE'  
    }).done((fbData) => {
        return fbData;
    });
}

module.exports = {deleteFromRead, addToMarkRead, getReadBooks};