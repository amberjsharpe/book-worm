'use strict';
let search = require('./search-api');
let wishlist = require('./wishlist');
let $ = require('../lib/node_modules/jquery');

// Search button
$('.search-btn').on('click', function(event) {
    event.preventDefault();
    search.searchInputValue();
});

// Add to wishlist button
$(document).on('click', 'button.wishlist-btn', function(event){
    search.checkWishListButton(event);
});

// Mark as read
$(document).on('click', 'button.markread-btn', function(event){
    search.checkBooksReadButton(event);
});

// Delete from Wishlist
$(document).on('click', 'button.delete-btn', function(event) {
    search.deleteFromWishlist(event);
    console.log("clicked");
});

// ** Nav buttons ** //

// Home button
$(document).on('click', '#home-btn', function(event) {
    $('#display').empty();
});

// Wishlist button
$(document).on('click', '#wishlist-btn', function(event) {
    search.getWishListData();
});

// Mark as Read nav button
$(document).on('click', '#readbooks-btn', function() {
    search.getReadBooksData();
});

