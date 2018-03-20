"use strict";
let $ = require("../lib/node_modules/jquery");

// Pull API
function getBooks(searchBooks) {
    return $.ajax({
        url: `https://crossorigin.me/https://www.goodreads.com/search.xml?key=Fnqk8bj6Up42xHAAc3anFg&q='${searchBooks}'`,
        type: "GET",
        dataType: "xml"
    });
} 

// Get value from Search Input
let searchInputValue = () => {
    $('#display').empty();
    let value = $("#search").val();
    booksArray = [];
    parseAndPrintBooks(value);
    $('#search').val('');
};

function xmlToJson(xml) {
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}

// Parses and pushes to booksArray
let booksArray = [];

function parseAndPrintBooks(value){
    getBooks(value).then((books) => {
        console.log("books", books);
        let jsonText = xmlToJson(books);
        console.log("jsontext", jsonText);
        let booksData = jsonText.GoodreadsResponse.search.results.work;
        console.log("booksData", booksData);
        booksData.forEach(function(item) {
            var book = item.best_book;
            let bookObject = {
                title: book.title["#text"],
                author: book.author.name["#text"],
                image_url: book.image_url["#text"]
            };
            booksArray.push(bookObject);
            // console.log("book author", book.author.name["#text"]);
            // console.log("book title", book.title["#text"]);
            // console.log("book image", book.image_url["#text"]);
        });         
        printSearchResultsToDOM(booksArray);
    });
}

let printSearchResultsToDOM = () => {
    $('#display').append(`<div><h2>Search Results</h2></div>`);
    
    for (var i = 0; i < booksArray.length; i++) {
        var bookDiv = 
            `<div class="bookDisplay">
            <h3 class="title">${booksArray[i].title}</h3>
            <h4 class="author">Author: ${booksArray[i].author}</h4>
            <img class="book-img" src="${booksArray[i].image_url}">
            </div>
        `;
        // console.log("booksArray[i]", booksArray[i]);
        document.querySelector("#display").innerHTML += bookDiv;
    }
};

module.exports = {getBooks, searchInputValue, xmlToJson, parseAndPrintBooks, printSearchResultsToDOM, booksArray};