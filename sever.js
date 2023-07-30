/*

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Cấu hình kết nối với cơ sở dữ liệu MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: null,
  database: 'ngu'
});

// Kết nối tới cơ sở dữ liệu MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Sử dụng body-parser middleware để truy cập dữ liệu gửi lên từ form
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Đăng ký tài khoản
app.post('/register', (req, res) => {
    const { username, phone, email, password } = req.body;
  
    // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
    const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        throw err;
      }
  
      if (result.length > 0) {
        res.send('Email đã được sử dụng. Vui lòng chọn email khác.');
      } else {
        // Nếu người dùng không tồn tại, thêm tài khoản mới vào cơ sở dữ liệu
        const createUserQuery = `INSERT INTO users (username, phone, email, password) VALUES (?, ?, ?, ?)`;
        db.query(createUserQuery, [username, phone, email, password], (err, result) => {
          if (err) {
            throw err;
          }
          res.send('Đăng ký thành công!');
        });
      }
    });
  });
  

// Đăng nhập
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra xem người dùng tồn tại trong cơ sở dữ liệu và mật khẩu khớp hay không
  const checkUserQuery = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.query(checkUserQuery, [email, password], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      res.send('Đăng nhập thành công!');
    } else {
      res.send('Email hoặc mật khẩu không đúng.');
    }
  });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

*/

const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const port = 3000;


app.use(cors());

// Kết nối cơ sở dữ liệu (thay đổi thông tin kết nối phù hợp)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: null,
  database: 'dtb'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database!');
  }
});

// Định nghĩa route API để lấy chi tiết sản phẩm dựa trên id
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  // Truy vấn dữ liệu sản phẩm dựa trên ID từ bảng "product"
  const query = 'SELECT * FROM product WHERE id = ?';

  connection.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ error: 'Error fetching product.' });
    } else {
      if (results.length > 0) {
        // Trả về dữ liệu sản phẩm dưới dạng JSON
        res.json(results[0]);
      } else {
        res.status(404).json({ error: 'Product not found.' });
      }
    }
  });
});

app.get('/api/reproducts/:type', (req, res) => {
  const { type } = req.params;
  
  // Truy vấn cơ sở dữ liệu để lấy ra các sản phẩm có cùng type
  const sqlQuery = `SELECT * FROM product WHERE type = ?`;
  connection.query(sqlQuery, [type], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching product.' });
    } else {
      res.json(result);
    }
  });
});

// Khởi chạy server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});