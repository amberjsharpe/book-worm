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
    let value = $("#search").val();
    printBooks(value);
    // $('#display').empty();
    // console.log($('#search').val('')); 
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

// Returns promise - .then() where I call it
let booksArray = [];
let booksInfoArray = [];
function parseBooks(value){
    getBooks(value).then((books) => {
        console.log(books);
        let jsonText = xmlToJson(books);
        let booksData = jsonText.GoodreadsResponse.search.results.work;
        booksArray.push(booksData);
        console.log(booksArray);
            for (var i = 0; i < booksArray.length; i++) {
                booksInfoArray.push(booksArray[i].best_book);
                console.log(booksInfoArray);
            }
        // print function
        // printSearchResultsToDOM();
    });
}

// let printSearchResultsToDOM = () => {
//     for (var i = 0; i < booksArray.length; i++) {
//         var bookDiv = 
//             `<div class="bookDisplay">
//             <h2 class="listing__title">:${booksArray[i]}</h2> 
//             </div>
//         `;
//     document.querySelector("display").innerHTML += bookDiv;
//     }


// }

// https://stackoverflow.com/questions/4499652/accessing-a-json-variable-pre-fixed-with-a-hash

module.exports = {getBooks, searchInputValue, xmlToJson, parseBooks};