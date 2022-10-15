const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3030;

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('../frontend'));

//create path for index.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/frontend/index.html');
})

// create
app.post('/insert', (request, response) => {
  const { name, brand, serial, model } = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewName(name, brand, serial, model);
  result
    .then(data => response.json({ data: data }))
    .catch(error => console.log(error));
});

// read
app.get('/getAll', (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllData()

  result
  .then(data => response.json({ data: data }))
  .catch (error => console.log(error));
});

// update
app.patch('/update', (request, response) => {
  const { id, name } = request.body;
  const db = dbService.getDbServiceInstance();
  const result = db.updateNameById(id, name);

  result
  .then(data => response.json({ success: data }))
  .catch(error => console.log(error));
});

// delete
app.delete('/delete/:id', (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();
  const result = db.deleteRowById(id);

  result
    .then(data => response.json({ success: data }))
    .catch(error => console.log(error));
});

// server listening
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));