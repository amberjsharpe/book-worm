"use strict";
let $ = require("../lib/node_modules/jquery");

function getBooks(searchBooks) {
    return $.ajax({
        url: `https://www.goodreads.com/search.xml?key=Fnqk8bj6Up42xHAAc3anFg&q=${searchBooks}`,
    });
} 

let searchInputValue = () => {
    let value = $("#search").val();
    $('#display').empty();
    // print to DOM (#display) 
    console.log($('#search').val('')); 
};

module.exports = {getBooks, searchInputValue};