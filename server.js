const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee_db',
});

connection.connect(err => {
  if (err) {
    console.error('Error connection to database');
    return;
  }
  console.log('Connected to database');
});

app.use(bodyParser.json());

app.post('/saveData', (req, res) => {
  const { name, occupation, salary } = req.body;

  const query = 'INSERT INTO employees (name, occupation, salary) VALUES (?, ?, ?)';
  connection.query(query, [name, occupation, salary], (err, results) => {
    if (err) {
      console.error('An error occurred while saving data');
      res.json({ success: false });
      return;
    }

    res.json({ success: true });
  });
});

app.get('/getEmployeeList', (req, res) => {
  const query = 'SELECT * FROM employees';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('An error occurred retrieving the employee list : ' + err.stack);
      res.json([]);
      return;
    }

    res.json(results);
  });
});

app.delete('/deleteEmployee/:id', (req, res) => {
  const employeeId = req.params.id;
  const query = 'DELETE FROM employees WHERE id = ?';
  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('An error occurred deleting data : ' + err.stack);
      res.json({ success: false });
      return;
    }

    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log('Server is running');
});