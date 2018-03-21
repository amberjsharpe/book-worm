"use strict";

let $ = require("../lib/node_modules/jquery"),
    firebase = require("./fb-config");


// Add to Firebase    
function addToWishlist(wishlistObject) {
    console.log("wishlistObject", wishlistObject);
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/wishlist.json`,
        type: 'POST',
        data: JSON.stringify(wishlistObject),
        dataType: 'json'
    }).done((fbID) => {
        return fbID;
    });
}

function getWishList() {
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/wishlist.json`,
        type: 'GET',
        dataType: 'json'
    }).done((fbID) => {
        return fbID;
    });
}

// Delete to Firebase
function deleteBooksWishlist(fbID) {
    return $.ajax({
      url: `${firebase.getFBsettings().databaseURL}/books/${id}.json`,
      method: 'DELETE'  
    }).done((favData) => {
        return favData;
    });
}

module.exports = {deleteBooksWishlist, addToWishlist, getWishList};