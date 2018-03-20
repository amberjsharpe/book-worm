"use strict";

let $ = require("../lib/node_modules/jquery"),
    firebase = require("./fb-config"),
    key = require("./fb-key"),
    user = require("./user"),
    search = require("./search-api");
    require("./event-listeners");

function addBooksWishlist(bookObject) {
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/wishlist.json`,
        type: 'POST',
        data: JSON.stringify(bookObject),
        dataType: 'json'
    }).done((wishlistID) => {
        return wishlistID;
    });
}

module.exports = {addBooksWishlist};