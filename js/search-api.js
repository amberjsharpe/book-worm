"use strict";
let $ = require("../lib/node_modules/jquery");

// Pull API
function getBooks(searchBooks) {
    return $.ajax({
        url: `https://www.goodreads.com/search.xml?key=Fnqk8bj6Up42xHAAc3anFg&q=${searchBooks}`,
    })
} 
// Returns promise - .then() where I call it

// Get value from Search Input
let searchInputValue = () => {
    let value = $("#search").val();
    console.log(value);
    $('#display').empty();
    console.log($('#search').val('')); 
};


module.exports = {getBooks, searchInputValue, buildBooks};