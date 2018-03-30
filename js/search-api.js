'use strict';
let $ = require('../lib/node_modules/jquery');
let wishlist = require('./wishlist');
let readBooks = require('./mark-read');
let user = require('./user');
let firebase = require("./fb-config");

// API calls
function getBooks(searchBooks) {
    return $.ajax({
        url: `https://crossorigin.me/https://www.goodreads.com/search.xml?key=Fnqk8bj6Up42xHAAc3anFg&q='${searchBooks}'`,
        type: 'GET',
        dataType: 'xml'
    });
}

function getBookDescriptions() {
    return $.ajax({
        url: `https://crossorigin.me/https://www.goodreads.com/book/show.xml?key=Fnqk8bj6Up42xHAAc3anFg&id=15881`,
        type: 'GET',
        dataType: 'xml'
    });
}

console.log(getBookDescriptions());

// Get value from Search Input
let searchInputValue = () => {
    $('#display').empty();
    $("#loading-display").addClass("loading");
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
    $('#heading-display').append(`<div><h2>Search Results (${booksArray.length})</h2></div>`);
    for (var i = 0; i < booksArray.length; i++) {
        var bookDiv =
            `<div class="bookDisplay card">
                <div>
                    <img class="book-img card-img-top" src="${booksArray[i].image_url}">
                    <h3 class="title card-title">${booksArray[i].title}</h3>
                    <h4 class="author card-text">Author: ${booksArray[i].author}</h4>
                </div>    
                <div class="book-btn-display btn-group-vertical">
                    <button id=${booksArray[i].id}-desc" class="desc-btn btn btn-outline-success my-2 my-sm-0">See Description</button>
                    <button id="${booksArray[i].id}" class="wishlist-btn btn btn-outline-success my-2 my-sm-0">Add to Wishlist</button>
                    <button id="${booksArray[i].id}-read" class="markread-btn btn search-btn btn-outline-success my-2 my-sm-0">Mark as Read</button>
                </div>    
            </div>
        `;
        $("#loading-display").removeClass("loading");
        document.querySelector('#display').innerHTML += bookDiv;
    }
};
// Wishlist
let wishlistArray = [];
let printWishlistToDOM = (wishData) => {
    $('#heading-display').empty();
    $('#display').empty();
    
    wishlistArray = [];
    for (let item in wishData) {
        let wishObj = wishData[item];
        wishObj.key = item;
        wishlistArray.push(wishObj);
    }
    $('#heading-display').append(`<div><h2>My Wishlist (${wishlistArray.length})</h2></div>`);
    wishlistArray.forEach(function(d, i) {
        var bookDiv =
        `<div class="bookDisplay card wishlist-card">
            <div>
                <img class="book-img card-img-top" src="${d.image_url}">
                <h3 class="title card-title">${d.title}</h3>
                <h4 class="author card-text">Author: ${d.author}</h4>
            </div>    
            <div class="book-btn-display btn-group-vertical">
                <button id=${d.id}-desc" class="desc-btn btn btn-outline-success my-2 my-sm-0">See Description</button>
                <button id="${d.key}" class="wish-delete-btn btn search-btn btn-outline-success my-2 my-sm-0">Delete</button>
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
    wishlist.deleteFromWishlist(event.target.id).then(wishlistData => {  
        $(`#${event.target.id}`).closest('.bookDisplay').remove();
        wishlistArray = wishlistArray.filter(i => i.key !== event.target.id);
        $('#heading-display').replaceWith(`<div id="heading-display"><div><h2>My Wishlist (${wishlistArray.length})</h2></div></div>`);
    });
};

// Mark as Read
let booksReadArray = [];
let printReadBooksToDOM = (readData) => {
    $('#heading-display').empty();
    $('#display').empty();
    
    booksReadArray = [];

    for (let item in readData) {
        let readObj = readData[item];
        readObj.key = item;
        booksReadArray.push(readObj);
    }

    $('#heading-display').append(`<div><h2>Books I\'ve Read (${booksReadArray.length})</h2></div>`);
    booksReadArray.forEach(function(d, i) {
        var bookDiv =
            `<div class="bookDisplay card search-card">
                <div>
                    <img class="book-img card-img-top" src="${d.image_url}">
                    <h3 class="title card-title">${d.title}</h3>
                    <h4 class="author card-text">Author: ${d.author}</h4>
                </div>    
                <div class="book-btn-display btn-group-vertical">
                    <button id="${d.key}" class="read-delete-btn btn search-btn btn-outline-success my-2 my-sm-0">Delete</button>
                    <button id=${d.id}-desc" class="desc-btn btn btn-outline-success my-2 my-sm-0">See Description</button>
                </div>     
            </div>
        `;
        document.querySelector('#display').innerHTML += bookDiv;
    });
};

let checkBooksReadButton = (event) => {
    let card = event.target.closest('.card');
    let arr;
        
    if ($(card).hasClass('wishlist-card')) {
        arr = wishlistArray;
    } else {
        arr = booksArray;
    }

    let matchedBook = arr.filter(i => `${i.id}-read` === `${event.target.id}`)[0];
    readBooks.addToMarkRead(matchedBook).then(readData => {
        console.log(readData);
    });
};

let getReadBooksData = () => {
    readBooks.getReadBooks().then(readData => {
        printReadBooksToDOM(readData);
    });
};

let deleteFromRead = (event) => {
    readBooks.deleteFromRead(event.target.id).then(readData => {  
     $(`#${event.target.id}`).closest('.bookDisplay').remove();
     booksReadArray = booksReadArray.filter(i => i.key !== event.target.id);
     $('#heading-display').replaceWith(`<div id="heading-display"><div><h2>Books I\'ve Read (${booksReadArray.length})</h2></div></div>`);
    });
};

module.exports = {
    getBookDescriptions,
    booksArray,
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