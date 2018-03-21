"use strict";
let $ = require("../lib/node_modules/jquery");
let user = require("./user");
let wishlist = require("./wishlist");
let readBooks = require("./mark-read");
let getUser = user.getUser;

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

// Search and Home Page
let booksArray = [];

function parseAndPrintBooks(value){
    getBooks(value).then((books) => {
        let jsonText = xmlToJson(books);
        let booksData = jsonText.GoodreadsResponse.search.results.work;
        booksData.forEach(function(item) {
            var book = item.best_book;
            let bookObject = {
                title: book.title["#text"],
                author: book.author.name["#text"],
                image_url: book.image_url["#text"],
                id: book.id["#text"]
            };
            booksArray.push(bookObject);
        });         
        printSearchResultsToDOM(booksArray);
    });
}

let printSearchResultsToDOM = (booksArray) => {
    $('#display').append(`<div><h2>Search Results</h2></div>`);
    
    for (var i = 0; i < booksArray.length; i++) {
        var bookDiv = 
            `<div class="bookDisplay">
            <h3 class="title">${booksArray[i].title}</h3>
            <h4 class="author">Author: ${booksArray[i].author}</h4>
            <img class="book-img" src="${booksArray[i].image_url}">
            <button id="${booksArray[i].id}" class="wishlist-btn btn btn-outline-success my-2 my-sm-0">Add to Wishlist</button>
            <button class="markread-btn btn search-btn btn-outline-success my-2 my-sm-0">Mark as Read</button>
            </div>
        `;
        document.querySelector("#display").innerHTML += bookDiv;
    }
};

// Wishlist

let printWishlistToDOM = (wishData) => {
    $('#display').empty();
    $('#display').append(`<div><h2>My Wishlist</h2></div>`);

    let wishlistArray = [];
    for (let item in wishData) {
        wishlistArray.push(wishData[item]);
    }

    for (var i = 0; i < wishlistArray.length; i++) {
        var bookDiv = 
            `<div class="bookDisplay">
            <h3 class="title">${wishlistArray[i].title}</h3>
            <h4 class="author">Author: ${wishlistArray[i].author}</h4>
            <img class="book-img" src="${wishlistArray[i].image_url}">
            <button class="markread-btn btn search-btn btn-outline-success my-2 my-sm-0">Mark as Read</button>
            <button class="delete-btn btn search-btn btn-outline-success my-2 my-sm-0">Delete</button>
            </div>
        `;
        document.querySelector("#display").innerHTML += bookDiv;
    }
};

let checkWishListButton = (event) => {
    let matchedBook = booksArray.filter(i => i.id === event.target.id)[0];
    wishlist.addToWishlist(matchedBook).then(wishlistData => {
        console.log(wishlistData);
    });   
};

let getWishListData = () => {
    wishlist.getWishList().then(wishlistData => {
        printWishlistToDOM(wishlistData);
    });
};

// Mark as Read

// let printReadBooksToDOM = (readData) => {
//     $('#display').empty();
//     $('#display').append(`<div><h2>Books I've Read</h2></div>`);

//     let booksReadArray = [];
//     for (let item in readData) {
//         booksReadArray.push(readData[item]);
//         console.log("readData", readData[item]);
//         console.log("booksReadArray", booksReadArray);
//     }

//     for (var i = 0; i < booksReadArray.length; i++) {
//         var bookDiv = 
//             `<div class="bookDisplay">
//             <h3 class="title">${booksReadArray[i].title}</h3>
//             <h4 class="author">Author: ${booksReadArray[i].author}</h4>
//             <img class="book-img" src="${booksReadArray[i].image_url}">
//             <button class="markread-btn btn search-btn btn-outline-success my-2 my-sm-0">Mark as Read</button>
//             <button class="delete-btn btn search-btn btn-outline-success my-2 my-sm-0">Delete</button>
//             </div>
//         `;
//         document.querySelector("#display").innerHTML += bookDiv;
//         console.log(booksReadArray);
//     }
// };

// let checkBooksReadButton = (event) => {
//     let matchedBook = booksArray.filter(i => i.id === event.target.id)[0];
//     readBooks.addToMarkRead(matchedBook).then(readData => {
//         console.log(readData);
//     });   
// };

// let getReadBooksData = () => {
//     readBooks.getReadBooks().then(readData => {
//         printReadBooksToDOM(readData);
//     });
// };

module.exports = {
    getBooks, 
    searchInputValue, 
    xmlToJson, 
    parseAndPrintBooks, 
    printSearchResultsToDOM, 
    checkWishListButton,
    getWishListData,
    checkBooksReadButton,
    getReadBooksData
};