const mysql2 = require('mysql2');
const dotenv = (require('dotenv'));
dotenv.config();
let instance = null;

const connection = mysql2.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    //console.log('db ' + connection.state);
  }
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }
  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM names';
        connection.query(query, (error, results) => {
          if (error) reject(new Error(error.message));
          resolve(results);
        } )
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async insertNewName(name) {
    try {
      const dateAdded = new Date();
      const insertID = await new Promise((resolve, reject) => {
        const query = "INSERT INTO names (name, date_added) VALUES (?, ?)";
        connection.query(query, [name, dateAdded], (error, result) => {
          if (error) reject(new Error(error.message));
          resolve(result.insertId);
        });
      });
      return {
        id: insertID,
        name: name,
        dateAdded: dateAdded
        };
    } catch (error) {
      console.log(error);
    }
  }
  async deleteRowById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM names WHERE id = ?";
        connection.query(query, [id], (error, result) => {
          if (error) reject(new Error(error.message));
          resolve(result.affectedRows);
        })
      });
        return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async updateNameById(id, name) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE names SET name = ? WHERE id = ?";
        connection.query(query, [name, id], (error, result) => {
          if (error) reject(new Error(error.message));
          resolve(result.affectedRows);
        })
      });
        return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
};

module.exports = DbService;