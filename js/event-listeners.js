"use strict";
let search = require("./search-api");
let $ = require("../lib/node_modules/jquery");


$(".search-btn").on("click", function(event) {
    console.log(event);
    event.preventDefault();
    console.log("search");
    search.searchInputValue();
});
