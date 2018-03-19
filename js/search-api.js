"use strict";
let $ = require("../lib/node_modules/jquery");

// Pull API
function getBooks(searchBooks) {
    return $.ajax({
        url: `https://www.goodreads.com/search.xml?key=Fnqk8bj6Up42xHAAc3anFg&q='${searchBooks}'`,
    })
} 

// Get value from Search Input
let searchInputValue = () => {
    let value = $("#search").val();
    console.log(value);
    $('#display').empty();
    console.log($('#search').val('')); 
};

// Returns promise - .then() where I call it
// let booksArray = [];
// function printBooks(value){
//     getBooks(value)
//    .then((books) => {
//     console.log(books);
//     let booksData = XML.parse(books);
//     console.log(booksArray);
//     booksArray.push(booksData);
//     // print function
//    });
// }

module.exports = {getBooks, searchInputValue};