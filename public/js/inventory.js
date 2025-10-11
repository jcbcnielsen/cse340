"use strict";

// get a list of items in the inventory based on the classification_id
let classificationList = document.getElementById("classificationList");
classificationList.addEventListener("change", function () {
    let classification_id = classificationList.value;
    console.log(`classification_id = ${classification_id}`);
    let classIdURL = `/inv/getInventory/${classification_id}`;
    fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw Error("Network response was not ok.")
            }
        })
        .then(function (data) {
            console.log(data);
            buildInventoryList(data);
        })
        .catch(function (error) {
            console.log(`There was a problem: ${error.message}`);
        })
});

// build HTML table components with inventory items and add to DOM
function buildInventoryList(data) {
    let invDisplay = document.getElementById("invDisplay");
    // set up the table labels
    let dataTable = `<thead><tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr></thead>`;
    // set up the table body
    dataTable += `<tbody>`;
    // iterate over the vehicles in the array and put each of them in a row
    data.forEach((element) => {
        console.log(`${element.inv_id}, ${element.inv_model}`);
        dataTable += `
            <tr><td>${element.inv_make} ${element.inv_model}</td>
            <td><a href="/inv/edit/${element.inv_id}" title="Click to update">Modify</a></td>
            <td><a href="/inv/delete/${element.inv_id}" title="Click to delete">Delete</a></td>`;
    });
    dataTable += `</tbody>`;
    // display the contents in the inventory management view
    invDisplay.innerHTML = dataTable;
}