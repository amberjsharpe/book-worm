"use strict";
let search = require("./search-api");
let wishlist = require("./wishlist");
let $ = require("../lib/node_modules/jquery");

// Search button
$(".search-btn").on("click", function(event) {
    event.preventDefault();
    search.searchInputValue();
});

// Add to wishlist button
$(document).on("click", "button.wishlist-btn", function(event){
    search.checkWishListButton(event, search.booksArray);
});

// Wishlist nav button
$(document).on("click", "#wishlist-btn", function(event) {
    search.getWishList();
});
