'use strict';
let $ = require('../lib/node_modules/jquery');
let wishlist = require('./wishlist');
let readBooks = require('./mark-read');
let user = require('./user');
let firebase = require("./fb-config");

// Pull API
function getBooks(searchBooks) {
    return $.ajax({
        url: `https://crossorigin.me/https://www.goodreads.com/search.xml?key=Fnqk8bj6Up42xHAAc3anFg&q='${searchBooks}'`,
        type: 'GET',
        dataType: 'xml'
    });
}

// Get value from Search Input
let searchInputValue = () => {
    $('#display').empty();
    let value = $('#search').val();
    parseAndPrintBooks(value);
    $('#search').val('');
};
function xmlToJson(xml) {
    // Create the return object
    var obj = {};
    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
        obj['@attributes'] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
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
            if (typeof(obj[nodeName]) === 'undefined') {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) === 'undefined') {
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
    booksArray = [];
    getBooks(value).then((books) => {
        let jsonText = xmlToJson(books);
        let booksData = jsonText.GoodreadsResponse.search.results.work;
        booksData.forEach(function(item) {
            var book = item.best_book;
            let bookObject = {
                title: book.title['#text'],
                author: book.author.name['#text'],
                image_url: book.image_url['#text'],
                id: book.id['#text']
            };
            booksArray.push(bookObject);
        });
        printSearchResultsToDOM(booksArray);
    });
}







let printSearchResultsToDOM = (booksArray) => {
    $('#heading-display').empty();
    $('#heading-display').append('<div><h2>Search Results</h2></div>');
    for (var i = 0; i < booksArray.length; i++) {
        var bookDiv =
            `<div class="bookDisplay card">
                <img class="book-img card-img-top" src="${booksArray[i].image_url}">
                <h3 class="title card-title">${booksArray[i].title}</h3>
                <h4 class="author card-text">Author: ${booksArray[i].author}</h4>
                <div class="book-btn-display">
                    <button id="${booksArray[i].id}" class="wishlist-btn btn btn-outline-success my-2 my-sm-0">Add to Wishlist</button>
                    <button id="${booksArray[i].id}-read" class="markread-btn btn search-btn btn-outline-success my-2 my-sm-0">Mark as Read</button>
                </div>    
            </div>
        `;
        document.querySelector('#display').innerHTML += bookDiv;
    }
};
// Wishlist
let printWishlistToDOM = (wishData) => {
    $('#heading-display').empty();
    $('#display').empty();
    $('#heading-display').append('<div><h2>My Wishlist</h2></div>');
    let wishlistArray = [];
    for (let item in wishData) {
        let wishObj = wishData[item];
        wishObj.key = item;
        wishlistArray.push(wishObj);
        console.log("item", wishObj);
    }

    wishlistArray.forEach(function(d, i) {
        var bookDiv =
        `<div class="bookDisplay card">
            <img class="book-img card-img-top" src="${d.image_url}">
            <h3 class="title card-title">${d.title}</h3>
            <h4 class="author card-text">Author: ${d.author}</h4>
            <div class="book-btn-display">
                <button id="${d.key}" class="delete-btn btn search-btn btn-outline-success my-2 my-sm-0">Delete</button>
                <button id="${d.id}-read" class="markread-btn btn search-btn btn-outline-success my-2 my-sm-0">Mark as Read</button>
            </div>
        </div>
    `;
    document.querySelector('#display').innerHTML += bookDiv;
    });
    
};
let checkWishListButton = (event) => {
    let matchedBook = booksArray.filter(i => i.id === event.target.id)[0];
    wishlist.addToWishlist(matchedBook).then(wishlistData => {
    });
};
let getWishListData = () => {
    wishlist.getWishList().then(wishlistData => {
        printWishlistToDOM(wishlistData);
    });
};

let deleteFromWishlist = (event) => {
    console.log("eventtarget", event.target);
    wishlist.deleteFromWishlist(event.target.id).then(wishlistData => {  
     $(`#${event.target.id}`).closest('div').remove();
    });
};

// Mark as Read
let printReadBooksToDOM = (readData) => {
    $('#heading-display').empty();
    $('#display').empty();
    $('#heading-display').append('<div><h2>Books I\'ve Read</h2></div>');
    let booksReadArray = [];

    for (let item in readData) {
        let readObj = readData[item];
        readObj.key = item;
        booksReadArray.push(readObj);
        console.log("item", readObj);
    }
    booksReadArray.forEach(function(d, i) {
        var bookDiv =
            `<div class="bookDisplay card">
                <img class="book-img card-img-top" src="${d.image_url}">
                <h3 class="title card-title">${d.title}</h3>
                <h4 class="author card-text">Author: ${d.author}</h4>
                <div class="book-btn-display">
                    <button id="${d.key}" class="delete-btn btn search-btn btn-outline-success my-2 my-sm-0">Delete</button>
                </div>     
            </div>
        `;
        document.querySelector('#display').innerHTML += bookDiv;
    });
};
let checkBooksReadButton = (event) => {
    let matchedBook = booksArray.filter(i => `${i.id}-read` === `${event.target.id}`)[0];
    readBooks.addToMarkRead(matchedBook).then(readData => {
        console.log(readData);
    });
};
let getReadBooksData = () => {
    readBooks.getReadBooks().then(readData => {
        console.log(readBooks);
        printReadBooksToDOM(readData);
        console.log(readBooks);
    });
};

let deleteFromRead = (event) => {
    console.log("eventtarget", event.target);
    readBooks.deleteFromRead(event.target.id).then(readData => {  
     $(`#${event.target.id}`).closest('div').remove();
    });
};

module.exports = {
    getBooks,
    searchInputValue,
    xmlToJson,
    parseAndPrintBooks,
    printSearchResultsToDOM,
    checkWishListButton,
    getWishListData,
    checkBooksReadButton,
    getReadBooksData,
    deleteFromWishlist,
    deleteFromRead
};