"use strict";
let search = require("./search-api");
let wishlist = require("./wishlist");
let $ = require("../lib/node_modules/jquery");


$(".search-btn").on("click", function(event) {
    event.preventDefault();
    search.searchInputValue();
});

$(document).on("click", "button.wishlist-btn", function(event){
    search.checkWishListButton(event);
});

