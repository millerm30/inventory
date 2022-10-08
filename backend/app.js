const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

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
app.post('/insert', (req, res) => {
  const { name } = req.body;
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewName(name);
  result
    .then(data => res.json({ data: data }))
    .catch(err => console.log(err));
});

// read
app.get('/getAll', (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllData()

  result
  .then(data => res.json({ data: data }))
  .catch (err => console.log(err));
});

// update
app.patch('/update', (req, res) => {
  const { id, name } = req.body;
  const db = dbService.getDbServiceInstance();
  const result = db.updateNameById(id, name);

  result
  .then(data => res.json({ success: data }))
  .catch(err => console.log(err));
});

// delete
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();
  const result = db.deleteRowById(id);

  result
    .then(data => res.json({ success: data }))
    .catch(err => console.log(err));
});

// server listening
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));