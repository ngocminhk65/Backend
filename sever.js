const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
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

app.get('/api/products', (req, res) => {
  // Truy vấn dữ liệu sản phẩm từ bảng "product"
  const query = 'SELECT name, price, image_url, type, id FROM product';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error querying database:', error);
          res.status(500).json({ error: 'Error querying database' });
      } else {
          // Trả về mảng products chứa thông tin của sản phẩm
          const products = results.map(result => ({
              name: result.name,
              price: result.price,
              image_url: result.image_url,
              type: result.type,
              id: result.id
          }));
          res.json(products);
      }
  });
});

app.get("/api/search", (req, res) => {
  const searchTerm = req.query.q; // Lấy tham số tìm kiếm từ URL

  const query =
    "SELECT name, image_url, price, id FROM product WHERE name LIKE ? OR type LIKE ?";
  const searchValue = `%${searchTerm}%`;
  connection.query(query, [searchValue, searchValue], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "An error occurred while processing your request." });
    } else {
      res.json(results);
    }
  });
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
    connection.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        throw err;
      }
  
      if (result.length > 0) {
        res.send('Email đã được sử dụng. Vui lòng chọn email khác.');
      } else {
        // Nếu người dùng không tồn tại, thêm tài khoản mới vào cơ sở dữ liệu
        const createUserQuery = `INSERT INTO users (username, phone, email, password) VALUES (?, ?, ?, ?)`;
        connection.query(createUserQuery, [username, phone, email, password], (err, result) => {
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
  connection.query(checkUserQuery, [email, password], (err, result) => {
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

// Khởi chạy server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
