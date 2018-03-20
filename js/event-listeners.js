"use strict";
let search = require("./search-api");
let wishlist = require("./wishlist");
let $ = require("../lib/node_modules/jquery");


$(".search-btn").on("click", function(event) {
    event.preventDefault();
    search.searchInputValue();
});

$(".wishlist-btn").on("click", function(event) {
    console.log("clicked wishlist button");
    // wishlist.addBooksWishlist();
});
