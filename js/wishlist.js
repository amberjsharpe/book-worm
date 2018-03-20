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


module.exports = {addToWishlist};