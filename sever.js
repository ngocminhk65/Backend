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
