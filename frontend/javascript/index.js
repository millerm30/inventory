"use strict";

document.addEventListener("DOMContentLoaded", function() {
  fetch('http://localhost:5000/getAll')
  .then(res => res.json())
  .then(data => loadHTMLTable(data['data']));
});

const addBtn = document.querySelector("#add-name-btn");
const updateBtn = document.querySelector("#update-row-btn");
const cancelUpdateBtn = document.querySelector("#cancel-update-btn");

document.querySelector("table tbody").addEventListener("click", function(event) {
  if (event.target.className === "delete-row-btn") {
    deleteRowById(event.target.dataset.id);
  }
  if (event.target.className === "edit-row-btn") {
    handleEditRow(event.target.dataset.id);
  }
});

function deleteRowById (id) {
  fetch('http://localhost:5000/delete/' + id, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      location.reload();
    }
  })
};

cancelUpdateBtn.onclick = () => {
  const updateSection = document.querySelector("#update-row");
  updateSection.hidden = true;
};

function handleEditRow(id) {
  const updateSection = document.querySelector("#update-row");
  updateSection.hidden = false;
  document.querySelector("#update-name-input").dataset.id = id;
};

updateBtn.onclick = function () {
  const updateNameInput = document.querySelector("#update-name-input");
  fetch("http://localhost:5000/update", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      id: updateNameInput.dataset.id,
      name: updateNameInput.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
};

addBtn.onclick = function() {
  const nameInput = document.querySelector("#name-input");
  const brandInput = document.querySelector("#brand-input");
  const serialInput = document.querySelector("#serial-input");
  const modelInput = document.querySelector("#model-input");
  const name = nameInput.value;
  const brand = brandInput.value;
  const serial = serialInput.value;
  const model = modelInput.value;
  nameInput.value = "";
  brandInput.value = "";
  serialInput.value = "";
  modelInput.value = "";

  fetch('http://localhost:5000/insert', {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ name: name, brand: brand, serial: serial, model: model }),
  })
  .then(res => res.json())
  .then(data => insertRowIntoTable(data['data']));
};

function insertRowIntoTable(data) {
  const table = document.querySelector("table tbody");
  const isTableData = table.querySelector(".no-data");
  let tableHtml = "<tr>";
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === "dateAdded") {
        data[key] = new Date(data[key]).toLocaleString();
      }
      tableHtml += `<td>${data[key]}</td>`;
    }
  }
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;
    tableHtml += "</tr>";
  if (isTableData) {
    table.innerHTML = tableHtml;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHtml;
  }
};

function loadHTMLTable(data) {
  const table = document.querySelector("table tbody");

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='8'>No Data</td></tr>";
    return;
  }

  let tableHtml = "";

  data.forEach(function ({ id, name, brand, serial_number, model_number }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${name}</td>`;
    tableHtml += `<td>${brand}</td>`;
    tableHtml += `<td>${model_number}</td>`;
    tableHtml += `<td>${serial_number}</td>`;
    tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;

};